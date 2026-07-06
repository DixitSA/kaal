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
          backgroundColor: "var(--bg-cream)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            color: "var(--text-primary)",
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
            color: "var(--accent-terracotta)",
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
