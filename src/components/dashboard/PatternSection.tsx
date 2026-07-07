"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { toPng } from "html-to-image";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const GANA_LABEL: Record<string, string> = {
  catalyst: "Rakshasa",
  steward:  "Manushya",
  seeker:   "Deva",
};

const PADA_ROMAN = ["", "I", "II", "III", "IV"] as const;

// ─── SVG Primitives ──────────────────────────────────────────────────────────

function CottonTexture({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85 0.65" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} opacity="0.02" />
    </svg>
  );
}

function CornerGlyph({ style }: { style: React.CSSProperties }) {
  const s = 28;
  return (
    <svg
      width={s} height={s} viewBox={`0 0 ${s} ${s}`}
      aria-hidden="true"
      style={{ position: "absolute", pointerEvents: "none", ...style }}
    >
      <path d={`M${s - 2} 2 A${s - 4} ${s - 4} 0 0 0 2 ${s - 2}`}
        fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.55" strokeLinecap="round" opacity="0.55" />
      <path d={`M${s - 9} 2 A${s - 11} ${s - 11} 0 0 0 2 ${s - 9}`}
        fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.45" strokeLinecap="round" opacity="0.45" />
      <path d={`M${s - 17} 2 A${s - 19} ${s - 19} 0 0 0 2 ${s - 17}`}
        fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.38" strokeLinecap="round" opacity="0.35" />
      <circle cx="3.5" cy="3.5" r="1.3" fill="var(--accent-burgundy)" opacity="0.5" />
      <circle cx={s / 2 - 1} cy="2.2" r="0.75" fill="var(--accent-burgundy)" opacity="0.32" />
      <circle cx="2.2" cy={s / 2 - 1} r="0.75" fill="var(--accent-burgundy)" opacity="0.32" />
    </svg>
  );
}

