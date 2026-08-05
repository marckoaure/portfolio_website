"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

// Live local clock in the user's configured timezone.
export default function Clock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: profile.timezone,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing until mounted to avoid a server/client mismatch.
  if (!time) return <span className="font-mono tabular-nums">--:--:--</span>;

  return (
    <span className="font-mono tabular-nums" suppressHydrationWarning>
      {time}
    </span>
  );
}
