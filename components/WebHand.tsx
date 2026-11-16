"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// A real 3D hand (the WebXR "generic hand", 25 joints) in a red glove, used by
// the Bump Me pull: it shoots the web, catches the clip, opens and waves.
//
// Model: public/models/hand.glb, from @webxr-input-profiles/assets
// (immersive-web, W3C Software and Document License). See public/models/NOTICE.
//
// How the model is built matters for everything below: its 25 joints are NOT
// parented to each other. They are all siblings, each stored in the hand's own
// space. So bending a knuckle does not carry the rest of the finger with it;
// we do that maths ourselves (see `curlFinger`).
// ---------------------------------------------------------------------------

export type HandPose = "shoot" | "open" | "wave";

const MODEL_URL = "/models/hand.glb";

// In the model's space the fingers point down (-Y), the fingers are spread
// along Z, and the palm faces -X.
const PALM_NORMAL = new THREE.Vector3(-1, 0, 0);

// Joint names per finger, knuckle to tip.
const CHAINS = {
  index: ["index-finger-metacarpal", "index-finger-phalanx-proximal", "index-finger-phalanx-intermediate", "index-finger-phalanx-distal", "index-finger-tip"],
  middle: ["middle-finger-metacarpal", "middle-finger-phalanx-proximal", "middle-finger-phalanx-intermediate", "middle-finger-phalanx-distal", "middle-finger-tip"],
  ring: ["ring-finger-metacarpal", "ring-finger-phalanx-proximal", "ring-finger-phalanx-intermediate", "ring-finger-phalanx-distal", "ring-finger-tip"],
  pinky: ["pinky-finger-metacarpal", "pinky-finger-phalanx-proximal", "pinky-finger-phalanx-intermediate", "pinky-finger-phalanx-distal", "pinky-finger-tip"],
} as const;
type FingerName = keyof typeof CHAINS;
const FINGERS = Object.keys(CHAINS) as FingerName[];

// How far each of a finger's three knuckles bends at full curl (radians).
const FULL_CURL = [1.45, 1.7, 0.95];

// Curl per finger for each pose, 0 = straight, 1 = fully folded.
// "shoot" is the web-shooter sign: middle and ring pressed into the palm.
const POSES: Record<HandPose, Record<FingerName, number>> = {
  shoot: { index: 0.04, middle: 1, ring: 1, pinky: 0.06 },
  open: { index: 0.05, middle: 0.07, ring: 0.09, pinky: 0.1 },
  wave: { index: 0.03, middle: 0.04, ring: 0.05, pinky: 0.06 },
};

// ---------------------------------------------------------------------------
// Glove material: red, with black web lines drawn by the shader.
//
// The lines are not a texture. They are computed per pixel from where that
// pixel sits on the UN-POSED model (`position`, before the bones move it), so
// the pattern is glued to the skin and bends with the fingers.
//
// The pattern copies how the suit's glove is drawn:
//   SPOKES  one line from the wrist to each knuckle and on down the middle of
//           that finger, plus one from the wrist into each gap between
//           fingers (those stop at the knuckles).
//   ARCS    thin cross lines at even steps away from the wrist. Between two
//           spokes each arc sags back toward the wrist and meets the spokes
//           in a point, like the threads of a real web.
// Everything is measured in the plane of the palm (the model's Y and Z).
// ---------------------------------------------------------------------------

// Where the spokes go, read from the model's own joints.
type WebLayout = {
  wrist: [number, number];
  knuckles: [number, number][]; // thumb, index, middle, ring, pinky
  tips: [number, number][]; // a little past each fingertip
  gaps: [number, number][]; // between neighbouring knuckles
};

const v2 = (o: THREE.Vector3): [number, number] => [o.y, o.z];

