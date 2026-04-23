"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";

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
        fill="none" stroke="#A34851" strokeWidth="0.55" strokeLinecap="round" opacity="0.55" />
      <path d={`M${s - 9} 2 A${s - 11} ${s - 11} 0 0 0 2 ${s - 9}`}
        fill="none" stroke="#A34851" strokeWidth="0.45" strokeLinecap="round" opacity="0.45" />
      <path d={`M${s - 17} 2 A${s - 19} ${s - 19} 0 0 0 2 ${s - 17}`}
        fill="none" stroke="#A34851" strokeWidth="0.38" strokeLinecap="round" opacity="0.35" />
      <circle cx="3.5" cy="3.5" r="1.3" fill="#A34851" opacity="0.5" />
      <circle cx={s / 2 - 1} cy="2.2" r="0.75" fill="#A34851" opacity="0.32" />
      <circle cx="2.2" cy={s / 2 - 1} r="0.75" fill="#A34851" opacity="0.32" />
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
          <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="none" stroke="#2C2418" strokeWidth="0.4" />
          <circle cx="5" cy="5" r="0.6" fill="#2C2418" opacity="0.5" />
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
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7A7469" strokeWidth="0.5" opacity="0.45" />
      <circle cx={cx} cy={cy} r={inner} fill="none" stroke="#7A7469" strokeWidth="0.4" opacity="0.38" />
      {Array.from({ length: petals }, (_, i) => {
        const a = (i * Math.PI * 2) / petals;
        const a2 = a + Math.PI / petals;
        const pr = r * 0.82;
        return (
          <path key={i}
            d={`M ${cx} ${cy} Q ${cx + pr * Math.cos(a)} ${cy + pr * Math.sin(a)} ${cx + pr * Math.cos(a2)} ${cy + pr * Math.sin(a2)}`}
            fill="none" stroke="#7A7469" strokeWidth="0.5" opacity="0.38"
          />
        );
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI * 2) / 8 + Math.PI / 8;
        return <circle key={i} cx={cx + inner * Math.cos(a)} cy={cy + inner * Math.sin(a)} r="1" fill="#7A7469" opacity="0.28" />;
      })}
      <circle cx={cx} cy={cy} r="2.5" fill="#7A7469" opacity="0.18" />
    </svg>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

// FACE_BASE must NOT have overflow:hidden or any property that forces flat 2D
// compositing — Chrome will promote such elements to a 2D GPU layer and
// backface-visibility:hidden stops working.  Visual clipping lives on FACE_CLIP.
const FACE_BASE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
};

// Inner wrapper handles all visual chrome without touching the compositing layer.
const FACE_CLIP: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  border: "1px solid rgba(122, 116, 105, 0.18)",
  borderRadius: "3px",
};

const INNER_FRAME: React.CSSProperties = {
  position: "absolute",
  inset: "10px",
  border: "1px solid rgba(163, 72, 81, 0.28)",
  borderRadius: "2px",
  pointerEvents: "none",
  zIndex: 0,
};

const MARGINALIA: React.CSSProperties = {
  fontFamily: "var(--font-inter-var)",
  fontSize: "0.6rem",
  textTransform: "uppercase",
  letterSpacing: "0.26em",
  color: "#7A7469",
  opacity: 0.2,
  whiteSpace: "nowrap",
};

