"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import InsightCard from "@/components/ui/InsightCard";
import SectionLabel from "@/components/ui/SectionLabel";
import type { TaraBalaLevel } from "@/lib/types/astrology";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TARA_DISPLAY: Record<TaraBalaLevel, string> = {
  janma:       "janma tara",
  sampat:      "sampat tara",
  vipat:       "vipat tara",
  kshema:      "kshema tara",
  pratyari:    "pratyari tara",
  sadhaka:     "sadhaka tara",
  naidhana:    "naidhana tara",
  mitra:       "mitra tara",
  paramamitra: "paramamitra tara",
};

const TARA_FAVORABLE: ReadonlySet<TaraBalaLevel> = new Set([
  "sampat", "kshema", "sadhaka", "mitra", "paramamitra"
]);

export default function TodaySection() {
  const { computedData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!computedData) return null;

  const { daily } = computedData;
  const taraBala = computedData.chart?.transit?.taraBala;
  if (!taraBala) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ padding: "clamp(20px, 5vw, 32px) 0" }}
    >
      {/* Header row: Today + tara bala inline */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", paddingBottom: "10px", borderBottom: "1px solid rgba(61,52,40,0.12)", marginBottom: "1rem" }}>
        <SectionLabel>Today</SectionLabel>
        <span style={{
          fontFamily: "var(--font-inter-var)",
          fontSize: "12px",
          textTransform: "lowercase",
          letterSpacing: "0.06em",
          color: TARA_FAVORABLE.has(taraBala.level) ? "var(--accent-green)" : "var(--accent-terracotta)",
        }}>
          {TARA_DISPLAY[taraBala.level]}
        </span>
      </div>

      {/* Signal tone */}
      <h2
        className="mt-3"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontStyle: "normal",
          fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
          color: "var(--text-primary)",
          lineHeight: 1.2,
          maxWidth: "32ch",
          textAlign: "left",
        }}
      >
        {daily.signalTone}
      </h2>

      {/* Guidance, label carries the focus area */}
      <div className="mt-8">
        <InsightCard
          type="positive"
          label={`Focus Area: ${daily.focusArea}`}
          content={daily.guidance}
          animDelay={0.1}
        />
      </div>

      {/* Caution */}
      <div className="mt-6">
        <InsightCard
          type="negative"
          label="Caution"
          content={daily.caution}
          animDelay={0.2}
        />
      </div>
    </motion.section>
  );
}
