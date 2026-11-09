"use client";

import { useEffect, useRef, useState } from "react";

// "Copy" button beside the email. The label swaps to "Copied" for 1.5 s as
// feedback, then swaps back. A short color/opacity transition is all the
// motion this needs: it is tapped once, occasionally.
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (old browser / insecure context): the mailto link
      // right next to this button still works, so fail quietly.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-150 ${
        copied
          ? "border-fg bg-fg text-bg"
          : "border-line text-muted hover:border-fg hover:text-fg"
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {copied ? (
          <path d="M5 12l5 5L20 7" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </>
        )}
      </svg>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
