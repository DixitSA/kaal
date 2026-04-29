"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import VedicDivider from "@/components/ui/VedicDivider";
import Footer from "@/components/ui/Footer";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SECTIONS = [
  {
    label: "Local Computation",
    title: "Your Birth Details Stay on Your Device",
    body: [
       "Every astrological calculation Kaal performs, planetary positions, nakshatra placement, dasha cycles, Panchang elements, is computed entirely within your browser. Your birth data never leaves your device.",
       "We do not operate a server that receives, processes, or stores your date, time, or place of birth. There is no account, no upload, no transmission. The calculation engine runs locally in JavaScript the moment you enter your details.",
    ],
  },
  {
    label: "No Tracking",
    title: "No Third-Party Eyes",
    body: [
      "Kaal does not embed advertising trackers, analytics pixels, or data broker scripts. We do not use Google Analytics, Meta Pixel, or any equivalent third-party surveillance tool.",
      "We do not sell, share, or license your data to advertisers or data brokers — because we do not collect it in the first place. Your patterns of use are yours alone.",
    ],
  },
  {
    label: "Data Storage",
    title: "Browser Storage Only",
    body: [
      "If you save charts, patterns, or your birth profile for repeat visits, that data is written exclusively to your browser's local storage or IndexedDB. It lives on your device, in your browser, under your control.",
      "Clearing your browser data or using a different device starts fresh. There is no cloud backup or synchronisation, by design.",
    ],
  },
] as const;

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  };
}

export default function PrivacyPage() {
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
              Your Data
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
              Privacy
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
              Your data is a private constellation.
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

          {/* Closing note */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={childAnim(0)}
            style={{
              fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "var(--kaal-footer-text)",
              lineHeight: 1.8,
              letterSpacing: "0.02em",
              textAlign: "center",
            }}
          >
            Questions? Reach us at{" "}
            <a
              href="mailto:support@getkaal.com"
              style={{ color: "var(--kaal-footer-text)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              support@getkaal.com
            </a>
          </motion.p>

        </main>
      </div>

      <Footer />
    </div>
  );
}
