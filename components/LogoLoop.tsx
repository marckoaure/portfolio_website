"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LogoNode = { node: React.ReactNode; title?: string; href?: string };
type LogoImage = { src: string; alt?: string; href?: string };
export type LogoItem = LogoNode | LogoImage;

type LogoLoopProps = {
  logos: LogoItem[];
  /** pixels per second */
  speed?: number;
  direction?: "left" | "right";
  /** icon height in px (also sets font-size for react-icons) */
  logoHeight?: number;
  /** space between logos in px */
  gap?: number;
  pauseOnHover?: boolean;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  ariaLabel?: string;
  className?: string;
};

export default function LogoLoop({
  logos,
  speed = 70,
  direction = "left",
  logoHeight = 40,
  gap = 56,
  pauseOnHover = true,
  scaleOnHover = true,
  fadeOut = true,
  ariaLabel = "Technologies",
  className = "",
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);
  const [groupWidth, setGroupWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  // Measure one group's width and figure out how many copies fill the row
  // (enough that the loop never shows a gap, in either direction).
  const measure = useCallback(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return;
    const gw = group.getBoundingClientRect().width;
    const cw = container.getBoundingClientRect().width;
    if (gw > 0) {
      setGroupWidth(gw);
      setCopies(Math.max(3, Math.ceil(cw / gw) + 2));
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (groupRef.current) ro.observe(groupRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const duration = groupWidth > 0 ? groupWidth / speed : 20;

  const renderLogo = (item: LogoItem, i: number) => {
    const content =
      "node" in item ? (
        item.node
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.src} alt={item.alt ?? ""} style={{ height: logoHeight }} />
      );
    const label = "node" in item ? item.title : item.alt;

    const inner = (
      <span
        className={
          scaleOnHover
            ? "inline-flex items-center transition-transform duration-300 hover:scale-125"
            : "inline-flex items-center"
        }
      >
        {content}
      </span>
    );

    return (
      <li
        key={i}
        className="flex items-center text-muted transition-colors hover:text-fg"
        style={{ marginRight: gap, fontSize: logoHeight }}
      >
        {"href" in item && item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex items-center"
          >
            {inner}
          </a>
        ) : (
          inner
        )}
      </li>
    );
  };

  const renderGroup = (copyIndex: number) => (
    <ul
      key={copyIndex}
      ref={copyIndex === 0 ? groupRef : undefined}
      className="flex items-center"
      aria-hidden={copyIndex !== 0}
    >
      {logos.map(renderLogo)}
    </ul>
  );

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      className={`relative overflow-hidden ${
        pauseOnHover ? "logoloop-pause" : ""
      } ${className}`}
      style={
        {
          "--logoloop-width": `${groupWidth}px`,
          maskImage: fadeOut
            ? "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)"
            : undefined,
          WebkitMaskImage: fadeOut
            ? "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)"
            : undefined,
        } as React.CSSProperties
      }
    >
      <div
        className="logoloop-track flex w-max"
        style={{
          animation:
            groupWidth > 0
              ? `logoloop-${direction} ${duration}s linear infinite`
              : undefined,
        }}
      >
        {Array.from({ length: copies }, (_, i) => renderGroup(i))}
      </div>
    </div>
  );
}
