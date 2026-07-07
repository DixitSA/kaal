"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { needsDailyRefresh } from "@/lib/client/kaalApp";
import YantraMandala from "@/components/svg/YantraMandala";
import DecorativeDivider from "@/components/svg/DecorativeDivider";
import BirthForm from "@/components/landing/BirthForm";
import LoginForm from "@/components/landing/LoginForm";
import LandingHeader from "@/components/landing/LandingHeader";
import MethodologyTeaser from "@/components/landing/MethodologyTeaser";
import SampleSignal from "@/components/landing/SampleSignal";
import PricingTeaserSection from "@/components/landing/PricingTeaserSection";
import FaqSection from "@/components/landing/FaqSection";
import VedicDivider from "@/components/ui/VedicDivider";
import Footer from "@/components/ui/Footer";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HEADLINE_DELAY = 0.5;

export default function LandingPage() {
  const router = useRouter();
  const { userData, computedData, isLoading } = useUser();
  const shouldReduce = useReducedMotion();
  const [mode, setMode] = useState<"signup" | "login">("signup");

  useEffect(() => {
    if (isLoading || !userData) return;
    router.replace(needsDailyRefresh(computedData) ? "/loading-screen" : "/dashboard");
  }, [computedData, isLoading, router, userData]);

  if (isLoading) return <div style={{ minHeight: "100dvh", backgroundColor: "var(--bg-cream)" }} />;

  const fieldVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: HEADLINE_DELAY + 0.2 + i * 0.12, duration: shouldReduce ? 0 : 0.45, ease: EASE },
    }),
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg-cream)" }}>

      {/* Star chart texture — antique constellation watermark, persists across the whole scroll */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.25 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="star-chart" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="25" r="0.9" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="80" cy="58" r="1.1" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="142" cy="38" r="0.7" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="168" cy="82" r="1.0" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="52" cy="118" r="0.8" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="112" cy="98" r="1.2" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="157" cy="143" r="0.9" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="28" cy="168" r="0.7" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="92" cy="178" r="1.0" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="174" cy="162" r="0.8" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="62" cy="44" r="0.4" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="122" cy="68" r="0.35" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="42" cy="88" r="0.4" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="162" cy="122" r="0.35" fill="var(--olive-dark)" opacity="0.15" />
              <circle cx="132" cy="158" r="0.4" fill="var(--olive-dark)" opacity="0.15" />
              <line x1="30" y1="25" x2="80" y2="58" stroke="var(--olive-dark)" strokeWidth="0.5" opacity="0.12" />
              <line x1="80" y1="58" x2="112" y2="98" stroke="var(--olive-dark)" strokeWidth="0.5" opacity="0.12" />
              <line x1="142" y1="38" x2="168" y2="82" stroke="var(--olive-dark)" strokeWidth="0.5" opacity="0.12" />
              <line x1="52" y1="118" x2="112" y2="98" stroke="var(--olive-dark)" strokeWidth="0.5" opacity="0.12" />
              <line x1="157" y1="143" x2="174" y2="162" stroke="var(--olive-dark)" strokeWidth="0.5" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star-chart)" />
        </svg>
      </div>

      {/* Grain texture */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.03 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="landing-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#landing-grain)" />
        </svg>
      </div>

      <LandingHeader />

      <main className="relative" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Hero ── */}
        <section
          className="flex items-start sm:items-center justify-center px-6 sm:px-6 relative"
          style={{ paddingTop: "clamp(3rem, 8vw, 5rem)", paddingBottom: "clamp(4rem, 10vw, 6rem)" }}
        >
          {/* Background mandala */}
          <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 0, width: "200vmax", height: "200vmax", maxWidth: "900px", maxHeight: "900px" }}>
            <YantraMandala size={900} opacity={0.04} />
          </div>

          <div className="w-full flex flex-col items-center" style={{ position: "relative", zIndex: 2, maxWidth: "560px" }}>
            <div className="relative flex flex-col items-center w-full landing-hero-section">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ rotate: 0, scale: 1 }}
                animate={shouldReduce ? {} : { rotate: 360, scale: [1, 1.03, 1] }}
                transition={{
                  rotate: { duration: 24, ease: "linear", repeat: Infinity },
                  scale: { duration: 4, ease: "easeInOut", repeat: Infinity },
                }}
                style={{ willChange: "transform" }}
              >
                <YantraMandala size={500} opacity={0.05} />
              </motion.div>

              <motion.h1
                className="relative z-10 text-center font-bold leading-tight landing-hero"
                initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduce ? 0 : 0.6, ease: EASE }}
                style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "clamp(1.9rem, 6vw, 3rem)",
                  color: "var(--text-primary)",
                  letterSpacing: "0.04em",
                  margin: 0,
                  marginBottom: "0.5rem",
                  textAlign: "center",
                }}
              >
                know what&apos;s happening.
                <br />
                <span style={{ fontStyle: "italic", fontWeight: 200, opacity: 0.7 }}>know what to do.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: HEADLINE_DELAY + 0.05, duration: 0.7, ease: EASE }}
              style={{
                fontFamily: "var(--font-inter-var), sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                color: "var(--accent-red)",
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "1.5rem",
                position: "relative",
                zIndex: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Built on Vedic Timing Systems
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: HEADLINE_DELAY + 0.1, duration: shouldReduce ? 0 : 1, ease: EASE }}
              style={{ transformOrigin: "center", marginBottom: "2.5rem" }}
            >
              <DecorativeDivider width={200} opacity={0.25} style={{ maxWidth: "calc(100vw - 64px)" }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: HEADLINE_DELAY + 0.35, duration: 0.7, ease: EASE }}
              style={{
                fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
                fontSize: "1rem",
                color: "var(--olive-dark)",
                textAlign: "center",
                lineHeight: 1.75,
                maxWidth: "42ch",
                margin: 0,
              }}
            >
              a daily timing signal built from your exact birth chart, read through the sidereal system, not a generic sun-sign forecast.
            </motion.p>

            <motion.a
              href="#method"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: HEADLINE_DELAY + 0.55, duration: 0.7, ease: EASE }}
              style={{
                marginTop: "2.75rem",
                fontFamily: "var(--font-inter-var)",
                fontSize: "10px",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              how it works
              <span aria-hidden="true" style={{ fontSize: "13px" }}>↓</span>
            </motion.a>
          </div>
        </section>

        <MethodologyTeaser />
        <SampleSignal />
        <PricingTeaserSection />
        <FaqSection />

        {/* ── Sign up / log in ── */}
        <section
          id="start"
          style={{ scrollMarginTop: "72px", padding: "clamp(4rem, 10vw, 6rem) 1.5rem clamp(5rem, 12vw, 7rem)" }}
        >
          <div className="w-full flex flex-col items-center" style={{ maxWidth: "560px", margin: "0 auto" }}>
            <VedicDivider />

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.5, ease: EASE } } }}
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(1.6rem, 4.5vw, 2.1rem)",
                fontWeight: 600,
                color: "var(--text-primary)",
                textAlign: "center",
                margin: "0 0 2.5rem",
              }}
            >
              {mode === "signup" ? "begin your reading." : "welcome back."}
            </motion.h2>

            <div style={{ width: "100%", maxWidth: "480px" }}>
              <div
                role="tablist"
                aria-label="Sign up or log in"
                style={{ display: "flex", justifyContent: "center", gap: "28px", marginBottom: "28px" }}
              >
                {(
                  [
                    { key: "signup", label: "new reading" },
                    { key: "login", label: "log in" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={mode === tab.key}
                    onClick={() => setMode(tab.key)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 2px 8px",
                      fontFamily: "var(--font-inter-var), sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: mode === tab.key ? "var(--text-primary)" : "var(--olive-dark)",
                      opacity: mode === tab.key ? 1 : 0.6,
                      borderBottom: mode === tab.key ? "2px solid var(--accent-terracotta)" : "2px solid transparent",
                      transition: "opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {mode === "signup" ? (
                <BirthForm fieldVariants={fieldVariants} shouldReduce={!!shouldReduce} />
              ) : (
                <LoginForm fieldVariants={fieldVariants} shouldReduce={!!shouldReduce} />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
