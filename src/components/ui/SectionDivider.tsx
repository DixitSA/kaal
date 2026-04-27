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
        width="200"
        height="12"
        viewBox="0 0 200 12"
        style={{ display: "block", maxWidth: "200px", margin: "0 auto", opacity: opacity * 0.7 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="fade-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7A7469" stopOpacity="0" />
            <stop offset="15%" stopColor="#7A7469" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="fade-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="85%" stopColor="#7A7469" stopOpacity="1" />
            <stop offset="100%" stopColor="#7A7469" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="6" x2="90" y2="6" stroke="url(#fade-left)" strokeWidth="1" />
        <polygon points="100,3 105,6 100,9" fill="#7A7469" />
        <line x1="110" y1="6" x2="200" y2="6" stroke="url(#fade-right)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}