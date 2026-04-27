"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useUser } from "@/context/UserContext";
import { DECISION_CATEGORIES, DECISION_CAVEATS, type DecisionCategory, type DecisionOutcome } from "@/lib/types/engine";

/** Returns true when two strings share ≥4 meaningful words (cross-section dedup). */
function tooSimilar(a: string, b: string): boolean {
  const norm = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 4);
  const setA = new Set(norm(a));
  return norm(b).filter((w) => setA.has(w)).length >= 4;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const actionByOutcome: Record<DecisionOutcome, "ACT" | "WAIT" | "AVOID"> = {
  favorable: "ACT",
  neutral: "WAIT",
  caution: "AVOID",
};

const actionColors: Record<DecisionOutcome, string> = {
  favorable: "#A65D46",
  neutral: "#A65D46",
  caution: "#A65D46",
};

export default function DecisionSection() {
  const { computedData } = useUser();
  const [active, setActive] = useState<DecisionCategory>("career");
  const shouldReduce = useReducedMotion();

  if (!computedData) return null;

  const result = computedData.decisions[active];
  const { phase, daily } = computedData;

  const shadowCaveat = Object.values(computedData.decisions).find((d) => d.shadowCaveat)?.shadowCaveat;

  /** Sentences already covered in Phase and Today sections — filter these out of Decision body. */
  const crossSectionContext = [
    phase.summary,
    phase.supportAction,
    daily.guidance,
    daily.caution,
    daily.focusArea,
  ].filter(Boolean);

  const childAnim = (delay: number) => ({
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  });

  return (
    <section>
      {/* Header row: Decision + active category inline */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={childAnim(0)}
        style={{ display: "flex", alignItems: "baseline", gap: "12px", paddingBottom: "10px", borderBottom: "1px solid rgba(61,52,40,0.12)", marginBottom: "1rem" }}
      >
        <p
          className="tracking-[0.2em]"
          style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px", fontWeight: 500, textTransform: "lowercase", margin: 0 }}
        >
          decision
        </p>
        <span style={{
          fontFamily: "var(--font-inter-var)",
          fontSize: "11px",
          textTransform: "lowercase",
          letterSpacing: "0.06em",
          color: "#A65D46",
        }}>
          {active}
        </span>
      </motion.div>

      {/* Category navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "0",
          marginBottom: "1rem",
          paddingBottom: "10px",
          borderBottom: "1px solid rgba(122, 116, 105, 0.12)",
        }}
      >
        {DECISION_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              color: active === category ? "#A65D46" : "#7A7469",
              textTransform: "lowercase",
              letterSpacing: "0.02em",
              fontWeight: active === category ? 500 : 400,
              background: "none",
              border: "none",
              padding: "8px 0",
              paddingRight: "20px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Decision result panel */}
      <div
        id={`decision-panel-${active}`}
        className="mt-6 text-center"
        role="tabpanel"
        aria-live="polite"
        aria-atomic="true"
        style={{ minHeight: "160px", position: "relative" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: shouldReduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } }}
            exit={{ opacity: 0, y: shouldReduce ? 0 : 10, transition: { duration: 0.2, ease: "easeIn" } }}
          >
            <motion.p
              className="font-bold"
              initial={{ scale: shouldReduce ? 1 : 0.95 }}
              animate={{ scale: 1, transition: { duration: 0.2, ease: EASE } }}
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontStyle: "normal",
                fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
                color: actionColors[result.outcome],
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              {actionByOutcome[result.outcome]}
            </motion.p>
            <p
              className="mt-1"
              style={{ color: "#2C2418", opacity: 0.8, fontFamily: "var(--font-inter-var), sans-serif", fontSize: "15px", lineHeight: 1.5, letterSpacing: "0.02em", textTransform: "lowercase", textAlign: "center" }}
            >
              {result.guidance}
            </p>
{result.rationale
              .filter((line, i, arr) => {
                const norm = line.trim().toLowerCase();
                if (arr.findIndex(l => l.trim().toLowerCase() === norm) !== i) return false;
                if (norm === result.guidance.trim().toLowerCase()) return false;
                if (crossSectionContext.some(ctx => tooSimilar(ctx, line))) return false;
                return true;
              })
              .map((line, i) => (
                <p
                  key={i}
                  className="mt-0.5"
                  style={{ color: "#2C2418", opacity: 0.8, fontFamily: "var(--font-inter-var), sans-serif", fontSize: "15px", lineHeight: 1.5, letterSpacing: "0.02em", textTransform: "lowercase", textAlign: "center" }}
                >
                  {line}
                </p>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shadow caveat */}
      {shadowCaveat && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "32px",
            paddingTop: "6px",
            paddingBottom: "6px",
            borderLeft: "2px solid rgba(166, 93, 70, 0.3)",
            paddingLeft: "16px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter-var), sans-serif",
              fontStyle: "italic",
              fontSize: "13px",
              color: "#2C2418",
              opacity: 0.7,
              textTransform: "lowercase",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {DECISION_CAVEATS[active] || result.shadowCaveat}
          </p>
        </div>
      )}
    </section>
  );
}
