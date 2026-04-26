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
        fontSize: "11px",
        color: "#7A7469",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        opacity: 0.6,
        cursor: "pointer",
        transition: "opacity 0.2s ease",
        borderBottom: "1px solid transparent",
        paddingBottom: "2px",
      }}
      onFocus={setOpaque}
      onBlur={setFaded}
    >
      Clear Session
    </span>
  );
}