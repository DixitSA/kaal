"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STEPS = [
  {
    n: "01",
    title: "the sidereal sky",
    body: "vedic astrology reads the sky as it actually is: the sidereal zodiac, calibrated to real constellations. not the seasonal tropical grid most western astrology runs on.",
  },
  {
    n: "02",
    title: "the panchang",
    body: "every day is scored against five classical elements: tithi, nakshatra, yoga, karana, and the ruling planetary period. together they form one measurable signature for that moment.",
  },
  {
    n: "03",
    title: "signature to signal",
    body: "that signature becomes a phase reading and decision support. not a prediction of what will happen, but an orientation for the kind of time you are in.",
  },
] as const;

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: EASE } },
  };
}

export default function MethodologyTeaser() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="method"
      style={{ scrollMarginTop: "96px", maxWidth: "760px", margin: "0 auto", padding: "clamp(4rem, 10vw, 7rem) clamp(1.5rem, 5vw, 2rem)" }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={childAnim(0)}
        style={{ marginBottom: "clamp(2.5rem, 6vw, 3.5rem)" }}
      >
        <SectionLabel style={{ fontSize: "11px", marginBottom: "0.9rem" }}>How Kaal Reads Time</SectionLabel>
        <h2
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(1.6rem, 4.5vw, 2.25rem)",
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.25,
            margin: 0,
            maxWidth: "20ch",
          }}
        >
          Deterministic, not theatrical.
        </h2>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={childAnim(shouldReduce ? 0 : i * 0.08)}
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr",
              gap: "clamp(1rem, 4vw, 2rem)",
              padding: "1.75rem 0",
              borderTop: i === 0 ? "1px solid rgba(122,116,105,0.14)" : undefined,
              borderBottom: "1px solid rgba(122,116,105,0.14)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
                fontSize: "0.85rem",
                color: "var(--accent-gold)",
                letterSpacing: "0.08em",
                paddingTop: "3px",
              }}
            >
              {step.n}
            </span>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 0.5rem",
                  textTransform: "lowercase",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
                  fontSize: "0.98rem",
                  color: "var(--olive-dark)",
                  lineHeight: 1.75,
                  letterSpacing: "0.01em",
                  margin: 0,
                  maxWidth: "58ch",
                }}
              >
                {step.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={childAnim(0.1)}
        style={{ marginTop: "1.5rem" }}
      >
        <Link
          href="/methodology"
          style={{
            fontFamily: "var(--font-inter-var)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            textDecoration: "none",
            borderBottom: "1px solid rgba(122,116,105,0.3)",
            paddingBottom: "3px",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          read the full methodology →
        </Link>
      </motion.div>
    </section>
  );
}
