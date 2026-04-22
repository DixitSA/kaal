"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SectionDivider() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="w-full my-16 md:my-20" style={{ height: "2px", overflow: "hidden" }}>
      <motion.div
        style={{ height: "2px", backgroundColor: "rgba(122, 116, 105, 0.05)", transformOrigin: "center" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: shouldReduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
    </div>
  );
}
