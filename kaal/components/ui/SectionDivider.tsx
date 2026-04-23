"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SectionDivider() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="w-full my-20" style={{ height: "1px", overflow: "hidden" }}>
      <motion.div
        style={{ height: "1px", backgroundColor: "rgba(122, 116, 105, 0.3)", transformOrigin: "center" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: shouldReduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
    </div>
  );
}
