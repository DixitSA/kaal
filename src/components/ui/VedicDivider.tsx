"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface VedicDividerProps {
  className?: string;
}

export default function VedicDivider({ className }: VedicDividerProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduce ? 0 : 0.6, ease: EASE }}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
      className={className}
    >
      <svg
        width="280"
        height="24"
        viewBox="0 0 280 24"
        style={{ display: "block", maxWidth: "280px", margin: "0 auto" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="fade-left-vedic" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--olive-dark)" stopOpacity="0" />
            <stop offset="20%" stopColor="var(--olive-dark)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="fade-right-vedic" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="80%" stopColor="var(--olive-dark)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--olive-dark)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Faded horizontal lines */}
        <line x1="0" y1="12" x2="110" y2="12" stroke="url(#fade-left-vedic)" strokeWidth="1" />
        <line x1="170" y1="12" x2="280" y2="12" stroke="url(#fade-right-vedic)" strokeWidth="1" />

        {/* Center geometric motif: square with inner diamond */}
        <g transform="translate(140, 12)">
          {/* Outer square rotated 45° (diamond) */}
          <rect
            x="-6"
            y="-6"
            width="12"
            height="12"
            fill="none"
            stroke="var(--olive-dark)"
            strokeWidth="1"
            transform="rotate(45)"
          />
          {/* Inner diamond */}
          <polygon
            points="0,-4 4,0 0,4 -4,0"
            fill="var(--olive-dark)"
          />
          {/* Corner dots of outer square */}
          <circle cx="-4" cy="-4" r="1" fill="var(--olive-dark)" />
          <circle cx="4" cy="-4" r="1" fill="var(--olive-dark)" />
          <circle cx="4" cy="4" r="1" fill="var(--olive-dark)" />
          <circle cx="-4" cy="4" r="1" fill="var(--olive-dark)" />
        </g>
      </svg>
    </motion.div>
  );
}