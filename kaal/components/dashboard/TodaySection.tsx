"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TodaySection() {
  const { apiData } = useUser();
  const shouldReduce = useReducedMotion();

  if (!apiData) return null;
  const { today } = apiData;
  if (!today) return null;

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
          Today
        </motion.p>
        
        {today.tara && (
          <motion.span
            variants={childAnim(0.05)}
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              color: today.tara.is_auspicious ? "#5E7A5E" : "#B5563E"
            }}
          >
            {today.tara.name} Tara
          </motion.span>
        )}
      </div>

      <motion.h2
        variants={childAnim(0.1)}
        className="mt-3"
        style={{ fontFamily: "var(--font-playfair-display)", fontSize: "clamp(1.25rem, 3vw, 1.875rem)", color: "#2C2418" }}
      >
        {today.signal}
      </motion.h2>

      {/* Focus Area block with animated left border */}
      <motion.div variants={childAnim(0.2)} className="mt-8" style={{ position: "relative", paddingLeft: "16px" }}>
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduce ? 0 : 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "2px",
            backgroundColor: "#B5563E",
            transformOrigin: "top",
          }}
        />
        <p className="uppercase tracking-[0.2em]" style={{ color: "#B5563E", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}>
          Focus Area: {today.focus_area}
        </p>
        <p className="mt-1 text-base sm:text-lg" style={{ color: "#2C2418", fontFamily: "var(--font-inter-var)" }}>
          {today.guidance}
        </p>
      </motion.div>

      {/* Caution block with animated left border */}
      {today.caution && (
      <motion.div variants={childAnim(0.3)} className="mt-6" style={{ position: "relative", paddingLeft: "16px" }}>
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduce ? 0 : 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "2px",
            backgroundColor: "#B5563E",
            transformOrigin: "top",
          }}
        />
        <p className="uppercase tracking-[0.2em]" style={{ color: "#B5563E", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}>
          Caution
        </p>
        <p className="mt-1 text-base sm:text-lg" style={{ color: "#2C2418", fontFamily: "var(--font-inter-var)" }}>
          {today.caution}
        </p>
      </motion.div>
      )}
    </motion.section>
  );
}