const CORNERS = [
  { top: 6,    left:  6,   transform: "none" },
  { top: 6,    right: 6,   transform: "scaleX(-1)" },
  { bottom: 6, left:  6,   transform: "scaleY(-1)" },
  { bottom: 6, right: 6,   transform: "scale(-1,-1)" },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function PatternSection() {
  const { computedData } = useUser();
  const shouldReduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!computedData) return null;

  const { identity, chart } = computedData;
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
      <motion.div variants={childAnim(0)}>

        {/*
          Outer wrapper: carries perspective + cream fill (no white flash at 90°) +
          shadow hover via JS state + CSS transition.
          MUST be a plain <div> — no Framer Motion here. Any motion.div between
          perspective and the face divs will corrupt the preserve-3d chain and
          break backface-visibility:hidden, causing bleed-through.
        */}
        <div
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
          {/* Flip container — plain div + CSS transition only */}
          <div
            role="button"
            aria-label={flipped ? "Flip to gana" : "Flip to pattern insights"}
            tabIndex={0}
            onClick={toggle}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(); }}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: undefined,
              maxHeight: "clamp(200px, 45vw, 360px)",
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
            {/*
              Outer shell: ONLY backfaceVisibility + explicit rotateY(0deg).
              No overflow, no border, no background — those force flat 2D GPU
              compositing and break backfaceVisibility:hidden in Chrome.
            */}
            <div style={{ ...FACE_BASE, transform: "rotateY(0deg)" }}>
              {/* Inner clip: safe to have overflow+border here, not in the 3D shell */}
              <div style={{
                ...FACE_CLIP,
                background: "radial-gradient(ellipse at 50% 45%, #FDFBF3 0%, #F5F0E8 75%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CottonTexture id="cotton-front" />
                <div style={INNER_FRAME} />
                {CORNERS.map((c, i) => <CornerGlyph key={i} style={c} />)}

                <div style={{ position: "absolute", top: 0, left: 0, width: "36px", bottom: 0, opacity: 0.05, pointerEvents: "none" }}>
                  <JaaliStrip id="jaali-fl" />
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, width: "36px", bottom: 0, opacity: 0.05, pointerEvents: "none" }}>
                  <JaaliStrip id="jaali-fr" />
                </div>

                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <SealGlyph />
                  <span style={{
                    fontFamily: "var(--font-playfair-display), Georgia, serif",
                    fontSize: "clamp(1rem, 2.8vw, 1.75rem)",
                    letterSpacing: "0.5em",
                    color: "#7A7469",
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
              }}>
                <CottonTexture id="cotton-back" />
                <div style={INNER_FRAME} />
                {CORNERS.map((c, i) => <CornerGlyph key={i} style={c} />)}

                {/* Main area */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(24px, 36px) 1fr minmax(24px, 36px)", minHeight: 0, position: "relative", zIndex: 1 }}>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }}>
                      <JaaliStrip id="jaali-bl" />
                    </div>
                    <span style={{ ...MARGINALIA, writingMode: "vertical-lr", transform: "rotate(180deg)", position: "relative" }}>
                      Vedic Blueprint
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(12px, 3vw, 28px) clamp(4px, 2vw, 8px) clamp(8px, 2vw, 16px)" }}>
                    <p style={{ fontFamily: "var(--font-inter-var)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.26em", color: "#8A7240", margin: 0, opacity: 0.8 }}>
                      your patterns
                    </p>
                    <p style={{ fontFamily: "var(--font-playfair-display), Georgia, serif", fontStyle: "italic", fontSize: "clamp(0.7rem, 1.5vw, 0.82rem)", color: "#7A7469", margin: "5px 0 0", opacity: 0.6, letterSpacing: "0.04em" }}>
                      {nakshatra} · pada {padaRoman}
                    </p>
                    <p style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.05rem, 2.4vw, 1.55rem)", color: "#2C2418", lineHeight: 1.25, margin: "10px 0 1.8rem", maxWidth: "22ch" }}>
                      {identity.core}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {traits.map((trait, i) => (
                        <p key={i} style={{ fontFamily: "var(--font-playfair-display), Georgia, serif", fontSize: "clamp(0.82rem, 1.7vw, 1rem)", lineHeight: 1.8, letterSpacing: "0.02em", color: "#2C2418", margin: 0, opacity: 0.84 }}>
                          {trait.toLowerCase()}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }}>
                      <JaaliStrip id="jaali-br" />
                    </div>
                    <span style={{ ...MARGINALIA, writingMode: "vertical-lr", position: "relative" }}>
                      Gana
                    </span>
                  </div>
                </div>

                {/* Shadow zone */}
                <div style={{
                  height: "25%",
                  background: "linear-gradient(to bottom, rgba(44,36,24,0.055), rgba(44,36,24,0.09))",
                  borderTop: "1px solid rgba(163, 72, 81, 0.35)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  textAlign: "center", padding: "0 52px", gap: "4px",
                  position: "relative", zIndex: 1,
                }}>
                  <span style={{ fontFamily: "var(--font-inter-var), sans-serif", fontStyle: "italic", fontWeight: 300, fontSize: "0.95rem", letterSpacing: "0.12em", color: "#7A2010", opacity: 0.85, textTransform: "lowercase" }}>
                    shadow
                  </span>
                  <p style={{ fontFamily: "var(--font-playfair-display), Georgia, serif", fontStyle: "italic", fontSize: "clamp(0.78rem, 1.5vw, 0.95rem)", lineHeight: 1.5, letterSpacing: "0.02em", color: "#2C2418", opacity: 0.6, margin: 0, maxWidth: "40ch" }}>
                    {identity.challengeLine}
                  </p>
                </div>
              </div>
            </div>

          </div>{/* end flip */}
        </div>{/* end outer */}
      </motion.div>
    </motion.section>
  );
}
