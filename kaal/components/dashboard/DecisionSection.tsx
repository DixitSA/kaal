"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { DecisionCategory } from "@/types/api";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const categories: DecisionCategory[] = [
  "career", "relationships", "money", "travel", "move", "communication",
];

const actionColors: Record<string, string> = {
  WAIT: "#B5563E",
  ACT: "#5E7A5E",
  AVOID: "#A04040",
};

export default function DecisionSection() {
  const { apiData } = useUser();
  const [active, setActive] = useState<DecisionCategory>("career");
  const shouldReduce = useReducedMotion();

  // Animated underline position
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = btnRefs.current[active];
    const container = containerRef.current;
    if (!btn || !container) return;
    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setUnderline({ left: btnRect.left - containerRect.left, width: btnRect.width });
  }, [active]);

  if (!apiData) return null;
  const result = apiData.decisions[active];

  const childAnim = (delay: number) => ({
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  });

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.p
        variants={childAnim(0)}
        className="uppercase tracking-[0.2em] mb-8"
        style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}
      >
        Decision
      </motion.p>

      <div className="relative w-full h-px bg-[#9C9488] opacity-30 mb-6" />

      <motion.div
        variants={childAnim(0.1)}
        ref={containerRef}
        className="flex flex-wrap justify-center gap-x-8 mt-6"
        role="group"
        aria-label="Decision categories"
        style={{ position: "relative" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            ref={(el) => { btnRefs.current[cat] = el; }}
            onClick={() => setActive(cat)}
            className="capitalize transition-colors"
            aria-pressed={active === cat}
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "0.875rem",
              color: active === cat ? "#4A4F46" : "#7A7469",
              background: "none",
              border: "none",
              padding: "10px 4px",
              minHeight: "44px",
              minWidth: "44px",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
          >
            {cat}
          </button>
        ))}

        {/* Sliding underline */}
        {!shouldReduce && underline.width > 0 && (
          <motion.div
            animate={{ left: underline.left + (underline.width / 2) - 16, width: 32 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "8px",
              height: "2px",
              backgroundColor: "#B5563E",
              borderRadius: "1px",
            }}
          />
        )}
      </motion.div>

      {/* Result with enter/exit animation */}
      <div className="mt-10 text-center" aria-live="polite" aria-atomic="true" style={{ minHeight: "160px", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: shouldReduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <motion.p
              className="font-bold"
              initial={{ scale: shouldReduce ? 1 : 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                color: actionColors[result.action],
                lineHeight: 1,
              }}
            >
              {result.action}
            </motion.p>
            <p className="mt-4 text-base sm:text-lg" style={{ color: "#7A7469", fontFamily: "var(--font-inter-var)" }}>
              {result.reason}
            </p>
            <p className="mt-1 text-sm sm:text-base" style={{ color: "#9C9488", fontFamily: "var(--font-inter-var)" }}>
              risk: {result.risk}
            </p>

            {result.shadow_caveat && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-6 pl-4 mx-auto text-left max-w-sm"
                style={{ borderLeft: "2px solid rgba(156, 148, 136, 0.4)" }}
              >
                <p style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: "0.875rem", color: "#9C9488" }}>
                  {result.shadow_caveat}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
