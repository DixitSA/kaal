"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import InsightCard from "@/components/ui/InsightCard";
import type { TaraBalaLevel } from "@/lib/types/astrology";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TARA_DISPLAY: Record<TaraBalaLevel, string> = {
  janma:       "janma tara — introspective",
  sampat:      "sampat tara — abundant",
  vipat:       "vipat tara — obstacle",
  kshema:      "kshema tara — stable",
  pratyari:    "pratyari tara — challenging",
  sadhaka:     "sadhaka tara — achieving",
  naidhana:    "naidhana tara — difficult",
  mitra:       "mitra tara — friendly",
  paramamitra: "paramamitra tara — excellent",
};

const TARA_FAVORABLE: ReadonlySet<TaraBalaLevel> = new Set([
  "sampat", "kshema", "sadhaka", "mitra", "paramamitra"
]);

export default function TodaySection() {
  const { computedData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!computedData) return null;

  const { daily } = computedData;
  const taraBala = computedData.chart.transit.taraBala;

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
      <motion.p
        variants={childAnim(0)}
        className="tracking-[0.2em]"
        style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px", textTransform: "lowercase" }}
      >
        Today
      </motion.p>

      {/* Signal tone */}
      <motion.h2
        variants={childAnim(0.1)}
        className="mt-3"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontStyle: "normal",
          fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
          color: "#2C2418",
          lineHeight: 1.2,
          maxWidth: "25ch",
          textAlign: "center",
          width: "100%",
        }}
      >
        {daily.signalTone}
      </motion.h2>

      <motion.p
        variants={childAnim(0.15)}
        className="mt-4 text-base"
        style={{ color: "#5C574F", fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif", fontStyle: "normal", letterSpacing: "0.02em", textTransform: "lowercase", textAlign: "center" }}
      >
        focus area: {daily.focusArea}
      </motion.p>

      {/* Guidance */}
      <motion.div variants={childAnim(0.2)} className="mt-8">
        <InsightCard
          type="positive"
          label="Guidance"
          content={daily.guidance}
          animDelay={0.3}
        />
      </motion.div>

      {/* Caution */}
      <motion.div variants={childAnim(0.3)} className="mt-6">
        <InsightCard
          type="negative"
          label="Caution"
          content={daily.caution}
          animDelay={0.45}
        />
      </motion.div>

      {/* Tara Bala */}
      <motion.div variants={childAnim(0.4)} style={{ marginTop: "20px" }}>
        <span
          style={{
            fontFamily: "var(--font-inter-var)",
            fontSize: "11px",
            textTransform: "lowercase",
            letterSpacing: "0.06em",
            color: TARA_FAVORABLE.has(taraBala.level) ? "#5E7A5E" : "#9C9488",
            backgroundColor: TARA_FAVORABLE.has(taraBala.level)
              ? "rgba(94, 122, 94, 0.08)"
              : "rgba(122, 116, 105, 0.08)",
            borderRadius: "2px",
            padding: "3px 8px",
          }}
        >
          {TARA_DISPLAY[taraBala.level]}
        </span>
      </motion.div>
    </motion.section>
  );
}
