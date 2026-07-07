import { ImageResponse } from "next/og";

export const alt = "Kaal: Vedic timing, read daily";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F0E8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            color: "#2C2418",
            letterSpacing: "0.1em",
            fontWeight: 700,
          }}
        >
          KAAL
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#B5563E",
            letterSpacing: "0.04em",
          }}
        >
          know what&apos;s happening. know what to do.
        </div>
      </div>
    ),
    { ...size }
  );
}
