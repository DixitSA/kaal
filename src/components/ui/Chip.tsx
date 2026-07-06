import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
}

/** Small lowercase tag chip used for phase tags, decision categories, etc. */
export default function Chip({ children }: ChipProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-inter-var)",
        fontSize: "11px",
        textTransform: "lowercase",
        letterSpacing: "0.06em",
        color: "var(--text-tagline)",
        backgroundColor: "rgba(122, 116, 105, 0.08)",
        borderRadius: "2px",
        padding: "3px 8px",
      }}
    >
      {children}
    </span>
  );
}
