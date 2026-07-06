"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import VedicDivider from "@/components/ui/VedicDivider";
import Footer from "@/components/ui/Footer";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SECTIONS = [
  {
    label: "What We Collect",
    title: "Your Birth Details, Held Carefully",
    body: [
      "To compute your chart, Kaal needs your date, time, and place of birth. When you create your profile, these details are sent to our server and stored in a secure database, together with your email address. They are used for one purpose: calculating your chart and keeping your profile available to you.",
      "Your chart is computed on our server from planetary ephemeris data. A copy of your profile and computed snapshot is also cached in your browser's local storage, so the dashboard loads instantly on return visits.",
    ],
  },
  {
    label: "Third Parties",
    title: "Who Else Touches Your Data",
    body: [
      "Payments are handled by Stripe. When you start a trial or subscribe, your email address is shared with Stripe to create and manage your billing account. Card details go directly to Stripe; we never see or store them.",
      "When you type a place of birth, the text you enter is sent to the Open-Meteo geocoding service to find coordinates and a timezone. If you join the waitlist, your email is stored with Loops, our email provider. That is the complete list. We do not run advertising trackers, analytics pixels, or data broker scripts, and we do not sell, share, or license your data to anyone.",
    ],
  },
  {
    label: "Control & Deletion",
    title: "Your Data, On Request",
    body: [
      "You can clear the local copy of your profile at any time using the clear session control in the dashboard, or by clearing your browser storage.",
      "To delete your account data from our server, email support@getkaal.com from the address you signed up with. We will remove your records, including your Stripe customer profile, within 30 days.",
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
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--bg-cream)" }}>
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
                 color: "var(--text-secondary)",
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
              color: "var(--accent-gold)",
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
              color: "var(--text-primary)",
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
              color: "var(--text-tagline)",
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
                    color: "var(--accent-gold)",
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
                    color: "var(--text-primary)",
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
                      color: "var(--olive-dark)",
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
