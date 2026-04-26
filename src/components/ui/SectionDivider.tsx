"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionDividerProps {
  opacity?: number;
  style?: React.CSSProperties;
}

export default function SectionDivider({ opacity = 1, style }: SectionDividerProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: shouldReduce ? 0 : 0.8 }}
      style={{ marginTop: "3rem", marginBottom: "3rem", ...style }}
    >
      <svg
        width="300"
        height="20"
        viewBox="0 0 300 20"
        style={{ display: "block", maxWidth: "300px", margin: "0 auto", opacity }}
        aria-hidden="true"
      >
        <line x1="0" y1="10" x2="120" y2="10" stroke="#7A7469" strokeWidth="0.75" />
        <polygon points="130,3 137,10 130,17 123,10" fill="#7A7469" />
        <line x1="180" y1="10" x2="300" y2="10" stroke="#7A7469" strokeWidth="0.75" />
        <circle cx="110" cy="10" r="1.5" fill="#7A7469" />
        <circle cx="190" cy="10" r="1.5" fill="#7A7469" />
      </svg>
    </motion.div>
  );
}