function JaaliStrip({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="none" stroke="var(--text-primary)" strokeWidth="0.4" />
          <circle cx="5" cy="5" r="0.6" fill="var(--text-primary)" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function SealGlyph() {
  const cx = 30, cy = 30, r = 22, inner = 13, petals = 8;
  return (
    <svg width={60} height={60} viewBox="0 0 60 60" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.45" />
      <circle cx={cx} cy={cy} r={inner} fill="none" stroke="var(--text-secondary)" strokeWidth="0.4" opacity="0.38" />
      {Array.from({ length: petals }, (_, i) => {
        const a = (i * Math.PI * 2) / petals;
        const a2 = a + Math.PI / petals;
        const pr = r * 0.82;
        return (
          <path key={i}
            d={`M ${cx} ${cy} Q ${cx + pr * Math.cos(a)} ${cy + pr * Math.sin(a)} ${cx + pr * Math.cos(a2)} ${cy + pr * Math.sin(a2)}`}
            fill="none" stroke="var(--text-secondary)" strokeWidth="0.5" opacity="0.38"
          />
        );
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI * 2) / 8 + Math.PI / 8;
        return <circle key={i} cx={cx + inner * Math.cos(a)} cy={cy + inner * Math.sin(a)} r="1" fill="var(--text-secondary)" opacity="0.28" />;
      })}
      <circle cx={cx} cy={cy} r="2.5" fill="var(--text-secondary)" opacity="0.18" />
    </svg>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

// FACE_BASE must NOT have overflow:hidden or any property that forces flat 2D
// compositing — Chrome will promote such elements to a 2D GPU layer and
// backface-visibility:hidden stops working.  Visual clipping lives on FACE_CLIP.
const FACE_BASE: React.CSSProperties = {
  gridArea: "1 / 1",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
};

// Inner wrapper handles all visual chrome without touching the compositing layer.
const FACE_CLIP: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "clip",
  boxSizing: "border-box",
};

const MARGINALIA: React.CSSProperties = {
  fontFamily: "var(--font-inter-var)",
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.26em",
  color: "var(--text-secondary)",
  opacity: 0.2,
  whiteSpace: "nowrap",
};

const CORNERS = [
  { top: 2,    left:  2,   transform: "none" },
  { top: 2,    right: 2,   transform: "scaleX(-1)" },
  { bottom: 2, left:  2,   transform: "scaleY(-1)" },
  { bottom: 2, right: 2,   transform: "scale(-1,-1)" },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function PatternSection() {
  const { computedData } = useUser();
  const shouldReduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleCopyLink() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleShareImage() {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "var(--bg-cream)",
        pixelRatio: window.devicePixelRatio || 2,
        cacheBust: true,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "kaal-pattern.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Kaal Pattern",
          files: [file],
        });
      } else {
        // Fallback: anchor download for desktop
        const link = document.createElement("a");
        link.download = "kaal-pattern.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (err: unknown) {
      // AbortError = user dismissed the share sheet — not a real error
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to share image:", err);
      }
    } finally {
      setSharing(false);
    }
  }

  if (!computedData) return null;

  const { identity, chart } = computedData;
  if (!identity || !chart) return null;
  const archetypeKey = identity.archetype.toLowerCase();
  const ganaName  = GANA_LABEL[archetypeKey] ?? identity.archetype;
  const nakshatra = chart.moonNakshatra;
  const pada      = chart.moonNakshatraPada;
  const padaRoman = PADA_ROMAN[pada] ?? String(pada);
  const traits    = [identity.emotionalLine, identity.decisionLine, identity.patternLine];

  const childAnim = (delay: number) => ({
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  });

  const toggle = () => setFlipped((f) => !f);

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
      <h2 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>Card</h2>

      {/* Flip card — full container width, landscape */}
      <motion.div variants={childAnim(0)}>
        {/*
          Outer wrapper: carries perspective + shadow hover.
          MUST be a plain <div> — no Framer Motion between perspective and face divs
          or preserve-3d chain breaks and backfaceVisibility:hidden stops working.
        */}
        <div
          ref={cardRef}
          onMouseEnter={() => { if (!shouldReduce) setHovered(true); }}
          onMouseLeave={() => { if (!shouldReduce) setHovered(false); }}
          onTouchStart={() => { if (!shouldReduce) setHovered(true); }}
          onTouchEnd={() => { if (!shouldReduce) setHovered(false); }}
          style={{
            perspective: "1400px",
            borderRadius: "4px",
            backgroundColor: "transparent",
            boxShadow: hovered
              ? "0 20px 60px rgba(44, 36, 24, 0.13), 0 4px 16px rgba(44, 36, 24, 0.07)"
              : "0 8px 40px rgba(44, 36, 24, 0.08), 0 2px 10px rgba(44, 36, 24, 0.04)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Flip container — landscape card */}
          <div
            role="button"
            aria-label={flipped ? "Flip to gana" : "Flip to pattern insights"}
            tabIndex={0}
            onClick={toggle}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(); }}
            style={{
              position: "relative",
              display: "grid",
              width: "100%",
              minHeight: "clamp(320px, 55vw, 380px)",
              WebkitTransformStyle: "preserve-3d",
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: shouldReduce ? "none" : "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              userSelect: "none",
              borderRadius: "3px",
              touchAction: "manipulation",
            }}
          >

            {/* ════════════════ FRONT ════════════════ */}
            <div style={{ ...FACE_BASE, transform: "rotateY(0deg)" }}>
              <div style={{
                ...FACE_CLIP,
                background: "radial-gradient(ellipse at 50% 45%, #FDFBF3 0%, #F5F0E8 75%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(44,36,24,0.15)",
                borderRadius: "3px",
              }}>
                <CottonTexture id="cotton-front" />
                {CORNERS.map((c, i) => <CornerGlyph key={i} style={c} />)}

                <div style={{ position: "absolute", top: 0, left: 0, width: "36px", bottom: 0, opacity: 0.05, pointerEvents: "none" }}>
                  <JaaliStrip id="jaali-fl" />
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, width: "36px", bottom: 0, opacity: 0.05, pointerEvents: "none" }}>
                  <JaaliStrip id="jaali-fr" />
                </div>

                {/* Dog-ear fold — top-right parchment curl */}
                <div aria-hidden="true" style={{
                  position: "absolute", top: 0, right: 0,
                  width: "22px", height: "22px",
                  background: "linear-gradient(225deg, rgba(44,36,24,0.14) 50%, transparent 50%)",
                  borderRadius: "0 3px 0 0",
                  zIndex: 3, pointerEvents: "none",
                }} />

                {/* Reveal hint — floats at bottom, brightens on hover */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={shouldReduce ? undefined : { y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", bottom: "16px", left: 0, right: 0,
                    textAlign: "center", zIndex: 2, pointerEvents: "none",
                    opacity: hovered ? 0.6 : 0.28,
                    transition: "opacity 0.35s ease",
                    fontFamily: "var(--font-inter-var)",
                    fontSize: "10px",
                    textTransform: "lowercase",
                    letterSpacing: "0.2em",
                    color: "var(--text-primary)",
                  }}
                >
                  ✧ reveal insight
                </motion.div>

                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <SealGlyph />
                  <span style={{
                    fontFamily: "var(--font-playfair-display), Georgia, serif",
                    fontSize: "clamp(1rem, 2.8vw, 1.75rem)",
                    letterSpacing: "0.5em",
                    color: "var(--text-secondary)",
                    opacity: 0.52,
                  }}>
                    {ganaName.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* ════════════════ BACK ════════════════ */}
            <div style={{ ...FACE_BASE, transform: "rotateY(180deg)" }}>
              <div style={{
                ...FACE_CLIP,
                background: "radial-gradient(ellipse at 50% 30%, #FDFBF3 0%, #F5F0E8 80%)",
                display: "flex", flexDirection: "column",
                border: "1px solid rgba(44,36,24,0.15)",
                borderRadius: "3px",
              }}>
                <CottonTexture id="cotton-back" />
                {CORNERS.map((c, i) => <CornerGlyph key={i} style={c} />)}

                {/* Top Section: Rigid 3-Column Layout */}
                <div style={{ flex: 1, display: "flex", width: "100%", minHeight: 0, position: "relative", zIndex: 1 }}>

                  {/* Left Sidebar (Vedic Blueprint) */}
                  <div style={{ width: "48px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }}>
                      <JaaliStrip id="jaali-bl" />
                    </div>
                    <span style={{ ...MARGINALIA, writingMode: "vertical-rl", transform: "rotate(180deg)", position: "relative", whiteSpace: "nowrap" }}>
                      Vedic Blueprint
                    </span>
                  </div>

                  {/* Center Lane (Main Content) */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingTop: "clamp(2rem, 6vw, 3rem)", paddingBottom: "2.5rem", overflow: "hidden" }}>
                    {/* Content Protection Wrapper (px-6) */}
                    <div style={{ width: "100%", padding: "0 1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <p style={{ fontFamily: "var(--font-inter-var)", fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--accent-gold-text)", margin: 0, opacity: 0.8, fontWeight: 300 }}>
                        your patterns
                      </p>
                      <p style={{ fontFamily: "var(--font-playfair-display), Georgia, serif", fontStyle: "italic", fontSize: "clamp(0.65rem, 1.3vw, 0.75rem)", color: "var(--text-secondary)", margin: "6px 0 0", opacity: 0.6, letterSpacing: "0.06em", fontWeight: 300 }}>
                        {nakshatra} · pada {padaRoman}
                      </p>
                      <p style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(0.9rem, 2vw, 1.25rem)", color: "var(--text-primary)", lineHeight: 1.25, margin: "clamp(0.75rem, 2vw, 1.5rem) 0", maxWidth: "26ch" }}>
                        {identity.core}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        {traits.map((trait, i) => (
                          <p key={i} style={{ fontFamily: "var(--font-playfair-display), Georgia, serif", fontSize: "clamp(0.78rem, 1.5vw, 0.95rem)", lineHeight: 1.45, letterSpacing: "0.02em", color: "var(--text-primary)", margin: 0, opacity: 0.84, fontWeight: 300 }}>
                            {trait.toLowerCase()}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar (Gana) */}
                  <div style={{ width: "48px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }}>
                      <JaaliStrip id="jaali-br" />
                    </div>
                    <span style={{ ...MARGINALIA, writingMode: "vertical-rl", position: "relative", whiteSpace: "nowrap" }}>
                      Gana
                    </span>
                  </div>
                </div>

                {/* Divider Line */}
                <div style={{
                  height: "1px",
                  backgroundColor: "rgba(44,36,24,0.15)",
                  width: "100%",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                }} />

                {/* Shadow Section (Standalone Block) */}
                <div style={{
                  flexShrink: 0,
                  width: "100%",
                  background: "linear-gradient(to bottom, rgba(44,36,24,0.055), rgba(44,36,24,0.09))",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  textAlign: "center", padding: "2.5rem 1.5rem", gap: "6px",
                  position: "relative", zIndex: 1,
                  boxSizing: "border-box",
                }}>
                  <span style={{ fontFamily: "var(--font-inter-var), sans-serif", fontStyle: "italic", fontWeight: 300, fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--accent-terracotta-shadow)", opacity: 0.85, textTransform: "lowercase" }}>
                    shadow
                  </span>
                  <p style={{ fontFamily: "var(--font-playfair-display), Georgia, serif", fontStyle: "italic", fontSize: "clamp(0.7rem, 1.4vw, 0.82rem)", lineHeight: 1.5, letterSpacing: "0.02em", color: "var(--text-primary)", opacity: 0.6, margin: 0, maxWidth: "30ch", fontWeight: 300 }}>
                    {identity.challengeLine}
                  </p>
                </div>

                {/* Return hint */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={shouldReduce ? undefined : { y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", bottom: "8px", left: 0, right: 0,
                    textAlign: "center", zIndex: 3, pointerEvents: "none",
                    opacity: hovered ? 0.6 : 0.28,
                    transition: "opacity 0.35s ease",
                    fontFamily: "var(--font-inter-var)",
                    fontSize: "10px",
                    textTransform: "lowercase",
                    letterSpacing: "0.2em",
                    color: "var(--text-primary)",
                  }}
                >
                  ✧ return
                </motion.div>
              </div>
            </div>

          </div>{/* end flip */}
        </div>{/* end outer */}
      </motion.div>{/* end portrait wrapper */}
      
      {/* Share buttons */}
      <motion.div variants={childAnim(0.5)} style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
        <button
          onClick={handleCopyLink}
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--font-playfair-display)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: 0.6,
            cursor: "pointer",
            transition: "opacity 0.2s ease",
            padding: "8px 16px",
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
          onMouseOut={(e) => e.currentTarget.style.opacity = "0.6"}
          onFocus={(e) => e.currentTarget.style.opacity = "1"}
          onBlur={(e) => e.currentTarget.style.opacity = "0.6"}
        >
          {copied ? "Link Copied" : "Copy Link"}
        </button>
        <button
          onClick={handleShareImage}
          disabled={sharing}
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--font-playfair-display)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: sharing ? 0.4 : 0.6,
            cursor: sharing ? "default" : "pointer",
            transition: "opacity 0.2s ease",
            padding: "8px 16px",
          }}
          onMouseOver={(e) => { if (!sharing) e.currentTarget.style.opacity = "1"; }}
          onMouseOut={(e) => { if (!sharing) e.currentTarget.style.opacity = "0.6"; }}
          onFocus={(e) => { if (!sharing) e.currentTarget.style.opacity = "1"; }}
          onBlur={(e) => { if (!sharing) e.currentTarget.style.opacity = "0.6"; }}
        >
          {sharing ? "Generating…" : "Share Pattern"}
        </button>
      </motion.div>
    </motion.section>
  );
}
