"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

const spring = { damping: 30, stiffness: 100, mass: 2 };

// A card that tilts toward the cursor in 3D and scales up on hover.
// Pure mouse-tracking + springs (no WebGL) — lightweight and reliable.
export default function TiltedCard({
  children,
  rotateAmplitude = 10,
  scaleOnHover = 1.05,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const scale = useSpring(1, spring);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  }

  function onEnter() {
    if (!reduce) scale.set(scaleOnHover);
  }

  function onLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      className="[perspective:900px]"
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <motion.button
        type="button"
        onClick={onClick}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className={`block w-full cursor-pointer text-left will-change-transform ${className}`}
      >
        {children}
      </motion.button>
    </div>
  );
}
