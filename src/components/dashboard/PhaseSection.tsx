"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import InsightCard from "@/components/ui/InsightCard";
import type { PhaseIntensity, PhaseStateKey } from "@/lib/types/engine";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function formatStateKey(key: PhaseStateKey): string {
  return key
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatBias(bias: string): string {
  return bias.charAt(0).toUpperCase() + bias.slice(1);
}

const INTENSITY_DOTS: Record<PhaseIntensity, number> = {
  low: 1,
  steady: 2,
  high: 3,
};

const INTENSITY_LABELS: Record<PhaseIntensity, string> = {
  low: "Low Intensity",
  steady: "Steady Intensity",
  high: "High Intensity",
};

export default function PhaseSection() {
  const { computedData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!computedData) return null;

  const { phase } = computedData;
  const words = phase.label.split(" ");
  const filledDots = INTENSITY_DOTS[phase.intensity];

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
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>

      {/* Header row: label + intensity dots */}
      <motion.div
        variants={childAnim(0)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}
      >
        <p
          className="tracking-[0.2em]"
          style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px", textTransform: "lowercase" }}
        >
          Current Phase
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {[1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: shouldReduce ? 0 : 0.08 * dot, ease: EASE }}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: dot <= filledDots ? "#B5563E" : "rgba(122, 116, 105, 0.22)",
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              textTransform: "lowercase",
              letterSpacing: "0.08em",
              color: "#7A7469",
              marginLeft: "4px",
            }}
          >
            {INTENSITY_LABELS[phase.intensity]}
          </span>
        </div>
      </motion.div>

      {/* Phase name — text-5xl / text-6xl, max 25ch */}
      <motion.h2
        variants={container}
        className="mt-3 font-bold"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
          lineHeight: 1.05,
          color: "#2C2418",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25em",
          maxWidth: "25ch",
        }}
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordAnim} style={{ display: "inline-block" }}>
            {word}
          </motion.span>
        ))}
      </motion.h2>

      {/* State key pill */}
      <motion.div variants={childAnim(0.15)} style={{ marginTop: "10px" }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-inter-var)",
            fontSize: "11px",
            textTransform: "lowercase",
            letterSpacing: "0.08em",
            color: "#8A7240",
            border: "1px solid rgba(138, 114, 64, 0.35)",
            borderRadius: "2px",
            padding: "3px 8px",
          }}
        >
          {formatStateKey(phase.stateKey)}
        </span>
      </motion.div>

      {/* Summary — italic Inter: short emotional hook */}
      <motion.p
        variants={childAnim(0.2)}
        className="mt-4"
        style={{
          fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
          fontStyle: "italic",
          fontSize: "1rem",
          color: "#7A7469",
          lineHeight: 1.6,
          letterSpacing: "0.02em",
          textTransform: "lowercase",
          maxWidth: "52ch",
        }}
      >
        {phase.summary}
      </motion.p>

      {/* Opportunity — InsightCard positive (green) */}
      <motion.div variants={childAnim(0.3)} className="mt-8">
        <InsightCard
          type="positive"
          label="Opportunity"
          content={phase.supportAction}
          animDelay={0.3}
        />
      </motion.div>

      {/* Risk — InsightCard negative (terracotta) */}
      <motion.div variants={childAnim(0.4)} className="mt-6">
        <InsightCard
          type="negative"
          label="Risk"
          content={phase.cautionAction}
          animDelay={0.45}
        />
      </motion.div>

      {/* Bias context pills */}
      <motion.div
        variants={childAnim(0.5)}
        style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter-var)",
            fontSize: "11px",
            textTransform: "lowercase",
            letterSpacing: "0.06em",
            color: "#5C574F",
            backgroundColor: "rgba(122, 116, 105, 0.1)",
            borderRadius: "2px",
            padding: "3px 8px",
          }}
        >
          {phase.supportBias} mode
        </span>
        <span
          style={{
            fontFamily: "var(--font-inter-var)",
            fontSize: "11px",
            textTransform: "lowercase",
            letterSpacing: "0.06em",
            color: "#5C574F",
            backgroundColor: "rgba(122, 116, 105, 0.1)",
            borderRadius: "2px",
            padding: "3px 8px",
          }}
        >
          avoid: {phase.riskBias}
        </span>
      </motion.div>

    </motion.section>
  );
}
