"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function EarlyAccessPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg-cream)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          padding: "0 1.5rem",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Sigil with breathing pulse + slow rotation */}
        <motion.div
          initial={{ scale: 1, opacity: 0.88, rotate: 0 }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.88, 1, 0.88], rotate: 360 }}
          transition={{
            scale: { duration: 3, ease: "easeInOut", repeat: Infinity },
            opacity: { duration: 3, ease: "easeInOut", repeat: Infinity },
            rotate: { duration: 30, ease: "linear", repeat: Infinity },
          }}
          style={{ width: 96, height: 96, position: "relative" }}
        >
          <Image
            src="/yantra-sigil.svg"
            alt="Kaal sigil"
            fill
            sizes="96px"
            style={{ objectFit: "contain" }}
            priority
            unoptimized
          />
        </motion.div>

        {/* Headline */}
        <h1
           style={{
             fontFamily: "var(--font-playfair-display)",
             fontStyle: "normal",
             fontWeight: 600,
             fontSize: "clamp(1.5rem, 5vw, 2rem)",
             color: "var(--text-primary)",
             margin: 0,
             lineHeight: 1.3,
             letterSpacing: "0.02em",
           }}
        >
          vedic timing, simplified.
        </h1>

        {/* Subheadline */}
        <p
           style={{
             fontFamily: "var(--font-inter-var), sans-serif",
             fontWeight: 500,
             fontSize: "10px",
             color: "var(--text-primary)",
             margin: 0,
             letterSpacing: "0.22em",
             textTransform: "uppercase",
           }}
        >
          Request Early Access to the Relic
        </p>

        {/* Email capture form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <input
             type="email"
             id="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="your@email.com"
             disabled={status === "loading" || status === "success"}
             aria-label="Email address"
             style={{
               width: "100%",
               background: "transparent",
               border: "none",
                borderBottom: "1px solid var(--text-primary)",
                outline: "none",
                padding: "0.5rem 0",
                fontFamily: "var(--font-inter-var), sans-serif",
                fontSize: "14px",
                color: "var(--text-primary)",
               textAlign: "center",
               letterSpacing: "0.04em",
             }}
           />

          {status === "success" ? (
            <p
              style={{
                fontFamily: "var(--font-inter-var), sans-serif",
                fontSize: "11px",
                 color: "var(--accent-terracotta-text)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              you&apos;re on the list.
            </p>
          ) : (
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "none",
                border: "none",
                cursor: status === "loading" ? "wait" : "pointer",
                fontFamily: "var(--font-inter-var), sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                 color: "var(--accent-terracotta-text)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.25rem 0",
                opacity: status === "loading" ? 0.5 : 1,
                transition: "opacity 0.2s ease",
              }}
            >
              [ REQUEST ACCESS ]
            </button>
          )}

          {status === "error" && (
            <p
              style={{
                fontFamily: "var(--font-inter-var), sans-serif",
                fontSize: "10px",
                 color: "var(--accent-terracotta-text)",
                letterSpacing: "0.1em",
                margin: 0,
                opacity: 0.7,
              }}
            >
               Error joining waitlist. please try again.
            </p>
          )}
        </form>
      </main>

      {/* Fixed footer */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 0 1.25rem",
          textAlign: "center",
        }}
      >
        <p
             style={{
             fontFamily: "var(--font-inter-var), sans-serif",
             fontSize: "10px",
             color: "var(--text-primary)",
             letterSpacing: "0.1em",
             margin: 0,
             opacity: 0.45,
           }}
        >
           Kaal · © 2026
        </p>
      </footer>
    </div>
  );
}
