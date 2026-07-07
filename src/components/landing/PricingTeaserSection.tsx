"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: EASE } },
  };
}

export default function PricingTeaserSection() {
  return (
    <section
      id="pricing"
      style={{ scrollMarginTop: "96px", maxWidth: "620px", margin: "0 auto", padding: "clamp(4rem, 10vw, 7rem) clamp(1.5rem, 5vw, 2rem)", textAlign: "center" }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={childAnim(0)}>
        <SectionLabel style={{ fontSize: "11px", marginBottom: "0.9rem", justifyContent: "center", display: "flex" }}>Access</SectionLabel>
        <h2
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 1.5rem",
          }}
        >
          three days free, then $6.99 a month.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
            fontSize: "0.98rem",
            color: "var(--olive-dark)",
            lineHeight: 1.8,
            maxWidth: "48ch",
            margin: "0 auto 1.75rem",
          }}
        >
          every profile starts with a free trial: your chart, your current phase, and a daily signal. no card required. pro adds the decision engine across career, money, relationships, and travel, with unlimited daily access.
        </p>
        <Link
          href="/pricing"
          style={{
            fontFamily: "var(--font-inter-var)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            textDecoration: "none",
            borderBottom: "1px solid rgba(122,116,105,0.3)",
            paddingBottom: "3px",
          }}
        >
          view plan details →
        </Link>
      </motion.div>
    </section>
  );
}
