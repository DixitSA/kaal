"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { clearUserData } = useUser();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleClear() {
    clearUserData();
    router.push("/");
  }

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="p-6 cursor-pointer"
        aria-label="Settings"
        whileHover={shouldReduce ? {} : { rotate: 45 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ background: "none", border: "none", display: "flex" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="10" cy="10" r="2.5" stroke="#7A7469" strokeWidth="1.5" />
          <path
            d="M10 1.5V3.5M10 16.5V18.5M1.5 10H3.5M16.5 10H18.5M3.55 3.55L5 5M15 15L16.45 16.45M3.55 16.45L5 15M15 5L16.45 3.55"
            stroke="#7A7469"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.95, y: shouldReduce ? 0 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduce ? 1 : 0.95, y: shouldReduce ? 0 : -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              right: "16px",
              top: "56px",
              zIndex: 50,
              borderRadius: "2px",
              boxShadow: "0 2px 12px rgba(44,36,24,0.08)",
              padding: "12px",
              backgroundColor: "#F5F0E8",
              border: "1px solid rgba(122, 116, 105, 0.2)",
              minWidth: "140px",
              transformOrigin: "top right",
            }}
          >
            <button
              onClick={handleClear}
              className="w-full text-left cursor-pointer text-sm transition-colors"
              style={{ color: "#2C2418", fontFamily: "var(--font-inter-var)", background: "none", border: "none", padding: "4px 0" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#B5563E")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#2C2418")}
            >
              Clear profile
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
