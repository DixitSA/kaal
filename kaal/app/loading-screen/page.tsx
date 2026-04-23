"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import YantraMandala from "@/components/svg/YantraMandala";
import { ProfileResponse } from "@/types/api";

const messages = [
  "mapping your pattern…",
  "reading your current phase…",
  "calculating today's signal…",
];

export default function LoadingScreen() {
  const router = useRouter();
  const { userData, isLoading, setApiData } = useUser();
  const shouldReduce = useReducedMotion();
  const [msgIndex, setMsgIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorStatus, setErrorStatus] = useState(0);

  const apiCallStarted = useRef(false);

  useEffect(() => {
    if (!isLoading && !userData) router.replace("/");
  }, [isLoading, userData, router]);

  // Cycle messages every 1s (no opacity state — Framer handles the pulse)
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch API data
  useEffect(() => {
    if (isLoading || !userData || apiCallStarted.current) return;
    apiCallStarted.current = true;

    const fetchProfile = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            dob: userData.dob,
            time_of_birth: userData.timeOfBirth,
            unknown_time: userData.unknownTime,
            place_of_birth: userData.placeOfBirth,
            latitude: userData.latitude || 0,
            longitude: userData.longitude || 0,
            timezone: userData.timezone || "UTC",
          })
        });

        if (!res.ok) {
          setErrorStatus(res.status);
          if (res.status === 429) {
            throw new Error("Server is busy. Please wait a moment and try again.");
          } else if (res.status === 422) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.detail || "Invalid input. Please check your details.");
          }
          throw new Error("Something went wrong. Please try again.");
        }

        const data: ProfileResponse = await res.json();
        setApiData(data);
        return true;
      } catch (err) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : "Failed to generate profile.");
        return false;
      }
    };

    const runFlow = async () => {
      const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
      const [success] = await Promise.all([fetchProfile(), minDelay]);

      if (success) {
        setExiting(true);
        setTimeout(() => router.push("/dashboard"), shouldReduce ? 0 : 350);
      }
      // On failure: do NOT auto-redirect. Show error + retry button.
    };

    runFlow();

  }, [isLoading, userData, router, shouldReduce, setApiData]);

  function handleRetry() {
    setErrorMsg("");
    setErrorStatus(0);
    apiCallStarted.current = false;
    // Force re-run by toggling a dependency — simplest: reload page
    window.location.reload();
  }

  if (isLoading) return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;

  return (
    <motion.main
      className="flex items-center justify-center relative"
      style={{ minHeight: "100dvh" }}
      animate={exiting && !shouldReduce ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeIn" }}
    >
      {/* Yantra with spin + CSS-driven opacity pulse (no React state) */}
      <motion.div
        className="absolute pointer-events-none"
        animate={shouldReduce ? {} : { rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        <motion.div
          animate={shouldReduce ? { opacity: 0.15 } : { opacity: [0.15, 0.22, 0.15] }}
          transition={shouldReduce ? {} : { duration: 2, ease: "easeInOut", repeat: Infinity }}
        >
          <YantraMandala size={400} opacity={1} />
        </motion.div>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Wordmark entrance */}
        <motion.p
          initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
            color: "#2C2418",
          }}
        >
          Kaal
        </motion.p>

        {/* Vertical carousel messages or error */}
        <div style={{ minHeight: "3em", overflow: "hidden", position: "relative", textAlign: "center", width: "280px" }}>
          {errorMsg ? (
            <div className="flex flex-col items-center gap-3">
              <p style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  color: "#B5563E",
                  lineHeight: 1.4,
                }}>{errorMsg}</p>
              <button
                onClick={handleRetry}
                className="uppercase tracking-widest cursor-pointer"
                style={{
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "11px",
                  color: "#F5F0E8",
                  backgroundColor: "#B5563E",
                  border: "none",
                  borderRadius: "2px",
                  padding: "8px 20px",
                  minHeight: "36px",
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
          <AnimatePresence mode="popLayout">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduce ? 0 : -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 2vw, 1.125rem)",
                color: "#7A7469",
                position: "absolute",
                width: "100%",
                left: 0,
              }}
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
          )}
        </div>

        {/* Progress bar with glow dot */}
        {!errorMsg && (
        <div
          style={{
            width: "200px",
            height: "2px",
            backgroundColor: "rgba(122, 116, 105, 0.2)",
            borderRadius: "1px",
            overflow: "visible",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{
              backgroundColor: "#B5563E",
              height: "100%",
              transformOrigin: "left center",
              borderRadius: "1px",
              position: "relative",
            }}
          >
            {/* Glow dot on leading edge */}
            {!shouldReduce && (
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
                style={{
                  position: "absolute",
                  right: "-3px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#D4714F",
                  boxShadow: "0 0 6px 2px rgba(212,113,79,0.7)",
                }}
              />
            )}
          </motion.div>
        </div>
        )}
      </div>
    </motion.main>
  );
}