function handWebLayout(
  scene: THREE.Object3D,
  fingers: Record<FingerName, Finger>
): WebLayout {
  const joint = (name: string) => {
    const o = scene.getObjectByName(name);
    if (!o) throw new Error(`hand.glb is missing joint "${name}"`);
    return o.position;
  };
  // The spokes meet a little way up the forearm, hidden under the sleeve.
  // Meeting exactly at the wrist bunched them into a dark knot on the palm.
  const w = joint("wrist");
  const wrist: [number, number] = [w.y + 0.03, w.z];
  // The thumb is never posed, so its joints still hold their rest positions.
  const digits: { knuckle: [number, number]; tip: [number, number] }[] = [
    { knuckle: v2(joint("thumb-metacarpal")), tip: v2(joint("thumb-tip")) },
    ...FINGERS.map((name) => ({
      knuckle: v2(fingers[name].restPos[1]),
      tip: v2(fingers[name].restPos[4]),
    })),
  ];
  const knuckles = digits.map((d) => d.knuckle);
  const tips = digits.map((d): [number, number] => {
    const dy = d.tip[0] - d.knuckle[0];
    const dz = d.tip[1] - d.knuckle[1];
    const len = Math.hypot(dy, dz);
    const reach = (len + 0.03) / len; // run past the fingertip
    return [d.knuckle[0] + dy * reach, d.knuckle[1] + dz * reach];
  });
  // A gap spoke ends between two knuckles, pulled a little back to the wrist.
  const gaps = knuckles.slice(0, -1).map((k, i): [number, number] => {
    const n = knuckles[i + 1];
    const pull = i === 0 ? 0.3 : 0.14; // the thumb gap sits further back
    const my = (k[0] + n[0]) / 2;
    const mz = (k[1] + n[1]) / 2;
    return [my + (wrist[0] - my) * pull, mz + (wrist[1] - mz) * pull];
  });
  return { wrist, knuckles, tips, gaps };
}

const glslVec2 = (v: [number, number]) => `vec2(${v[0].toFixed(5)}, ${v[1].toFixed(5)})`;
const glslArray = (list: [number, number][]) =>
  `vec2[${list.length}](${list.map(glslVec2).join(", ")})`;

const WEB_INK = "vec3(0.03, 0.02, 0.02)";

// Shader for the hand: spokes along the fingers, arcs sagging between them.
function handWebShader(layout: WebLayout) {
  const n = layout.knuckles.length;
  const g = layout.gaps.length;
  return {
    header: `
      const vec2 WEB_W = ${glslVec2(layout.wrist)};
      const vec2 WEB_K[${n}] = ${glslArray(layout.knuckles)};
      const vec2 WEB_T[${n}] = ${glslArray(layout.tips)};
      const vec2 WEB_G[${g}] = ${glslArray(layout.gaps)};
      // distance from point p to the segment a-b
      float webSeg(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
      }`,
    body: `
      {
        vec2 p = vWebPos.yz;
        float d1 = 1.0;       // distance to the nearest spoke
        float d2 = 1.0;       // ... and to the second nearest
        float dDigit = 1.0;   // nearest FINGER spoke
        float alongFinger = 0.0;
        for (int i = 0; i < ${n}; i++) {
          float d = min(webSeg(p, WEB_W, WEB_K[i]), webSeg(p, WEB_K[i], WEB_T[i]));
          if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
          if (d < dDigit) {
            dDigit = d;
            vec2 dir = normalize(WEB_T[i] - WEB_K[i]);
            alongFinger = length(WEB_K[i] - WEB_W) + dot(p - WEB_K[i], dir);
          }
        }
        for (int j = 0; j < ${g}; j++) {
          float d = webSeg(p, WEB_W, WEB_G[j]);
          if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
        }
        // How far this point is from the wrist: straight-line on the palm,
        // measured along the finger once past the knuckle.
        float reach = max(length(p - WEB_W), alongFinger);
        // 0 on a spoke, 0.5 midway to the next one.
        float t = d1 / max(d1 + d2, 0.00001);
        // The arc sags toward the wrist between spokes: steep at the spoke
        // (a point), flat in the middle.
        float sag = 4.0 * t * (1.0 - t) * min(0.3 * (d1 + d2), 0.0075);
        float step = 0.0165;
        float fv = fract((reach + sag) / step);
        float dArc = min(fv, 1.0 - fv) * step;
        float aaSpoke = clamp(fwidth(d1), 0.00005, 0.002);
        float aaArc = clamp(fwidth(dArc), 0.00005, 0.002);
        float spoke = 1.0 - smoothstep(0.00085, 0.00085 + aaSpoke, d1);
        float arc = 1.0 - smoothstep(0.00050, 0.00050 + aaArc, dArc);
        diffuseColor.rgb = mix(diffuseColor.rgb, ${WEB_INK}, max(spoke, arc) * 0.93);
      }`,
  };
}

