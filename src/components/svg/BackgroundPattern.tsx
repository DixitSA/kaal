"use client";

export default function BackgroundPattern() {
  // Inline SVG as a data URI for CSS background tiling
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <!-- Paisley teardrop -->
      <path d="M20 10 C10 10 6 18 10 26 C14 34 22 36 26 30 C30 24 24 16 20 10 Z"
        fill="none" stroke="%23C4A96A" stroke-width="0.8" opacity="0.7"/>
      <!-- Small curve inside paisley -->
      <path d="M18 18 C15 20 15 24 18 25" fill="none" stroke="%23C4A96A" stroke-width="0.5"/>
      <!-- Dot cluster -->
      <circle cx="55" cy="20" r="1.2" fill="%23C4A96A" opacity="0.7"/>
      <circle cx="60" cy="18" r="0.8" fill="%23C4A96A" opacity="0.5"/>
      <circle cx="58" cy="24" r="0.8" fill="%23C4A96A" opacity="0.5"/>
      <!-- Small lotus bud -->
      <ellipse cx="55" cy="55" rx="3" ry="5" fill="none" stroke="%23C4A96A" stroke-width="0.6" opacity="0.6"/>
      <ellipse cx="50" cy="57" rx="2.5" ry="4" fill="none" stroke="%23C4A96A" stroke-width="0.5" opacity="0.5"/>
      <ellipse cx="60" cy="57" rx="2.5" ry="4" fill="none" stroke="%23C4A96A" stroke-width="0.5" opacity="0.5"/>
      <!-- Tiny dot -->
      <circle cx="30" cy="55" r="1" fill="%23C4A96A" opacity="0.4"/>
    </svg>
  `.trim().replace(/\s+/g, " ");

  const dataUri = `url("data:image/svg+xml,${svgContent}")`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: dataUri,
        backgroundRepeat: "repeat",
        backgroundSize: "80px 80px",
        opacity: 0.07,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
