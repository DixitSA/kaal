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

const FOOTER_LINKS = ["Readings", "Muhurta", "Privacy", "Terms", "Methodology"] as const;

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
    <div style={{ minHeight: "100dvh", background: "radial-gradient(ellipse at center, #FDFCF6 0%, #F2EFDF 100%)", boxShadow: "inset 0 0 200px rgba(44, 36, 24, 0.10)" }}>

      {/* Star chart texture — antique constellation watermark */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.07 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="star-chart" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Stars — varying radii for depth */}
              <circle cx="30" cy="25" r="0.9" fill="#2C2418" />
              <circle cx="80" cy="58" r="1.1" fill="#2C2418" />
              <circle cx="142" cy="38" r="0.7" fill="#2C2418" />
              <circle cx="168" cy="82" r="1.0" fill="#2C2418" />
              <circle cx="52" cy="118" r="0.8" fill="#2C2418" />
              <circle cx="112" cy="98" r="1.2" fill="#2C2418" />
              <circle cx="157" cy="143" r="0.9" fill="#2C2418" />
              <circle cx="28" cy="168" r="0.7" fill="#2C2418" />
              <circle cx="92" cy="178" r="1.0" fill="#2C2418" />
              <circle cx="174" cy="162" r="0.8" fill="#2C2418" />
              {/* Micro dust dots */}
              <circle cx="62" cy="44" r="0.4" fill="#2C2418" />
              <circle cx="122" cy="68" r="0.35" fill="#2C2418" />
              <circle cx="42" cy="88" r="0.4" fill="#2C2418" />
              <circle cx="162" cy="122" r="0.35" fill="#2C2418" />
              <circle cx="132" cy="158" r="0.4" fill="#2C2418" />
              {/* Constellation lines */}
              <line x1="30" y1="25" x2="80" y2="58" stroke="#2C2418" strokeWidth="0.3" opacity="0.6" />
              <line x1="80" y1="58" x2="112" y2="98" stroke="#2C2418" strokeWidth="0.3" opacity="0.6" />
              <line x1="142" y1="38" x2="168" y2="82" stroke="#2C2418" strokeWidth="0.3" opacity="0.6" />
              <line x1="52" y1="118" x2="112" y2="98" stroke="#2C2418" strokeWidth="0.3" opacity="0.6" />
              <line x1="157" y1="143" x2="174" y2="162" stroke="#2C2418" strokeWidth="0.3" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star-chart)" />
        </svg>
      </div>

      {/* Header — logo anchor */}
      <header style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: "2.5rem" }}>
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "var(--font-playfair-display)", fontSize: "1.1rem", fontWeight: 600, color: "#2C2418" }}
          >
            Kaal
          </motion.div>
        </a>
      </header>

      <main
        className="flex items-start sm:items-center justify-center px-4 sm:px-6 relative"
        style={{
          paddingTop: "4rem",
          paddingBottom: "96px",
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
          >
            <YantraMandala size={500} opacity={0.05} />
          </motion.div>

          {/* Hero headline — line 2 italic */}
          <h1
            className="relative z-10 text-center font-bold leading-tight landing-hero"
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(1.9rem, 5vw, 2.75rem)",
              color: "#2C2418",
              margin: 0,
              marginBottom: "1rem",
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
            fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
            fontSize: "clamp(0.88rem, 2.2vw, 1rem)",
            fontWeight: 300,
            color: "#5C574F",
            textAlign: "center",
            marginTop: "12px",
            marginBottom: "0.75rem",
            position: "relative",
            zIndex: 10,
            textTransform: "lowercase",
            letterSpacing: "0.02em",
          }}
        >
          Vedic timing intelligence, interpreted for modern life.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: allWords.length * 0.1 + 0.1, duration: shouldReduce ? 0 : 1, ease: EASE }}
          style={{ transformOrigin: "center" }}
        >
          <DecorativeDivider width={260} opacity={0.2} style={{ maxWidth: "calc(100vw - 48px)" }} />
        </motion.div>

        {/* Form */}
        <div style={{ width: "100%", marginTop: "1rem" }}>
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
          background: "linear-gradient(to top, rgba(242,239,223,1) 0%, rgba(242,239,223,0.9) 60%, transparent 100%)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "0.9rem",
            fontStyle: "italic",
            color: "#2C2418",
            marginBottom: "3px",
            opacity: 0.7,
          }}
        >
          Kaal
        </div>
        <p
          style={{
            fontFamily: "var(--font-inter-var), sans-serif",
            fontStyle: "italic",
            fontSize: "11px",
            color: "#9C9488",
            letterSpacing: "0.04em",
            margin: "0 0 6px",
          }}
        >
          built on vedic timing systems. © 2024 Kaal Astrology
        </p>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", flexWrap: "wrap" }}>
          {FOOTER_LINKS.map((link, i) => (
            <span key={link} style={{ display: "flex", alignItems: "center" }}>
              <a
                href="#"
                style={{
                  fontFamily: "var(--font-inter-var), sans-serif",
                  fontSize: "11px",
                  color: "#9C9488",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  padding: "10px 12px",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.color = "#2C2418"; }}
                onMouseLeave={(e) => { (e.currentTarget).style.color = "#9C9488"; }}
              >
                {link}
              </a>
              {i < FOOTER_LINKS.length - 1 && (
                <span style={{ color: "rgba(122,116,105,0.3)", fontSize: "11px", userSelect: "none" }}>|</span>
              )}
            </span>
          ))}
        </nav>
      </footer>
    </main>
    </div>
  );
}
