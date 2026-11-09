import { ImageResponse } from "next/og";

// Browser-tab icon: a white "G" on the site's black, generated at build time.
// Replaces the default Next.js favicon.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ededed",
          borderRadius: 14,
          fontSize: 40,
          fontWeight: 700,
          fontFamily: "Helvetica, Arial, sans-serif",
          letterSpacing: -2,
        }}
      >
        G
      </div>
    ),
    size
  );
}
