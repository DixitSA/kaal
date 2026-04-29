"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { needsDailyRefresh } from "@/lib/client/kaalApp";
import YantraMandala from "@/components/svg/YantraMandala";
import DecorativeDivider from "@/components/svg/DecorativeDivider";
import BirthForm from "@/components/landing/BirthForm";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headline1 = "know what's happening.".split(" ");
const headline2 = "know what to do.".split(" ");
const allWords = [...headline1.map(w => ({ word: w, line: 0 })), ...headline2.map(w => ({ word: w, line: 1 }))];

const FOOTER_LINKS = [
  { label: "Methodology", href: "/methodology" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

export default function LandingPage() {
  const router = useRouter();
  const { userData, computedData, isLoading } = useUser();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (isLoading || !userData) return;
    router.replace(needsDailyRefresh(computedData) ? "/loading-screen" : "/dashboard");
  }, [computedData, isLoading, router, userData]);

  if (isLoading) return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: shouldReduce ? 0 : 0.5, ease: EASE },
    }),
  };

  const fieldVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: allWords.length * 0.1 + 0.2 + i * 0.12, duration: shouldReduce ? 0 : 0.45, ease: EASE },
    }),
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F2ED" }}>

      {/* Star chart texture — antique constellation watermark */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.25 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="star-chart" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Stars — muted green, varying radii */}
              <circle cx="30" cy="25" r="0.9" fill="#4A4F46" opacity="0.15" />
              <circle cx="80" cy="58" r="1.1" fill="#4A4F46" opacity="0.15" />
              <circle cx="142" cy="38" r="0.7" fill="#4A4F46" opacity="0.15" />
              <circle cx="168" cy="82" r="1.0" fill="#4A4F46" opacity="0.15" />
              <circle cx="52" cy="118" r="0.8" fill="#4A4F46" opacity="0.15" />
              <circle cx="112" cy="98" r="1.2" fill="#4A4F46" opacity="0.15" />
              <circle cx="157" cy="143" r="0.9" fill="#4A4F46" opacity="0.15" />
              <circle cx="28" cy="168" r="0.7" fill="#4A4F46" opacity="0.15" />
              <circle cx="92" cy="178" r="1.0" fill="#4A4F46" opacity="0.15" />
              <circle cx="174" cy="162" r="0.8" fill="#4A4F46" opacity="0.15" />
              {/* Micro dust dots */}
              <circle cx="62" cy="44" r="0.4" fill="#4A4F46" opacity="0.15" />
              <circle cx="122" cy="68" r="0.35" fill="#4A4F46" opacity="0.15" />
              <circle cx="42" cy="88" r="0.4" fill="#4A4F46" opacity="0.15" />
              <circle cx="162" cy="122" r="0.35" fill="#4A4F46" opacity="0.15" />
              <circle cx="132" cy="158" r="0.4" fill="#4A4F46" opacity="0.15" />
              {/* Constellation lines — 12% opacity watermark */}
              <line x1="30" y1="25" x2="80" y2="58" stroke="#4A4F46" strokeWidth="0.5" opacity="0.12" />
              <line x1="80" y1="58" x2="112" y2="98" stroke="#4A4F46" strokeWidth="0.5" opacity="0.12" />
              <line x1="142" y1="38" x2="168" y2="82" stroke="#4A4F46" strokeWidth="0.5" opacity="0.12" />
              <line x1="52" y1="118" x2="112" y2="98" stroke="#4A4F46" strokeWidth="0.5" opacity="0.12" />
              <line x1="157" y1="143" x2="174" y2="162" stroke="#4A4F46" strokeWidth="0.5" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star-chart)" />
        </svg>
      </div>

      {/* Header — centered logo */}
      <header style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem 2.5rem 1rem" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "1rem",
            fontWeight: 400,
            color: "#2C2418",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          KAAL
        </motion.div>
      </header>

      <main
        className="flex items-start sm:items-center justify-center px-6 sm:px-6 relative"
        style={{
          paddingTop: "2rem",
          paddingBottom: "120px",
        }}
      >
        {/* Grain texture */}
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.03 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="landing-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#landing-grain)" />
          </svg>
        </div>

        {/* Background mandala */}
        <div aria-hidden="true" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 0, width: "200vmax", height: "200vmax", maxWidth: "900px", maxHeight: "900px" }}>
          <YantraMandala size={900} opacity={0.04} />
        </div>

      {/* Content */}
      <div className="w-full flex flex-col items-center" style={{ position: "relative", zIndex: 2, maxWidth: "560px" }}>
        {/* Yantra spin + pulse */}
        <div className="relative flex flex-col items-center w-full landing-hero-section">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={shouldReduce ? {} : { rotate: 360, scale: [1, 1.03, 1] }}
            transition={{
              rotate: { duration: 20, ease: "linear", repeat: Infinity },
              scale: { duration: 4, ease: "easeInOut", repeat: Infinity },
            }}
            style={{ willChange: "transform" }}
          >
            <YantraMandala size={500} opacity={0.05} />
          </motion.div>

          {/* Hero headline */}
          <h1
            className="relative z-10 text-center font-bold leading-tight landing-hero"
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(1.9rem, 6vw, 3rem)",
              color: "#2C2418",
              letterSpacing: "0.04em",
              margin: 0,
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {allWords.map(({ word, line }, i) => (
                <span key={i} style={{ display: "contents" }}>
                  {line === 1 && i === headline1.length && <div className="w-full" />}
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      display: "inline-block",
                      fontStyle: line === 1 ? "italic" : "normal",
                      fontWeight: line === 1 ? 200 : 700,
                      opacity: line === 1 ? 0.7 : 1,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </div>
          </h1>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: allWords.length * 0.1 + 0.05, duration: 0.7, ease: EASE }}
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

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: allWords.length * 0.1 + 0.1, duration: shouldReduce ? 0 : 1, ease: EASE }}
          style={{ transformOrigin: "center", marginBottom: "2rem" }}
        >
          <DecorativeDivider width={200} opacity={0.25} style={{ maxWidth: "calc(100vw - 64px)" }} />
        </motion.div>

        {/* Form */}
        <div style={{ width: "100%", maxWidth: "480px" }}>
          <BirthForm fieldVariants={fieldVariants} shouldReduce={!!shouldReduce} />
        </div>
      </div>

      {/* Fixed footer */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          padding: "12px 24px 18px",
          textAlign: "center",
          background: "linear-gradient(to top, rgba(245,242,237,1) 0%, rgba(245,242,237,0.9) 60%, transparent 100%)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter-var), sans-serif",
            fontStyle: "italic",
            fontSize: "11px",
            color: "#4A4F46",
            letterSpacing: "0.04em",
            margin: "0 0 6px",
          }}
        >
          Built on Vedic Timing Systems · © 2026 Kaal
        </p>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", flexWrap: "wrap" }}>
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.href + link.label} style={{ display: "flex", alignItems: "center" }}>
              <a
                href={link.href}
                style={{
                  fontFamily: "var(--font-inter-var), sans-serif",
                  fontSize: "11px",
                  color: "#4A4F46",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  padding: "10px 12px",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.color = "#2C2418"; }}
                onMouseLeave={(e) => { (e.currentTarget).style.color = "#4A4F46"; }}
              >
                {link.label}
              </a>
              {i < FOOTER_LINKS.length - 1 && (
                <span style={{ color: "rgba(74,79,70,0.3)", fontSize: "11px", userSelect: "none" }}>|</span>
              )}
            </span>
          ))}
        </nav>
      </footer>
    </main>
    </div>
  );
}
