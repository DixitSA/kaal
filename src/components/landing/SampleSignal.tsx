"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import InsightCard from "@/components/ui/InsightCard";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: EASE } },
  };
}

export default function SampleSignal() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="sample"
      style={{
        scrollMarginTop: "96px",
        backgroundColor: "rgba(122,116,105,0.05)",
        borderTop: "1px solid rgba(122,116,105,0.1)",
        borderBottom: "1px solid rgba(122,116,105,0.1)",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "clamp(4rem, 10vw, 7rem) clamp(1.5rem, 5vw, 2rem)" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={childAnim(0)}
          style={{ marginBottom: "clamp(2.5rem, 6vw, 3.5rem)" }}
        >
          <SectionLabel style={{ fontSize: "11px", marginBottom: "0.9rem" }}>Sample Reading</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(1.6rem, 4.5vw, 2.25rem)",
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.25,
              margin: "0 0 1rem",
              maxWidth: "22ch",
            }}
          >
            What a day&apos;s signal actually looks like.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
              fontSize: "0.95rem",
              color: "var(--text-tagline)",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "56ch",
            }}
          >
            an illustrative day, generated the same way yours will be. your own reading is built from your exact chart.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={childAnim(shouldReduce ? 0 : 0.1)}
          style={{ marginBottom: "2.25rem" }}
        >
          <InsightCard
            type="neutral"
            label="phase · clear execution"
            content="the tenth house lord is well placed and mercury supports precise communication. this is a phase for finishing what is already moving, not starting new fronts."
            animDelay={shouldReduce ? 0 : 0.1}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={childAnim(shouldReduce ? 0 : 0.2)}
          style={{ marginBottom: "2.25rem" }}
        >
          <InsightCard
            type="positive"
            label="opportunity"
            content="ship the thing that is already ninety percent done, before you open a new front."
            animDelay={shouldReduce ? 0 : 0.2}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={childAnim(shouldReduce ? 0 : 0.3)}
        >
          <InsightCard
            type="negative"
            label="risk"
            content="scattering focus across new commitments before the current one lands."
            animDelay={shouldReduce ? 0 : 0.3}
          />
        </motion.div>
      </div>
    </section>
  );
}