// Shader for the sleeve: the same idea wrapped round a cylinder. Ten
// lengthwise lines, and arcs that sag toward the elbow so they line up in
// spirit with the arcs on the hand (both sag away from the fingertips).
function sleeveWebShader() {
  return {
    header: "",
    body: `
      {
        float strips = 10.0;
        float width = 0.0215;                           // metres between lines
        float fu = fract(atan(vWebPos.z, vWebPos.x) / 6.2831853 * strips);
        float t = min(fu, 1.0 - fu);                    // 0 on a line, 0.5 midway
        float dLine = t * width;
        float sag = 4.0 * t * (1.0 - t) * 0.006;
        float step = 0.0165;
        float fv = fract((vWebPos.y - sag) / step);
        float dArc = min(fv, 1.0 - fv) * step;
        float aaLine = clamp(fwidth(dLine), 0.00005, 0.002);
        float aaArc = clamp(fwidth(dArc), 0.00005, 0.002);
        float line = 1.0 - smoothstep(0.00085, 0.00085 + aaLine, dLine);
        float arc = 1.0 - smoothstep(0.00050, 0.00050 + aaArc, dArc);
        diffuseColor.rgb = mix(diffuseColor.rgb, ${WEB_INK}, max(line, arc) * 0.93);
      }`,
  };
}

