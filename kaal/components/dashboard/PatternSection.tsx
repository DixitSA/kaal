"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PatternSection() {
  const { apiData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!apiData) return null;
  const { pattern } = apiData;

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
      <div className="flex items-baseline gap-3">
        <motion.p
          variants={childAnim(0)}
          className="uppercase tracking-[0.2em]"
          style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}
        >
          Your Patterns
        </motion.p>
        <motion.span
          variants={childAnim(0.05)}
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontStyle: "italic",
            fontSize: "13px",
            color: "#7A7469"
          }}
        >
          {pattern.nakshatra} · pada {pattern.pada}
        </motion.span>
      </div>

      <motion.h2
        variants={childAnim(0.1)}
        className="mt-3"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontStyle: "italic",
          fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
          color: "#2C2418",
        }}
      >
        {pattern.headline}
      </motion.h2>

      <motion.div variants={childAnim(0.2)} className="mt-8 space-y-3">
        {(pattern.traits ?? []).map((trait, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base"
            style={{ color: "#2C2418", fontFamily: "var(--font-inter-var)" }}
          >
            {trait}
          </motion.p>
        ))}
      </motion.div>

      <motion.div variants={childAnim(0.5)} className="mt-8">
        <p className="uppercase tracking-[0.2em]" style={{ color: "#7A7469", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}>
          Shadow
        </p>
        <p
          className="mt-1 text-sm sm:text-base"
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontStyle: "italic",
            color: "#7A7469",
          }}
        >
          {pattern.shadow}
        </p>
      </motion.div>

      <motion.p
        variants={childAnim(0.6)}
        className="mt-6 uppercase tracking-[0.2em]"
        style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}
      >
        Type: {pattern.archetype.toUpperCase()}
      </motion.p>
    </motion.section>
  );
}
