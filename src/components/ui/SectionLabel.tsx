import type { CSSProperties, ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  as?: "p" | "span";
  style?: CSSProperties;
  className?: string;
}

/** The "current phase" / "today" / "decision" section-header label — one shared treatment. */
export default function SectionLabel({ children, as = "p", style, className }: SectionLabelProps) {
  const Tag = as;
  return (
    <Tag
      className={`label-section tracking-[0.2em] ${className ?? ""}`}
      style={{
        color: "var(--accent-gold)",
        margin: 0,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
