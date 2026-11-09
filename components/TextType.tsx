"use client";

import { useEffect, useRef, useState } from "react";

type TextTypeProps = {
  /** A single string, or an array of strings to cycle through. */
  text: string | string[];
  /** ms per character while typing. */
  typingSpeed?: number;
  /** ms per character while deleting (only used when looping an array). */
  deletingSpeed?: number;
  /** ms to pause on a completed line before deleting (looping only). */
  pauseDuration?: number;
  /** Cycle through the array forever (type -> delete -> next). */
  loop?: boolean;
  showCursor?: boolean;
  cursorCharacter?: string;
  cursorBlinkDuration?: number;
  className?: string;
  cursorClassName?: string;
  /** Typing only begins once this is true (used for hover-to-reveal). */
  start?: boolean;
  onComplete?: () => void;
};

export default function TextType({
  text,
  typingSpeed = 40,
  deletingSpeed = 25,
  pauseDuration = 1500,
  loop = false,
  showCursor = true,
  cursorCharacter = "|",
  cursorBlinkDuration = 0.6,
  className = "",
  cursorClassName = "",
  start = true,
  onComplete,
}: TextTypeProps) {
  const texts = Array.isArray(text) ? text : [text];
  const [displayed, setDisplayed] = useState("");
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (!start) return;

    // Reduced motion: reveal everything at once, no per-character animation.
    if (reducedRef.current) {
      setDisplayed(texts.join(" "));
      onComplete?.();
      return;
    }

    let cancelled = false;
    let ti = 0; // which string in the array
    let ci = 0; // current character index
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      const full = texts[ti];

      if (!deleting) {
        ci++;
        setDisplayed(full.slice(0, ci));
        if (ci >= full.length) {
          const isLast = ti === texts.length - 1;
          if (isLast && !loop) {
            onComplete?.();
            return; // finished for good — leave the text on screen
          }
          deleting = true;
          timer = setTimeout(step, pauseDuration);
          return;
        }
        timer = setTimeout(step, typingSpeed);
      } else {
        ci--;
        setDisplayed(full.slice(0, ci));
        if (ci <= 0) {
          deleting = false;
          ti = (ti + 1) % texts.length;
          timer = setTimeout(step, typingSpeed);
          return;
        }
        timer = setTimeout(step, deletingSpeed);
      }
    };

    timer = setTimeout(step, typingSpeed);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          className={cursorClassName}
          style={{
            animation: `caret-blink ${cursorBlinkDuration}s linear infinite`,
            marginLeft: "1px",
          }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}
