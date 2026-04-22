"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useUser } from "@/context/UserContext";
import { DECISION_CATEGORIES, type DecisionCategory, type DecisionOutcome } from "@/lib/types/engine";

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
  favorable: "#5E7A5E",
  neutral: "#8A7240",
  caution: "#A04040",
};

export default function DecisionSection() {
  const { computedData } = useUser();
  const [active, setActive] = useState<DecisionCategory>("career");
  const shouldReduce = useReducedMotion();
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const btn = btnRefs.current[active];
    const container = containerRef.current;
    if (!btn || !container) return;
    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setUnderline({ left: btnRect.left - containerRect.left, width: btnRect.width });
  }, [active]);

  if (!computedData) return null;

  const result = computedData.decisions[active];
  const { phase, daily } = computedData;

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
      {/* Section label */}
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={childAnim(0)}
        className="tracking-[0.2em]"
        style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px", textTransform: "lowercase" }}
      >
        Decision
      </motion.p>

      {/* Tab bar — plain in-flow, scrolls with the page */}
      <div
        style={{
          marginTop: "16px",
          borderBottom: "1px solid rgba(122, 116, 105, 0.12)",
          marginLeft: "-24px",
          marginRight: "-24px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div
          ref={containerRef}
          className="flex flex-wrap gap-x-6 gap-y-2"
          role="tablist"
          aria-label="Decision categories"
          style={{ position: "relative" }}
        >
          {DECISION_CATEGORIES.map((category) => (
            <button
              key={category}
              ref={(el) => { btnRefs.current[category] = el; }}
              onClick={() => setActive(category)}
              className="transition-colors"
              role="tab"
              aria-selected={active === category}
              aria-controls={`decision-panel-${category}`}
              style={{
                fontFamily: "var(--font-inter-var)",
                fontSize: "0.875rem",
                textTransform: "lowercase",
                letterSpacing: "0.02em",
                color: active === category ? "#B5563E" : "#7A7469",
                background: "none",
                border: "none",
                padding: "10px 4px",
                minHeight: "44px",
                minWidth: "44px",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
            >
              {category}
            </button>
          ))}

          {/* Sliding underline */}
          {!shouldReduce && underline.width > 0 && (
            <motion.div
              animate={{ left: underline.left, width: underline.width }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{
                position: "absolute",
                bottom: "0px",
                height: "2px",
                backgroundColor: "#B5563E",
                borderRadius: "1px",
              }}
            />
          )}
        </div>
      </div>

      {/* Decision result panel */}
      <div
        id={`decision-panel-${active}`}
        className="mt-10 text-center"
        role="tabpanel"
        aria-live="polite"
        aria-atomic="true"
        style={{ minHeight: "190px", position: "relative" }}
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
              }}
            >
              {actionByOutcome[result.outcome]}
            </motion.p>
            <p
              className="mt-4"
              style={{ color: "#7A7469", fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif", fontSize: "1.4rem", lineHeight: 1.5, fontStyle: "normal", letterSpacing: "0.02em", textTransform: "lowercase" }}
            >
              {result.guidance}
            </p>
            {result.rationale
              .filter((line, i, arr) => {
                const norm = line.trim().toLowerCase();
                // dedupe within rationale
                if (arr.findIndex(l => l.trim().toLowerCase() === norm) !== i) return false;
                // dedupe against guidance
                if (norm === result.guidance.trim().toLowerCase()) return false;
                // dedupe against phase + today content
                if (crossSectionContext.some(ctx => tooSimilar(ctx, line))) return false;
                return true;
              })
              .map((line, i) => (
                <p
                  key={i}
                  className="mt-1 text-sm sm:text-base"
                  style={{ color: "#9C9488", fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif", fontStyle: "normal", letterSpacing: "0.02em", textTransform: "lowercase", opacity: 0.6 }}
                >
                  {line}
                </p>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
