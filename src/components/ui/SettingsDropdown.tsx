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

  function setOpaque(e: SyntheticEvent<HTMLButtonElement>) {
    e.currentTarget.style.opacity = "1";
  }

  function setFaded(e: SyntheticEvent<HTMLButtonElement>) {
    e.currentTarget.style.opacity = "0.6";
  }

  return (
    <button
      onClick={handleClear}
      style={{
        background: "none",
        border: "1px solid rgba(122,116,105,0.25)",
        borderRadius: "4px",
        fontFamily: "var(--font-inter-var)",
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#7A7469",
        opacity: 0.6,
        cursor: "pointer",
        transition: "all 0.2s ease",
        padding: "6px 12px",
        minHeight: "32px",
      }}
      onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "rgba(122,116,105,0.4)"; }}
      onMouseOut={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.borderColor = "rgba(122,116,105,0.25)"; }}
      onTouchStart={setOpaque}
      onTouchEnd={setFaded}
      onFocus={setOpaque}
      onBlur={setFaded}
    >
      Clear Session
    </button>
  );
}