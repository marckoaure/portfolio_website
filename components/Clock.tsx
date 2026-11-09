"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/data/profile";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: profile.timezone,
});

const now = () => formatter.format(new Date());

// Wake React up once a second so it re-reads the time.
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Live local clock in the user's configured timezone.
// useSyncExternalStore reads the real time on the client while the server
// (and hydration) render the placeholder, so there is no server/client mismatch
// and no setState inside an effect.
export default function Clock() {
  const time = useSyncExternalStore(subscribe, now, () => "");

  if (!time) return <span className="font-mono tabular-nums">--:--:--</span>;

  return <span className="font-mono tabular-nums">{time}</span>;
}
