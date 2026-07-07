"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FAQS = [
  {
    q: "is this real vedic astrology, or made up?",
    a: "it's the real system. kaal uses the lahiri ayanamsa, the standard adopted by the indian government for its national ephemeris, and scores each day against the panchang: tithi, vara, nakshatra, yoga, and karana. see the full methodology for the calculations.",
  },
  {
    q: "what if i don't know my exact birth time?",
    a: "toggle \"i don't know\" in the form. your chart still generates using midday as a reference point. most of your reading holds; house-dependent precision (like exact timing windows) will be softer.",
  },
  {
    q: "how is this different from a daily horoscope app?",
    a: "horoscope apps use your sun sign and the tropical zodiac: twelve generic buckets. kaal builds your full sidereal birth chart from your exact time and place, then reads the current sky against that specific chart.",
  },
  {
    q: "can i cancel anytime?",
    a: "yes. billing is self-serve through the account portal. cancel whenever you want, no call or email required.",
  },
  {
    q: "is my birth data private?",
    a: "your birth details are used only to compute your chart. read the privacy policy for exactly what's stored and why.",
  },
] as const;

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  };
}

export default function FaqSection() {
  const shouldReduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ scrollMarginTop: "96px", maxWidth: "700px", margin: "0 auto", padding: "clamp(4rem, 10vw, 7rem) clamp(1.5rem, 5vw, 2rem)" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={childAnim(0)}
        style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}
      >
        <SectionLabel style={{ fontSize: "11px", marginBottom: "0.9rem" }}>Questions</SectionLabel>
        <h2
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(1.6rem, 4.5vw, 2.25rem)",
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          Before you begin.
        </h2>
      </motion.div>

      <div>
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={item.q}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={childAnim(shouldReduce ? 0 : i * 0.05)}
              style={{ borderTop: i === 0 ? "1px solid rgba(122,116,105,0.14)" : undefined, borderBottom: "1px solid rgba(122,116,105,0.14)" }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "1.25rem 0",
                  minHeight: "44px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-playfair-display)",
                    fontSize: "1.05rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    fontSize: "1.1rem",
                    color: "var(--accent-terracotta)",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: shouldReduce ? "none" : "grid-template-rows 0.3s ease",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
                      fontSize: "0.95rem",
                      color: "var(--olive-dark)",
                      lineHeight: 1.75,
                      margin: "0 0 1.5rem",
                      maxWidth: "58ch",
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
