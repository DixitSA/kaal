"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useUser } from "@/context/UserContext";
import { DECISION_CATEGORIES, DECISION_CAVEATS, type DecisionCategory, type DecisionOutcome } from "@/lib/types/engine";
import SectionLabel from "@/components/ui/SectionLabel";

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
  favorable: "var(--accent-green)",
  neutral: "var(--accent-terracotta)",
  caution: "var(--accent-red)",
};

interface DecisionSectionProps {
  locked?: boolean;
  onUpgrade?: () => void;
}

export default function DecisionSection({ locked = false, onUpgrade }: DecisionSectionProps) {
  const { computedData } = useUser();
  const [active, setActive] = useState<DecisionCategory>("career");
  const shouldReduce = useReducedMotion();

  if (!computedData) return null;

  const result = computedData.decisions[active];
  if (!result) return null;
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
    <section style={{ paddingTop: "24px" }}>
      {/* Single-row nav: 'decision' label + category tabs on one scrollable rail */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={childAnim(0)}
        className="nav-scroll"
        style={{
          display: "flex",
          alignItems: "baseline",
          borderBottom: "1px solid rgba(61,52,40,0.12)",
          marginBottom: "1.25rem",
        }}
      >
        {/* Static 'decision' label, not a tab */}
        <SectionLabel
          as="span"
          style={{ padding: "8px 0", marginRight: "24px", marginBottom: "-1px", flexShrink: 0 }}
        >
          decision
        </SectionLabel>

        {/* Category tabs — button width = text width so the absolute underline is text-wide */}
        {DECISION_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              padding: "8px 0",
              marginRight: "20px",
              marginBottom: "-1px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <span style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              color: active === category ? "var(--accent-terracotta)" : "var(--text-tertiary)",
              opacity: active === category ? 1 : 0.4,
              textTransform: "lowercase",
              letterSpacing: "0.04em",
              fontWeight: 400,
              display: "block",
              transition: "color 0.15s ease, opacity 0.15s ease",
            }}>
              {category}
            </span>
            {active === category && (
              <motion.span
                layoutId="decision-underline"
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  left: 0,
                  right: 0,
                  height: "2px",
                  backgroundColor: "var(--accent-terracotta)",
                  borderRadius: "1px",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Decision result panel + shadow caveat — blurred when locked */}
      <div style={{ position: "relative" }}>
        <div style={{ filter: locked ? "blur(6px)" : "none", pointerEvents: locked ? "none" : "auto", userSelect: locked ? "none" : "auto" }}>
          <div
            id={`decision-panel-${active}`}
            className="mt-3 text-center"
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
                  style={{ color: "var(--text-primary)", opacity: 0.8, fontFamily: "var(--font-inter-var), sans-serif", fontSize: "15px", lineHeight: 1.5, letterSpacing: "0.02em", textTransform: "lowercase", textAlign: "center" }}
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
                      style={{ color: "var(--text-primary)", opacity: 0.8, fontFamily: "var(--font-inter-var), sans-serif", fontSize: "15px", lineHeight: 1.5, letterSpacing: "0.02em", textTransform: "lowercase", textAlign: "center" }}
                    >
                      {line}
                    </p>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {shadowCaveat && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "32px",
                paddingTop: "6px",
                paddingBottom: "6px",
                 borderLeft: "1px solid rgba(166, 93, 70, 0.3)",
                paddingLeft: "16px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter-var), sans-serif",
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "var(--text-primary)",
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
        </div>

        {/* Upgrade overlay — only over the result panel, header stays visible */}
        {locked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(245,240,232,0.7)",
            }}
          >
            <button
              onClick={onUpgrade}
              style={{
                padding: "12px 24px",
                backgroundColor: "var(--accent-terracotta-btn)",
                color: "var(--bg-cream)",
                border: "none",
                borderRadius: "4px",
                fontFamily: "var(--font-inter-var), sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Upgrade to Pro →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
