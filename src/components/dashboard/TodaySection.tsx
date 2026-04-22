"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import InsightCard from "@/components/ui/InsightCard";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TodaySection() {
  const { computedData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!computedData) return null;

  const { daily } = computedData;

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
        className="tracking-[0.2em]"
        style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px", textTransform: "lowercase" }}
      >
        Today
      </motion.p>

      {/* Signal tone — text-2xl / text-3xl, max 25ch, no italic */}
      <motion.h2
        variants={childAnim(0.1)}
        className="mt-3"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontStyle: "normal",
          fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
          color: "#2C2418",
          lineHeight: 1.2,
          maxWidth: "25ch",
        }}
      >
        {daily.signalTone}
      </motion.h2>

      <motion.p
        variants={childAnim(0.15)}
        className="mt-4 text-base"
        style={{ color: "#7A7469", fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif", fontStyle: "normal", letterSpacing: "0.02em", textTransform: "lowercase" }}
      >
        focus area: {daily.focusArea}
      </motion.p>

      {/* Guidance — InsightCard positive (green) */}
      <motion.div variants={childAnim(0.2)} className="mt-8">
        <InsightCard
          type="positive"
          label="Guidance"
          content={daily.guidance}
          animDelay={0.3}
        />
      </motion.div>

      {/* Caution — InsightCard negative (terracotta) */}
      <motion.div variants={childAnim(0.3)} className="mt-6">
        <InsightCard
          type="negative"
          label="Caution"
          content={daily.caution}
          animDelay={0.45}
        />
      </motion.div>
    </motion.section>
  );
}
