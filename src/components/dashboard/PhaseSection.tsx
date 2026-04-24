"use client";

import { useState } from "react";
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

function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {children}
      {show && (
        <div style={{
          position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
          zIndex: 20, backgroundColor: "#2C2418", color: "#F5F0E8", padding: "8px 12px",
          borderRadius: "2px", fontSize: "12px", maxWidth: "280px", whiteSpace: "normal",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", marginTop: "8px", textAlign: "center"
        }}>
          {content}
        </div>
      )}
      <div
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
        role="button"
        aria-label="More information"
      />
    </div>
  );
}

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
        backgroundColor: "rgba(237, 230, 218, 0.92)",
        borderRadius: "4px",
        padding: "clamp(20px, 5vw, 32px)",
        border: "1px solid rgba(122, 116, 105, 0.08)",
      }}
    >
      {/* Header row: label + intensity dots */}
      <motion.div
        variants={childAnim(0)}
        className="phase-header-row"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p className="tracking-[0.2em]" style={{ color: "#786030", fontFamily: "var(--font-inter-var)", fontSize: "12px", textTransform: "lowercase", margin: 0 }}>
            Current Phase
          </p>
          <Tooltip content="Your current phase reflects the dominant planetary period affecting your life circumstances right now.">
            <span style={{ cursor: "help", color: "#786030", fontSize: "12px", fontWeight: 600 }}>?</span>
          </Tooltip>
        </div>

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
          <Tooltip content="Intensity measures how actively the planetary energies are expressing themselves in your current period.">
            <span style={{ cursor: "help", color: isCritical ? "#A04040" : "#786030", fontSize: "12px", fontWeight: 600 }}>?</span>
          </Tooltip>
        </div>
      </motion.div>

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

      {/* State key pill */}
      <motion.div variants={childAnim(0.15)} style={{ marginBottom: "16px" }}>
        <span style={{
          display: "inline-block",
          fontFamily: "var(--font-inter-var)",
          fontSize: "11px",
          textTransform: "lowercase",
          letterSpacing: "0.08em",
          color: "#786030",
          border: "1px solid rgba(138, 114, 64, 0.35)",
          borderRadius: "2px",
          padding: "3px 8px",
        }}>
          {phase.stateKey.replace(/-/g, " ")}
        </span>
      </motion.div>

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
      <motion.div variants={childAnim(0.3)} className="mt-8">
        <InsightCard type="positive" label="Opportunity" content={phase.supportAction} animDelay={0.3} />
      </motion.div>

      {/* Risk */}
      <motion.div variants={childAnim(0.4)} className="mt-6">
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