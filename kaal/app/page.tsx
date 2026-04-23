"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";
import YantraMandala from "@/components/svg/YantraMandala";
import DecorativeDivider from "@/components/svg/DecorativeDivider";
import BirthForm from "@/components/landing/BirthForm";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headline1 = "know what's happening.".split(" ");
const headline2 = "know what to do.".split(" ");
const allWords = [...headline1.map(w => ({ word: w, line: 0 })), ...headline2.map(w => ({ word: w, line: 1 }))];

export default function LandingPage() {
  const router = useRouter();
  const { userData, isLoading } = useUser();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!isLoading && userData) router.replace("/dashboard");
  }, [isLoading, userData, router]);

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
      className="flex items-center justify-center px-6 py-16 relative"
      style={{ minHeight: "100dvh" }}
    >
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

      <div className="w-full max-w-[600px] flex flex-col items-center">
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
            <YantraMandala size={500} opacity={0.12} />
          </motion.div>

          {/* Headline word-by-word */}
          <div
            className="relative z-10 text-center font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair-display)", fontSize: "clamp(2.5rem, 8vw, 6rem)", color: "#2C2418" }}
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
          </div>
        </div>

        {/* Decorative divider draw-in */}
        <motion.div
          className="my-5"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: allWords.length * 0.1 + 0.1, duration: shouldReduce ? 0 : 1, ease: EASE }}
          style={{ transformOrigin: "center" }}
        >
          <DecorativeDivider width={300} opacity={0.25} />
        </motion.div>

        {/* Form with stagger slide-in */}
        <div className="w-full">
          <BirthForm fieldVariants={fieldVariants} shouldReduce={!!shouldReduce} />
        </div>
      </div>
    </main>
  );
}
