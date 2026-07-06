"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import InsightCard from "@/components/ui/InsightCard";
import type { IntensityLevel, PhaseStateKey } from "@/lib/types/engine";
import { PHASE_INSIGHTS } from "@/lib/content/phaseInsights";
import { deterministicPick } from "@/lib/utils/deterministicPick";
import SectionLabel from "@/components/ui/SectionLabel";
import Chip from "@/components/ui/Chip";

function getLocalDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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
  if (!phase?.label) return null;
  const intensityLevel: IntensityLevel = computedData.intensity?.level ?? "medium";
  const filledDots = INTENSITY_DOTS[intensityLevel];
  const isCritical = intensityLevel === "critical";

  const phaseInsightList = PHASE_INSIGHTS[phase.stateKey as PhaseStateKey] ?? PHASE_INSIGHTS["steady-build"];
  const dailyInsight = deterministicPick(
    phaseInsightList,
    `${getLocalDateKey()}:${phase.stateKey}`
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        padding: "clamp(20px, 5vw, 32px) 0",
      }}
    >
      {/* Unified header: label + intensity as single frame */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          paddingRight: "4px",
          paddingBottom: "10px",
          borderBottom: "1px solid rgba(61,52,40,0.12)",
          marginBottom: "1rem",
        }}
      >
        <SectionLabel>Current Phase</SectionLabel>

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
                    backgroundColor: filled ? (isCritical ? "var(--accent-red)" : "var(--accent-terracotta)") : "rgba(122, 116, 105, 0.22)",
                  }}
                />
              );
            })}
          </div>
          <span style={{ fontFamily: "var(--font-inter-var)", fontSize: "11px", textTransform: "lowercase", letterSpacing: "0.06em", color: isCritical ? "var(--accent-red)" : "var(--text-secondary)" }}>
            {INTENSITY_LABELS[intensityLevel]}
          </span>
        </div>
      </div>

      {/* Phase name */}
      <h2
        className="mt-3 font-bold"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          lineHeight: 1.1,
          color: "var(--text-primary)",
          maxWidth: "25ch",
          marginBottom: "12px",
        }}
      >
        {phase.label}
      </h2>

      {/* Daily rotating insight */}
      <p
        className="mt-3"
        style={{
          fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
          fontStyle: "italic",
          fontSize: "0.9rem",
          color: "var(--accent-gold-text)",
          lineHeight: 1.6,
          letterSpacing: "0.02em",
          textTransform: "lowercase",
          maxWidth: "48ch",
          opacity: 0.85,
        }}
      >
        &ldquo;{dailyInsight}&rdquo;
      </p>

      {/* Summary */}
      <p
        className="mt-4"
        style={{
          fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
          fontStyle: "italic",
          fontSize: "1rem",
          color: "var(--text-tagline)",
          lineHeight: 1.6,
          letterSpacing: "0.02em",
          textTransform: "lowercase",
          maxWidth: "52ch",
        }}
      >
        {phase.summary}
      </p>

      {/* Opportunity */}
      <div className="mt-5">
        <InsightCard type="positive" label="Opportunity" content={phase.supportAction} animDelay={0.1} />
      </div>

      {/* Risk */}
      <div className="mt-4">
        <InsightCard type="negative" label="Risk" content={phase.cautionAction} animDelay={0.2} />
      </div>

      {/* Phase tags */}
      {phase.tags && phase.tags.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
          {phase.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      )}
    </motion.section>
  );
}