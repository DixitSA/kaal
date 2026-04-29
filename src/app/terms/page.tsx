"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import VedicDivider from "@/components/ui/VedicDivider";
import Footer from "@/components/ui/Footer";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SECTIONS = [
  {
    label: "Nature of Service",
    title: "Timing Data for Self-Reflection",
    body: [
      "Kaal provides Vedic timing intelligence — planetary positions, Panchang cycles, nakshatra readings, and phase patterns — for the purposes of self-reflection and personal education. This is not a substitute for professional medical, legal, financial, or psychological advice.",
      "The outputs of Kaal are interpretive, not prescriptive. Nothing presented within the app should be relied upon as a basis for clinical, legal, or investment decisions. If you are facing a matter requiring professional judgement, please consult a qualified practitioner.",
    ],
  },
  {
    label: "Local Operation",
    title: "Your Device, Your Responsibility",
    body: [
      "Because Kaal operates entirely on your device — computing all astrology locally, storing any saved data in your browser — the security of that data is governed by the security of your device and browser environment.",
      "We cannot recover lost local data, reset a corrupted profile, or access your birth details remotely. We encourage you to keep your device and browser updated, and to manage local storage with the same care you would apply to any personal data stored locally.",
    ],
  },
  {
    label: "Intellectual Property",
    title: "Brand, Design & Algorithms",
    body: [
      "The Kaal name, visual identity, interface design, and the proprietary interpretation layer that translates Vedic timing data into actionable phase guidance are the exclusive intellectual property of Kaal Astrology.",
      "The underlying astronomical mathematics — planetary ephemeris data, ayanamsa conversion, Panchang computation — draws on open scientific foundations. The synthesis, weighting, and editorial model that produces Kaal's phase framework is original and proprietary.",
    ],
  },
] as const;

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  };
}

export default function TermsPage() {
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
              Terms of Use
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
              Terms
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
              Guidelines for the journey.
            </p>
          </motion.div>

          {/* Content sections */}
          {SECTIONS.map((section) => (
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

          {/* Effective date */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={childAnim(0)}
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              color: "var(--kaal-footer-text)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Effective 1 January 2026 · Kaal Astrology
          </motion.p>

        </main>
      </div>

      <Footer />
    </div>
  );
}
