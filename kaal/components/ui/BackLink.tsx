"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BackLinkProps {
  label?: string;
}

export default function BackLink({ label = "Back" }: BackLinkProps) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.back()}
      className="flex items-center gap-2 py-4 px-6 -ml-6"
      style={{
        fontFamily: "var(--font-inter-var)",
        fontSize: "13px",
        color: "#7A7469",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
      initial={{ x: 0 }}
      whileHover={{ x: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Go back"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </motion.button>
  );
}