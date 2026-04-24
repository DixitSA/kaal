"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionDividerProps {
  width?: number;
  opacity?: number;
  style?: React.CSSProperties;
}

export default function SectionDivider({ width = 400, opacity = 0.45, style }: SectionDividerProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className="w-full flex justify-center items-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: shouldReduce ? 0 : 0.8 }}
      style={{ marginTop: "3rem", marginBottom: "3rem", ...style }}
    >
      <svg
        width={width}
        height={60}
        viewBox={`0 0 ${width} 60`}
        style={{ opacity, maxWidth: "100%" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mandalaFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5C574F" stopOpacity="0" />
            <stop offset="10%" stopColor="#5C574F" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#5C574F" stopOpacity="1" />
            <stop offset="90%" stopColor="#5C574F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5C574F" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g fill="none" stroke="#5C574F" strokeLinecap="round">
          <line x1={0} y1="30" x2={width} y2="30" strokeWidth="1" />
          
          <circle cx={width * 0.5} cy="30" r="14" strokeWidth="1.2" />
          <circle cx={width * 0.5} cy="30" r="10" strokeWidth="0.8" />
          <circle cx={width * 0.5} cy="30" r="5" strokeWidth="0.6" />
          <circle cx={width * 0.5} cy="30" r="2" fill="#5C574F" />

          <path d={`M${width * 0.5 - 22},30 Q${width * 0.5 - 30},15 ${width * 0.5 - 38},15`} strokeWidth="0.8" />
          <path d={`M${width * 0.5 + 22},30 Q${width * 0.5 + 30},15 ${width * 0.5 + 38},15`} strokeWidth="0.8" />
          <path d={`M${width * 0.5 - 22},30 Q${width * 0.5 - 30},45 ${width * 0.5 - 38},45`} strokeWidth="0.8" />
          <path d={`M${width * 0.5 + 22},30 Q${width * 0.5 + 30},45 ${width * 0.5 + 38},45`} strokeWidth="0.8" />

          <circle cx={width * 0.5 - 30} cy="15" r="2.5" fill="#5C574F" stroke="none" />
          <circle cx={width * 0.5 + 30} cy="15" r="2.5" fill="#5C574F" stroke="none" />
          <circle cx={width * 0.5 - 30} cy="45" r="2.5" fill="#5C574F" stroke="none" />
          <circle cx={width * 0.5 + 30} cy="45" r="2.5" fill="#5C574F" stroke="none" />
        </g>

        <g fill="#5C574F">
          <circle cx={width * 0.12} cy="30" r="2" />
          <circle cx={width * 0.24} cy="30" r="1.5" />
          <circle cx={width * 0.76} cy="30" r="1.5" />
          <circle cx={width * 0.88} cy="30" r="2" />
        </g>

        <line x1={width * 0.32} y1="30" x2={width * 0.42} y2="30" stroke="#5C574F" strokeWidth="0.6" strokeDasharray="2 3" />
        <line x1={width * 0.58} y1="30" x2={width * 0.68} y2="30" stroke="#5C574F" strokeWidth="0.6" strokeDasharray="2 3" />
      </svg>
    </motion.div>
  );
}