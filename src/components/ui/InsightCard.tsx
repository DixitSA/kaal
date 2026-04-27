"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Side-bar accent colour */
const barColor = {
  positive: "#5E7A5E",
  negative: "#B5563E",
  neutral:  "#B5563E",
} as const;

/** Deep-toned body text — darkened ~30% from the bar colour, passes 4.5:1 on cream */
const bodyColor = {
  positive: "#2D4A2D",  /* deep forest green  — 7.1:1 on #F5F0E8 */
  negative: "#6B2A1A",  /* deep terracotta red — 7.4:1 on #F5F0E8 */
  neutral:  "#6B2A1A",
} as const;

interface InsightCardProps {
  type: "positive" | "negative" | "neutral";
  label: string;
  content: string;
  /** Delay for the animated left-border draw (seconds) */
  animDelay?: number;
}

export default function InsightCard({
  type,
  label,
  content,
  animDelay = 0,
}: InsightCardProps) {
  const shouldReduce = useReducedMotion();
  const accent = barColor[type];
  const text   = bodyColor[type];

  return (
    <div className="insight-card" style={{ display: "flex", alignItems: "stretch" }}>
      {/* Animated side bar — flex child, stretches to full card height */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduce ? 0 : 0.5, delay: animDelay, ease: EASE }}
        style={{
          flexShrink: 0,
          alignSelf: "stretch",
          width: "3px",
          backgroundColor: accent,
          transformOrigin: "top",
          borderRadius: "2px",
        }}
      />

      {/* Text block — centered alignment for ceremonial aesthetic */}
      <div style={{
        paddingLeft: "24px",
        paddingTop: "8px",
        paddingBottom: "8px",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-inter-var)",
            fontSize: "0.8rem",
            textTransform: "lowercase",
            letterSpacing: "0.12em",
            color: accent,
            margin: 0,
            lineHeight: 1,
          }}
        >
          {label}
        </p>

        {/* Body */}
        <p
          style={{
            fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1.6,
            letterSpacing: "0.02em",
            color: text,
            fontStyle: "normal",
            fontWeight: 400,
            margin: "6px 0 0",
            textTransform: "none",
          }}
        >
          {content.charAt(0).toUpperCase() + content.slice(1)}
        </p>
      </div>
    </div>
  );
}
