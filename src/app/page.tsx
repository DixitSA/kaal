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

export default function LandingPage() {
  const router = useRouter();
  const { userData, computedData, isLoading } = useUser();
  const shouldReduce = useReducedMotion();
  useEffect(() => {
    if (isLoading || !userData) {
      return;
    }

    router.replace(needsDailyRefresh(computedData) ? "/loading-screen" : "/dashboard");
  }, [computedData, isLoading, router, userData]);

  if (isLoading) return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: shouldReduce ? 0 : 0.5, ease: EASE },
    }),
  };

  const fieldVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduce ? 0 : 30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: allWords.length * 0.1 + 0.3 + i * 0.15, duration: shouldReduce ? 0 : 0.5, ease: EASE },
    }),
  };

  return (
    <main
      className="flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-16 relative"
      style={{
        minHeight: "100dvh",
        background: "radial-gradient(ellipse at center, #FDFCF6 0%, #F2EFDF 100%)",
        boxShadow: "inset 0 0 200px rgba(44, 36, 24, 0.10)",
      }}
    >
      {/* Sacred Ledger — grain texture */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.03 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="landing-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#landing-grain)" />
        </svg>
      </div>

      {/* Sacred Ledger — large background mandala */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 0, width: "200vmax", height: "200vmax", maxWidth: "900px", maxHeight: "900px" }}
      >
        <YantraMandala size={900} opacity={0.04} />
      </div>

      {/* Wordmark */}
      <motion.div
        className="fixed top-0 left-0 p-6 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ fontFamily: "var(--font-playfair-display)", fontSize: "1.25rem", color: "#2C2418" }}
      >
        Kaal
      </motion.div>

      <div className="w-full flex flex-col items-center" style={{ position: "relative", zIndex: 2, maxWidth: "560px" }}>
        {/* Yantra with rotation + pulse */}
        <div className="relative flex flex-col items-center w-full">
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

          {/* Headline word-by-word */}
          <h1
            className="relative z-10 text-center font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair-display)", fontSize: "3.5rem", color: "#2C2418", margin: 0, marginBottom: "1rem", textAlign: "center" }}
          >
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {allWords.map(({ word, line }, i) => (
                <span key={i} style={{ display: "contents" }}>
                  {line === 1 && i === headline1.length && (
                    <div className="w-full" />
                  )}
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "inline-block" }}
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
            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
            fontWeight: 300,
            color: "#7A7469",
            textAlign: "center",
            marginTop: "100px",
            marginBottom: "4rem",
            position: "relative",
            zIndex: 10,
            textTransform: "lowercase",
            letterSpacing: "0.02em",
          }}
        >
          Vedic timing intelligence, interpreted for modern life.
        </motion.p>

        {/* Decorative divider draw-in */}
        <motion.div
          className="my-5"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: allWords.length * 0.1 + 0.1, duration: shouldReduce ? 0 : 1, ease: EASE }}
          style={{ transformOrigin: "center" }}
        >
          <DecorativeDivider width={300} opacity={0.25} style={{ maxWidth: "calc(100vw - 48px)" }} />
        </motion.div>

        {/* Form with stagger slide-in */}
        <div style={{ width: "100%" }}>
          <BirthForm fieldVariants={fieldVariants} shouldReduce={!!shouldReduce} />
        </div>
      </div>
    </main>
  );
}