function makeGloveMaterial(web: { header: string; body: string }, key: string) {
  const material = new THREE.MeshStandardMaterial({
    color: "#c4161c",
    roughness: 0.52,
    metalness: 0.05,
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWebPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWebPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vWebPos;\n${web.header}`)
      .replace("#include <color_fragment>", `#include <color_fragment>\n${web.body}`);
  };
  // Two variants of one material class: tell three they compile differently.
  material.customProgramCacheKey = () => `glove-${key}`;
  return material;
}

type Finger = {
  bones: THREE.Object3D[];
  restPos: THREE.Vector3[];
  restQuat: THREE.Quaternion[];
  axis: THREE.Vector3; // knuckle hinge axis, computed from the rest pose
};

function buildFingers(scene: THREE.Object3D) {
  const out = {} as Record<FingerName, Finger>;
  for (const name of FINGERS) {
    const bones = CHAINS[name].map((n) => {
      const bone = scene.getObjectByName(n);
      if (!bone) throw new Error(`hand.glb is missing joint "${n}"`);
      return bone;
    });
    const restPos = bones.map((b) => b.position.clone());
    const restQuat = bones.map((b) => b.quaternion.clone());
    // Direction the finger points, then the hinge that folds it toward the
    // palm: rotating `dir` about `dir x palmNormal` moves it toward the palm.
    const dir = restPos[4].clone().sub(restPos[1]).normalize();
    const axis = dir.clone().cross(PALM_NORMAL).normalize();
    out[name] = { bones, restPos, restQuat, axis };
  }
  return out;
}

// Scratch objects so the per-frame maths allocates nothing.
const _m = new THREE.Matrix4();
const _step = new THREE.Matrix4();
const _acc = new THREE.Quaternion();
const _q = new THREE.Quaternion();
const _pivot = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _toOrigin = new THREE.Matrix4();
const _fromOrigin = new THREE.Matrix4();
const _rot = new THREE.Matrix4();

// Fold one finger. Walk from the big knuckle to the tip: at each knuckle,
// rotate everything further along the finger around that knuckle's position.
// `curl` is 0 (straight) to 1 (fully folded).
function curlFinger(f: Finger, curl: number) {
  _m.identity();
  _acc.identity();
  for (let k = 1; k <= 4; k++) {
    // where this joint has ended up after the bends before it
    _pivot.copy(f.restPos[k]).applyMatrix4(_m);
    if (k <= 3) {
      _axis.copy(f.axis).applyQuaternion(_acc);
      _q.setFromAxisAngle(_axis, curl * FULL_CURL[k - 1]);
      _toOrigin.makeTranslation(-_pivot.x, -_pivot.y, -_pivot.z);
      _rot.makeRotationFromQuaternion(_q);
      _fromOrigin.makeTranslation(_pivot.x, _pivot.y, _pivot.z);
      _step.copy(_fromOrigin).multiply(_rot).multiply(_toOrigin);
      _m.premultiply(_step);
      _acc.premultiply(_q);
    }
    f.bones[k].position.copy(_pivot);
    f.bones[k].quaternion.copy(_acc).multiply(f.restQuat[k]);
  }
}

function Rig({ pose, onReady }: { pose: HandPose; onReady?: () => void }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const elbow = useRef<THREE.Group>(null);
  const wrist = useRef<THREE.Group>(null);
  const wave = useRef({ amount: 0, time: 0 });
  // Current curl of each finger, eased toward the pose's target every frame.
  // Kept in a ref (not in `fingers`) because it changes 60 times a second and
  // must never trigger a React render.
  const curls = useRef<Record<FingerName, number>>({
    index: 0,
    middle: 0,
    ring: 0,
    pinky: 0,
  });

  const fingers = useMemo(() => buildFingers(gltf.scene), [gltf]);
  const sleeve = useMemo(() => makeGloveMaterial(sleeveWebShader(), "sleeve"), []);
  useEffect(() => () => sleeve.dispose(), [sleeve]);

  // One-time setup: glove material, and tell the parent we can be shown.
  useEffect(() => {
    const glove = makeGloveMaterial(
      handWebShader(handWebLayout(gltf.scene, fingers)),
      "hand"
    );
    gltf.scene.traverse((o) => {
      const mesh = o as THREE.SkinnedMesh;
      if (mesh.isSkinnedMesh) {
        mesh.material = glove;
        // The bones move a lot; never let the renderer cull the hand.
        mesh.frustumCulled = false;
      }
    });
    onReady?.();
    return () => glove.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf]);

  useFrame((_, rawDelta) => {
    // Clamp so a long pause (hidden tab) does not turn into one huge jump.
    const dt = Math.min(rawDelta, 0.05);
    const ease = 1 - Math.exp(-dt * 16);

    for (const name of FINGERS) {
      const c = curls.current;
      c[name] += (POSES[pose][name] - c[name]) * ease;
      curlFinger(fingers[name], c[name]);
    }

    // The wave: the forearm swings from an elbow far above the frame, and the
    // wrist follows a little late. That lag is what makes it read as a wave
    // and not as a windscreen wiper.
    const w = wave.current;
    const target = pose === "wave" ? 1 : 0;
    w.amount += (target - w.amount) * (1 - Math.exp(-dt * 9));
    if (pose === "wave") w.time += dt;
    else w.time = 0;
    const phase = w.time * Math.PI * 2 * 1.4; // 1.4 swings per second: unhurried
    if (elbow.current) elbow.current.rotation.z = Math.sin(phase) * 0.12 * w.amount;
    if (wrist.current) wrist.current.rotation.z = Math.sin(phase - 0.7) * 0.3 * w.amount;
  });

  return (
    // elbow pivot sits well above the visible frame
    <group ref={elbow} position={[0, 0.5, 0]}>
      <group position={[0, -0.5, 0]}>
        {/* forearm / sleeve, running up out of the top of the frame */}
        <mesh position={[0.01, 0.305, -0.038]} scale={[1, 1, 0.74]} material={sleeve}>
          <cylinderGeometry args={[0.04, 0.031, 0.5, 40]} />
        </mesh>

        {/* wrist pivot: the hand itself */}
        <group ref={wrist} position={[0.009, 0.07, -0.035]}>
          <group position={[-0.009, -0.07, 0.035]}>
            {/* turn the model so the palm faces the camera */}
            <primitive object={gltf.scene} rotation={[0, Math.PI / 2, 0]} />
          </group>
        </group>
      </group>
    </group>
  );
}

export default function WebHand({
  pose,
  active = true,
  onReady,
  className = "",
}: {
  pose: HandPose;
  /** Render every frame only while the hand is actually on screen. */
  active?: boolean;
  onReady?: () => void;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        frameloop={active ? "always" : "demand"}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ fov: 28, position: [0, 0, 0.78], near: 0.05, far: 5 }}
      >
        <ambientLight intensity={0.75} />
        {/* key light from the front, upper left */}
        <directionalLight position={[-0.4, 0.5, 1]} intensity={2.4} />
        {/* cool rim light from behind, for a comic-book edge */}
        <directionalLight position={[0.7, 0.1, -0.6]} intensity={2} color="#7fb4ff" />
        {/* This Suspense is load-bearing. `useLoader` suspends while the model
            downloads. Without a boundary INSIDE the canvas, the canvas itself
            suspends, React hides it (it sits under next/dynamic's boundary),
            and react-three-fiber answers by destroying the WebGL context
            half a second later: the hand then never draws. */}
        <Suspense fallback={null}>
          <Rig pose={pose} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
