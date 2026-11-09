"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Preloader from "./Preloader";

// The "walkie-talkie": a shared value any component can read.
// `true` once the intro/preloader has finished and the curtain is lifting.
const IntroContext = createContext(false);

// A tiny helper so components can just call useIntroDone() to listen.
export function useIntroDone() {
  return useContext(IntroContext);
}

export default function IntroProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [done, setDone] = useState(false);

  // useCallback keeps this function stable so the Preloader isn't
  // handed a brand-new function on every render.
  const handleFinish = useCallback(() => setDone(true), []);

  return (
    <>
      {/* The Preloader lives here and reports back when it finishes */}
      <Preloader onFinish={handleFinish} />

      {/* Everything inside can now "hear" whether the intro is done */}
      <IntroContext.Provider value={done}>{children}</IntroContext.Provider>
    </>
  );
}
