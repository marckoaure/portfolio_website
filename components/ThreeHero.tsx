"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { useTheme } from "./ThemeProvider";
import { useHydrated } from "@/lib/useHydrated";

// A slowly rotating wireframe icosahedron. Monochrome, low-key — it sits
// behind the hero text as a subtle "engineering" motif rather than a spectacle.
// `core` blends with the page background; `wire` is the contrasting line color.
function Shape({ core, wire }: { core: string; wire: string }) {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.18;
  });

  return (
    <group scale={2.4}>
      {/* Solid core (same as the background) so the wireframe reads cleanly */}
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={core} />
      </mesh>
      {/* Contrasting wireframe overlay */}
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={wire} wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function ThreeHero() {
  const mounted = useHydrated();
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  // Core matches the background; wire contrasts against it.
  const core = theme === "dark" ? "#0a0a0a" : "#fafafa";
  const wire = theme === "dark" ? "#ededed" : "#141414";

  // Skip the canvas entirely for reduced-motion users or before mount.
  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60"
    >
      <div className="h-[70vmin] w-[70vmin] max-h-[520px] max-w-[520px]">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
          <Shape core={core} wire={wire} />
        </Canvas>
      </div>
    </div>
  );
}
