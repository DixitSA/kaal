"use client";

import { type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SettingsDropdown() {
  const router = useRouter();
  const { clearUserData } = useUser();

  function handleClear() {
    clearUserData();
    router.push("/");
  }

  function setOpaque(e: SyntheticEvent<HTMLSpanElement>) {
    e.currentTarget.style.opacity = "1";
  }

  function setFaded(e: SyntheticEvent<HTMLSpanElement>) {
    e.currentTarget.style.opacity = "0.6";
  }

  return (
    <span
      onClick={handleClear}
      onMouseOver={setOpaque}
      onMouseOut={setFaded}
      style={{
        fontFamily: "var(--font-playfair-display)",
        fontSize: "clamp(10px, 2vw, 12px)",
        color: "#7A7469",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        opacity: 0.6,
        cursor: "pointer",
        transition: "opacity 0.2s ease",
      }}
    >
      Clear Session
    </span>
  );
}