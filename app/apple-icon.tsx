import { ImageResponse } from "next/og";

// Home-screen icon for iOS/Android "Add to Home Screen".
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 112,
          fontWeight: 700,
          fontFamily: "Helvetica, Arial, sans-serif",
          letterSpacing: -6,
        }}
      >
        G
      </div>
    ),
    size
  );
}
