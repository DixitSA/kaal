import { ImageResponse } from "next/og";

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
          background: "#F5F0E8",
          color: "#B5563E",
          fontFamily: "Georgia, serif",
          fontSize: 108,
          fontStyle: "italic",
          fontWeight: 700,
        }}
      >
        K
      </div>
    ),
    { ...size }
  );
}
