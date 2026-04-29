"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import VedicDivider from "@/components/ui/VedicDivider";
import InsightCard from "@/components/ui/InsightCard";
import Footer from "@/components/ui/Footer";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SECTIONS = [
  {
    label: "The System",
    title: "Sidereal vs. Tropical",
    body: [
       "Western astrology uses the tropical zodiac, a fixed grid anchored to the seasons, measured from the spring equinox. Vedic astrology uses the sidereal zodiac, calibrated to the actual positions of constellations in the night sky.",
       "Over millennia, Earth's axial precession has shifted these two frameworks by approximately 23–24 degrees, a gap called the ayanamsa. Kaal works entirely within the sidereal system, placing you where the stars actually are, not where they were two thousand years ago.",
    ],
  },
  {
    label: "The Calculations",
    title: "Ayanamsa & Panchang",
    body: [
      "Kaal uses the Lahiri ayanamsa — the standard adopted by the Indian government for its national ephemeris — to convert tropical planetary positions to sidereal coordinates.",
      "Each day is evaluated against the Panchang: the five limbs of Vedic timekeeping. Tithi (lunar day), Vara (weekday), Nakshatra (lunar mansion), Yoga (sun-moon combination), and Karana (half-day arc). These five elements combine to produce the energetic signature of any given moment.",
    ],
  },
  {
    label: "The Interpretation",
    title: "From Data to Pattern",
    body: [
      "Raw planetary positions are not inherently meaningful — interpretation requires a model. Kaal's engine maps the five Panchang elements, the ruling nakshatra, and current dasha cycles into a coherent phase framework.",
      "Each phase carries a dominant quality: expansion, consolidation, dissolution, or renewal. Kaal reads these qualities as operational guidance — not prediction, but orientation. The result is a daily signal that tells you not what will happen, but what kind of time you are in.",
    ],
  },
] as const;

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  };
}

export default function MethodologyPage() {
  const shouldReduce = useReducedMotion();

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
        <main style={{ maxWidth: "720px", margin: "0 auto", paddingBottom: "8rem" }}>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduce ? 0 : 0.5, ease: EASE }}
            style={{ paddingTop: "clamp(1.5rem, 4vw, 2.5rem)" }}
          >
            <Link
              href="/dashboard"
               style={{
                 fontFamily: "var(--font-inter-var)",
                 fontSize: "11px",
                 color: "#7A7469",
                 textTransform: "uppercase",
                 letterSpacing: "0.14em",
                 textDecoration: "none",
                 display: "inline-flex",
                 alignItems: "center",
                 gap: "6px",
                 padding: "8px 0",
                 transition: "color 0.15s ease",
               }}
            >
              ← Back to Dashboard
            </Link>
          </motion.div>

          {/* Page header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={childAnim(0.1)}
            style={{ textAlign: "center", marginTop: "3.5rem", marginBottom: "4.5rem" }}
          >
            <p style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              color: "#786030",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              margin: "0 0 1.25rem",
            }}>
              Vedic Blueprint
            </p>
            <h1 style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(2.25rem, 7vw, 3.75rem)",
              fontWeight: 700,
              color: "#2C2418",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              margin: "0 0 1.25rem",
            }}>
              Methodology
            </h1>
            <p style={{
              fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "#5C574F",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
              margin: 0,
            }}>
              How Kaal reads time.
            </p>
          </motion.div>

          {/* Content sections */}
          {SECTIONS.map((section, idx) => (
            <div key={section.label}>
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={childAnim(0)}
              >
                {/* Section label */}
                <motion.p
                  variants={childAnim(0)}
                  style={{
                    fontFamily: "var(--font-inter-var)",
                    fontSize: "11px",
                    color: "#786030",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    margin: "0 0 10px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid rgba(61,52,40,0.12)",
                  }}
                >
                  {section.label}
                </motion.p>

                {/* Section title */}
                <motion.h2
                  variants={childAnim(0.05)}
                  style={{
                    fontFamily: "var(--font-playfair-display)",
                    fontSize: "clamp(1.4rem, 4vw, 1.875rem)",
                    fontWeight: 700,
                    color: "#2C2418",
                    lineHeight: 1.2,
                    margin: "1rem 0 1.25rem",
                  }}
                >
                  {section.title}
                </motion.h2>

                {/* Body paragraphs */}
                {section.body.map((para, i) => (
                  <motion.p
                    key={i}
                    variants={childAnim(0.1 + i * 0.08)}
                    style={{
                      fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
                      fontSize: "1.05rem",
                      color: "#4A4F46",
                      lineHeight: 1.8,
                      letterSpacing: "0.015em",
                      margin: i === 0 ? 0 : "1.25rem 0 0",
                    }}
                  >
                    {para}
                  </motion.p>
                ))}
              </motion.section>

              <VedicDivider />
            </div>
          ))}

          {/* Philosophy InsightCard */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={childAnim(0)}
          >
            <InsightCard
              type="positive"
              label="Kaal Philosophy"
              content="Time is not a measurement, but a quality."
              animDelay={0.2}
            />
          </motion.div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
