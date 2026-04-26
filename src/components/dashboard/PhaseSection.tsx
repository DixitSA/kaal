"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import InsightCard from "@/components/ui/InsightCard";
import type { IntensityLevel } from "@/lib/types/engine";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const INTENSITY_DOTS: Record<IntensityLevel, number> = {
  low:      1,
  medium:   2,
  high:     3,
  critical: 4,
};

const INTENSITY_LABELS: Record<IntensityLevel, string> = {
  low:      "low intensity",
  medium:   "steady intensity",
  high:     "high intensity",
  critical: "critical intensity",
};


export default function PhaseSection() {
  const { computedData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!computedData) return null;

  const { phase } = computedData;
  const intensityLevel: IntensityLevel = computedData.intensity?.level ?? "medium";
  const filledDots = INTENSITY_DOTS[intensityLevel];
  const isCritical = intensityLevel === "critical";
  const words = phase.label.split(" ");

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.08 } },
  };

  const wordAnim = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  const childAnim = (delay: number) => ({
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  });

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      style={{
        padding: "clamp(20px, 5vw, 32px) 0",
      }}
    >
      {/* Unified header: label + intensity as single frame */}
      <motion.div
        variants={childAnim(0)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: "4px",
          marginBottom: "4px",
        }}
      >
        <p className="tracking-[0.2em]" style={{ color: "#786030", fontFamily: "var(--font-inter-var)", fontSize: "14px", fontWeight: 500, textTransform: "lowercase", margin: 0 }}>
          Current Phase
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {[1, 2, 3, 4].map((dot) => {
              const filled = dot <= filledDots;
              const pulse = filled && isCritical && dot === 4 && !shouldReduce;
              return (
                <motion.div
                  key={dot}
                  initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.5 }}
                  animate={pulse ? { opacity: [1, 0.4, 1], scale: [1, 1.3, 1] } : { opacity: 1, scale: 1 }}
                  transition={pulse ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3, ease: EASE }}
                  style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    backgroundColor: filled ? (isCritical ? "#A04040" : "#B5563E") : "rgba(122, 116, 105, 0.22)",
                  }}
                />
              );
            })}
          </div>
          <span style={{ fontFamily: "var(--font-inter-var)", fontSize: "11px", textTransform: "lowercase", letterSpacing: "0.06em", color: isCritical ? "#A04040" : "#7A7469" }}>
            {INTENSITY_LABELS[intensityLevel]}
          </span>
        </div>
      </motion.div>

      {/* Visual frame rule — closes the circuit */}
      <div style={{ height: "1px", backgroundColor: "rgba(122, 116, 105, 0.15)", marginBottom: "12px" }} />

      {/* Phase name */}
      <motion.h2
        variants={container}
        className="mt-3 font-bold"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          lineHeight: 1.1,
          color: "#2C2418",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25em",
          maxWidth: "25ch",
          marginBottom: "12px",
        }}
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordAnim} style={{ display: "inline-block" }}>
            {word}
          </motion.span>
        ))}
      </motion.h2>

      {/* Summary */}
      <motion.p
        variants={childAnim(0.2)}
        className="mt-4"
        style={{
          fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
          fontStyle: "italic",
          fontSize: "1rem",
          color: "#5C574F",
          lineHeight: 1.6,
          letterSpacing: "0.02em",
          textTransform: "lowercase",
          maxWidth: "52ch",
        }}
      >
        {phase.summary}
      </motion.p>

      {/* Opportunity */}
      <motion.div variants={childAnim(0.3)} className="mt-5">
        <InsightCard type="positive" label="Opportunity" content={phase.supportAction} animDelay={0.3} />
      </motion.div>

      {/* Risk */}
      <motion.div variants={childAnim(0.4)} className="mt-4">
        <InsightCard type="negative" label="Risk" content={phase.cautionAction} animDelay={0.45} />
      </motion.div>

      {/* Phase tags */}
      {phase.tags && phase.tags.length > 0 && (
        <motion.div variants={childAnim(0.5)} style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
          {phase.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              textTransform: "lowercase",
              letterSpacing: "0.06em",
              color: "#5C574F",
              backgroundColor: "rgba(122, 116, 105, 0.08)",
              borderRadius: "2px",
              padding: "3px 8px",
            }}>
              {tag}
            </span>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}