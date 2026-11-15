"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import Preloader from "./Preloader";

// The "walkie-talkie": a shared value any component can read.
// `true` once the intro/preloader has finished and the curtain is lifting.
const IntroContext = createContext(false);

// A tiny helper so components can just call useIntroDone() to listen.
export function useIntroDone() {
  return useContext(IntroContext);
}

// Has this browser tab already watched the intro? Read ONCE and cached, so the
// answer cannot flip to "yes" halfway through the intro (the Preloader writes
// the flag when it finishes, and re-reading it would cut the curtain short).
let seenAtLoad: boolean | null = null;
function readSeen() {
  if (seenAtLoad === null) {
    try {
      seenAtLoad = sessionStorage.getItem("introSeen") === "1";
    } catch {
      seenAtLoad = false;
    }
  }
  return seenAtLoad;
}
const subscribe = () => () => {};

// When the intro is skipped, the hero must still get its "go" signal a beat
// AFTER the page hydrates. If the signal is already true in the very first
// client render, Motion has not finished mounting and misses the change, so
// the hero would stay hidden. This tiny store flips 50ms after mount.
let cueFired = false;
function subscribeCue(notify: () => void) {
  if (cueFired) return () => {};
  const id = setTimeout(() => {
    cueFired = true;
    notify();
  }, 50);
  return () => clearTimeout(id);
}
const readCue = () => cueFired;

export default function IntroProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [finished, setFinished] = useState(false);
  // false on the server and during hydration, then the real answer.
  const seen = useSyncExternalStore(subscribe, readSeen, () => false);
  const cue = useSyncExternalStore(subscribeCue, readCue, () => false);

  // useCallback keeps this function stable so the Preloader isn't
  // handed a brand-new function on every render.
  const handleFinish = useCallback(() => setFinished(true), []);

  return (
    <>
      {/* Plays once per browser session; reloads and return visits skip it */}
      <Preloader skip={seen} onFinish={handleFinish} />

      {/* Everything inside can now "hear" whether the intro is done */}
      <IntroContext.Provider value={finished || (seen && cue)}>
        {children}
      </IntroContext.Provider>
    </>
  );
}
