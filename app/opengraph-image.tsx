import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

// The preview card shown when the site link is shared (LinkedIn, Messenger,
// Discord, X...). Generated once at build time from the profile data.
export const alt = `${profile.fullName} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const host = new URL(profile.siteUrl).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            letterSpacing: 6,
            color: "#8a8a8a",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#34d399",
            }}
          />
          Available for work
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4 }}>
            {profile.firstName}
          </div>
          <div
            style={{
              fontSize: 132,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: -4,
              color: "#8a8a8a",
            }}
          >
            {profile.lastName}
          </div>
          <div style={{ marginTop: 36, fontSize: 34, color: "#b5b5b5" }}>
            {`${profile.role}. ${profile.tagline}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            color: "#5a5a5a",
            textTransform: "uppercase",
          }}
        >
          <span>{host}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    size
  );
}
