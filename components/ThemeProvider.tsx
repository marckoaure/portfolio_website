"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "motion/react";
import ThemeToggle from "./ThemeToggle";

type Theme = "dark" | "light";
type ThemeCtx = { theme: Theme; toggle: () => void };

const ThemeContext = createContext<ThemeCtx>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// The background + blade colors used to paint the slash while LEAVING a theme.
const LEAVING: Record<Theme, { bg: string; blade: string }> = {
  dark: { bg: "#0a0a0a", blade: "#ffffff" },
  light: { bg: "#fafafa", blade: "#141414" },
};

// The <html data-theme> attribute is the single source of truth: the no-flash
// script in layout.tsx sets it before React loads, and applyTheme writes to it.
// Reading it through useSyncExternalStore keeps React in sync without the old
// "setTheme inside useEffect" that the React Compiler lint flags.
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}
const readTheme = (): Theme =>
  (document.documentElement.dataset.theme as Theme) || "dark";
const serverTheme = (): Theme => "dark";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const [slash, setSlash] = useState<{ bg: string; blade: string } | null>(null);
  const reduce = useReducedMotion();

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    // No setState needed: the MutationObserver above sees the attribute change.
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    // Reduced motion (or SSR fallback): switch instantly, no slash.
    if (reduce) {
      applyTheme(next);
      return;
    }

    // 1. paint the slash panel as the theme we're leaving
    setSlash(LEAVING[theme]);
    // 2. flip the real theme on the next frame, hidden under the panel
    requestAnimationFrame(() => applyTheme(next));
    // 3. remove the overlay once the blade has swept across
    window.setTimeout(() => setSlash(null), 650);
  }, [theme, reduce, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
      <ThemeToggle />

      {slash && (
        <div
          className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
          style={
            {
              "--slash-bg": slash.bg,
              "--slash-blade": slash.blade,
            } as React.CSSProperties
          }
        >
          {/* the old-theme panel peeling away diagonally */}
          <div
            className="absolute inset-0"
            style={{
              background: "var(--slash-bg)",
              animation:
                "sword-panel 600ms cubic-bezier(0.77, 0, 0.175, 1) forwards",
            }}
          />
          {/* the bright blade leading the peel */}
          <div
            className="absolute -top-[20%] left-0 h-[140%] w-[6px]"
            style={{
              background: "var(--slash-blade)",
              boxShadow: "0 0 40px 8px var(--slash-blade)",
              animation:
                "sword-blade 600ms cubic-bezier(0.77, 0, 0.175, 1) forwards",
            }}
          />
        </div>
      )}
    </ThemeContext.Provider>
  );
}
