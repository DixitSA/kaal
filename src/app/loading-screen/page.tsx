"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { runProfilePipeline } from "@/lib/client/kaalApp";
import YantraMandala from "@/components/svg/YantraMandala";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PHASE_LABELS = ["Chart", "Interpretation", "Dashboard"] as const;

function getPhase(msg: string): number {
  const m = msg.toLowerCase();
  if (m.includes("opening") || m.includes("dashboard")) return 2;
  if (m.includes("star") || m.includes("building") || m.includes("reading") || m.includes("profile")) return 1;
  return 0;
}

const PHASE_PROGRESS = [0.34, 0.67, 1.0] as const;

export default function LoadingScreen() {
  const router = useRouter();
  const { userData, computedData, setComputedData, clearUserData, isLoading } = useUser();
  const shouldReduce = useReducedMotion();
  const [statusMessage, setStatusMessage] = useState("preparing your profile...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [yantraOpacity, setYantraOpacity] = useState(0.12);
  const startedRef = useRef(false);
  const readyToNavigateRef = useRef(false);

  const phase = getPhase(statusMessage);
  const progress = PHASE_PROGRESS[phase];

  useEffect(() => {
    if (!isLoading && !userData) router.replace("/");
  }, [isLoading, userData, router]);

  useEffect(() => {
    if (errorMessage) return undefined;
    const interval = window.setInterval(() => {
      setYantraOpacity(0.18);
      window.setTimeout(() => setYantraOpacity(0.12), 500);
    }, 1200);
    return () => window.clearInterval(interval);
  }, [errorMessage]);

  useEffect(() => {
    if (!readyToNavigateRef.current || !computedData) return;
    const timer = window.setTimeout(() => {
      router.push("/dashboard");
    }, shouldReduce ? 0 : 350);
    return () => window.clearTimeout(timer);
  }, [computedData, router, shouldReduce]);

  useEffect(() => {
    if (isLoading || !userData || startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    void runProfilePipeline(userData, (message) => {
      if (!cancelled) setStatusMessage(message);
    })
      .then((snapshot) => {
        if (cancelled) return;
        setStatusMessage("opening your dashboard...");
        readyToNavigateRef.current = true;
        setComputedData(snapshot);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "We couldn't complete the profile pipeline.";
        console.error("Chart compute failed:", error);
        setErrorMessage(message);
        startedRef.current = false;
      });

    return () => { cancelled = true; };
  }, [isLoading, router, setComputedData, shouldReduce, userData]);

  if (isLoading) return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;

  return (
    <motion.main
      className="flex items-center justify-center relative"
      style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeIn" }}
    >
      {/* Rotating yantra */}
        <motion.div
          className="absolute pointer-events-none"
          animate={shouldReduce ? {} : { rotate: 360 }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          style={{ willChange: "transform" }}
        >
        <motion.div
          animate={{ opacity: shouldReduce ? 0.12 : yantraOpacity }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <YantraMandala size={400} opacity={1} />
        </motion.div>
      </motion.div>

      <div
        className="relative z-10 flex flex-col items-center"
        style={{ gap: "40px", userSelect: "none" }}
      >
        {/* Wordmark */}
        <motion.p
          initial={{ opacity: 0, y: shouldReduce ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
            color: "#2C2418",
            margin: 0,
          }}
        >
          Kaal
        </motion.p>

        {/* Progress block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}
        >
          {/* Phase label — Playfair, crossfades between Chart / Interpretation / Dashboard */}
          <div style={{ height: "22px", position: "relative", width: "min(240px, 80vw)", textAlign: "center" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={errorMessage ? "error" : PHASE_LABELS[phase]}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduce ? 0 : -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "clamp(13px, 3.5vw, 15px)",
                  letterSpacing: "0.04em",
                  color: errorMessage ? "#A04040" : "#2C2418",
                }}
              >
                {errorMessage ? "Error" : PHASE_LABELS[phase]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Single track bar */}
          <div
            style={{
              width: "min(240px, 80vw)",
              height: "1px",
              backgroundColor: "rgba(122, 116, 105, 0.2)",
              position: "relative",
              borderRadius: "1px",
            }}
          >
            {/* Animated fill */}
            <motion.div
              animate={{ scaleX: progress }}
              transition={{
                duration: shouldReduce ? 0 : 1.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: errorMessage ? "#A04040" : "#B5563E",
                transformOrigin: "left center",
                borderRadius: "1px",
              }}
            />

            {/* Glow dot on leading edge */}
            {!shouldReduce && !errorMessage && (
              <motion.div
                animate={{ left: `${progress * 100}%` }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#D4714F",
                  boxShadow: "0 0 7px 2px rgba(212,113,79,0.6)",
                }}
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.0, ease: "easeInOut", repeat: Infinity }}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#D4714F" }}
                />
              </motion.div>
            )}

            {/* Third-markers — subtle tick lines */}
            {[1, 2].map((n) => (
              <div
                key={n}
                style={{
                  position: "absolute",
                  left: `${(n / 3) * 100}%`,
                  top: "-3px",
                  width: "1px",
                  height: "7px",
                  backgroundColor: "rgba(122, 116, 105, 0.25)",
                  transform: "translateX(-50%)",
                }}
              />
            ))}
          </div>

          {/* Status message */}
          <div style={{ height: "18px", position: "relative", width: "min(260px, 80vw)", textAlign: "center" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={errorMessage ?? statusMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "14px",
                  letterSpacing: "0.03em",
                  color: errorMessage ? "#A04040" : "#7A7469",
                }}
              >
                {errorMessage ?? statusMessage}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error actions */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
          >
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                startedRef.current = false;
                setTimeout(() => {
                  if (!userData) return;
                  void runProfilePipeline(userData, setStatusMessage)
                    .then((snapshot) => {
                      setStatusMessage("opening your dashboard...");
                      readyToNavigateRef.current = true;
                      setComputedData(snapshot);
                    })
                    .catch((error: unknown) => {
                      const msg = error instanceof Error ? error.message : "We couldn't complete the profile pipeline.";
                      console.error("Chart compute failed:", error);
                      setErrorMessage(msg);
                      startedRef.current = false;
                    });
                }, 100);
              }}
             style={{
               backgroundColor: "var(--accent-terracotta)",
               color: "var(--bg-cream)",
               border: "none",
               borderRadius: "2px",
               minHeight: "44px",
               padding: "0 24px",
               cursor: "pointer",
               fontFamily: "var(--font-inter-var)",
               textTransform: "uppercase",
               letterSpacing: "0.12em",
               fontSize: "11px",
             }}
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => {
                clearUserData();
                router.push("/");
              }}
              style={{
                backgroundColor: "transparent",
                color: "#A65D46",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer",
                fontFamily: "var(--font-inter-var)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                borderBottom: "1px solid #A65D46",
              }}
            >
              Reset & Edit Profile
            </button>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
