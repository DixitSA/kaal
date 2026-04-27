"use client";

interface SigilProps {
  type: "growth" | "shadow" | "stability" | "action";
}

export default function Sigil({ type }: SigilProps) {
  const strokeColor = "#4A4F46";
  const strokeWidth = 1;

  switch (type) {
    case "growth":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style={{ display: "block", margin: "0 auto 8px" }}>
          <polygon points="14,4 22,22 6,22" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="14" y1="4" x2="14" y2="22" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );

    case "shadow":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style={{ display: "block", margin: "0 auto 8px" }}>
          <circle cx="14" cy="10" r="6" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="6" y1="10" x2="22" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="14" cy="20" r="1.5" fill={strokeColor} />
        </svg>
      );

    case "stability":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style={{ display: "block", margin: "0 auto 8px" }}>
          <rect x="8" y="8" width="12" height="12" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} transform="rotate(45 14 14)" />
          <rect x="10" y="10" width="8" height="8" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} transform="rotate(45 14 14)" />
        </svg>
      );

    case "action":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style={{ display: "block", margin: "0 auto 8px" }}>
          <polygon points="14,4 20,14 14,24 8,14" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="14" cy="14" r="2" fill={strokeColor} />
        </svg>
      );

    default:
      return null;
  }
}