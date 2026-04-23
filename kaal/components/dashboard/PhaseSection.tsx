"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PhaseSection() {
  const { apiData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!apiData) return null;

  const { phase, intensity, user } = apiData;

  const words = phase.name.split(" ");

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.08 } },
  };

  const wordAnim = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  const childAnim = (delay: number) => ({
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  });

  // Query Date formatting
  const dateStr = user.query_date || new Date().toISOString().split("T")[0];
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).toLowerCase();

  // Intensity dots mapping
  const dots = [];
  const level = intensity.level;
  if (level === "low") dots.push(true, false, false);
  else if (level === "medium") dots.push(true, true, false);
  else dots.push(true, true, true);

  const dotColor = level === "low" ? "#9C9488" : level === "medium" ? "#A0884D" : "#B5563E";
  const isCritical = level === "critical";

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={childAnim(0)} className="mb-6">
        <span style={{ fontFamily: "var(--font-inter-var)", fontSize: "0.75rem", color: "#7A7469" }}>
          {formattedDate}
        </span>
      </motion.div>

      <div className="flex justify-between items-baseline">
        <motion.p
          variants={childAnim(0.1)}
          className="uppercase tracking-[0.2em]"
          style={{ color: "#8A7240", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}
        >
          Current Phase
        </motion.p>
        
        <motion.div variants={childAnim(0.1)} className="flex items-center gap-1" title={`${level} intensity`}>
          {dots.map((filled, i) => (
            <motion.div
              key={i}
              animate={isCritical && filled ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: filled ? dotColor : "transparent",
                border: `1px solid ${filled ? dotColor : "#9C9488"}`
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Phase name: word-by-word reveal */}
      <motion.h2
        variants={container}
        className="mt-3 font-bold"
        style={{
          fontFamily: "var(--font-playfair-display)",
          fontSize: "clamp(1.75rem, 4vw, 3rem)",
          color: "#2C2418",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25em",
        }}
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordAnim} style={{ display: "inline-block" }}>
            {word}
          </motion.span>
        ))}
      </motion.h2>

      {/* Phase Tags */}
      {phase.tags && phase.tags.length > 0 && (
        <motion.div variants={childAnim(0.15)} className="mt-4 flex flex-wrap gap-x-2 gap-y-1">
          {phase.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-sm border"
              style={{
                borderColor: "rgba(156, 148, 136, 0.3)",
                color: "#9C9488",
                fontFamily: "var(--font-inter-var)",
                fontSize: "0.75rem"
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}

      <motion.p
        variants={childAnim(0.2)}
        className="mt-4 text-lg"
        style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", color: "#7A7469" }}
      >
        {phase.summary}
      </motion.p>

      <motion.div variants={childAnim(0.3)} className="mt-8">
        <p className="uppercase tracking-[0.2em]" style={{ color: "#B5563E", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}>
          Opportunity
        </p>
        <p className="mt-1 text-base sm:text-lg" style={{ color: "#2C2418", fontFamily: "var(--font-inter-var)" }}>
          {phase.opportunity}
        </p>
      </motion.div>

      <motion.div variants={childAnim(0.4)} className="mt-4">
        <p className="uppercase tracking-[0.2em]" style={{ color: "#B5563E", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}>
          Risk
        </p>
        <p className="mt-1 text-base sm:text-lg" style={{ color: "#2C2418", fontFamily: "var(--font-inter-var)" }}>
          {phase.risk}
        </p>
      </motion.div>
    </motion.section>
  );
}
