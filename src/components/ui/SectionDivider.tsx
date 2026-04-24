"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionDividerProps {
  width?: number;
  opacity?: number;
  style?: React.CSSProperties;
}

export default function SectionDivider({ width = 180, opacity = 0.1, style }: SectionDividerProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className="w-full flex justify-center items-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: shouldReduce ? 0 : 0.8 }}
      style={{ marginTop: "7rem", marginBottom: "7rem", ...style }}
    >
      <svg
        width={width}
        height={width * 0.5}
        viewBox={`0 0 ${width} ${width * 0.5}`}
        style={{ opacity, maxWidth: "100%" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="fadeLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C4A96A" stopOpacity="0" />
            <stop offset="15%" stopColor="#C4A96A" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#C4A96A" stopOpacity="1" />
            <stop offset="85%" stopColor="#C4A96A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C4A96A" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <line x1={0} y1={width * 0.25} x2={width} y2={width * 0.25} stroke="url(#fadeLine)" strokeWidth="0.6" />
        
        <circle cx={width * 0.5} cy={width * 0.25} r="4" fill="none" stroke="#C4A96A" strokeWidth="0.8" />
        <circle cx={width * 0.5} cy={width * 0.25} r="2" fill="#C4A96A" />
        
        <g stroke="#C4A96A" strokeWidth="0.5" fill="none">
          <path d={`M${width * 0.5 - 12},${width * 0.25} Q${width * 0.5 - 20},${width * 0.25 - 8} ${width * 0.5 - 28},${width * 0.25 - 8}`} />
          <path d={`M${width * 0.5 + 12},${width * 0.25} Q${width * 0.5 + 20},${width * 0.25 - 8} ${width * 0.5 + 28},${width * 0.25 - 8}`} />
          <path d={`M${width * 0.5 - 12},${width * 0.25} Q${width * 0.5 - 20},${width * 0.25 + 8} ${width * 0.5 - 28},${width * 0.25 + 8}`} />
          <path d={`M${width * 0.5 + 12},${width * 0.25} Q${width * 0.5 + 20},${width * 0.25 + 8} ${width * 0.5 + 28},${width * 0.25 + 8}`} />
        </g>
        
        <g fill="#C4A96A" opacity="0.5">
          <circle cx={width * 0.15} cy={width * 0.25} r="1.5" />
          <circle cx={width * 0.85} cy={width * 0.25} r="1.5" />
        </g>
      </svg>
    </motion.div>
  );
}