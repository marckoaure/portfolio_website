"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

// A slowly rotating wireframe icosahedron. Monochrome, low-key — it sits
// behind the hero text as a subtle "engineering" motif rather than a spectacle.
function Shape() {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.18;
  });

  return (
    <group scale={2.4}>
      {/* Solid, near-black core so the wireframe reads cleanly */}
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      {/* White wireframe overlay */}
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ededed" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function ThreeHero() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Skip the canvas entirely for reduced-motion users or before mount.
  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60"
    >
      <div className="h-[70vmin] w-[70vmin] max-h-[520px] max-w-[520px]">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
          <Shape />
        </Canvas>
      </div>
    </div>
  );
}
