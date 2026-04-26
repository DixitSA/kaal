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
    e.currentTarget.style.opacity = "0.5";
  }

  return (
    <button
      onClick={handleClear}
      style={{
        background: "none",
        border: "none",
        fontFamily: "var(--font-inter-var)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "#7A7469",
        opacity: 0.5,
        cursor: "pointer",
        transition: "opacity 0.3s ease",
        padding: "12px 16px",
        minHeight: "44px",
        minWidth: "44px",
      }}
      onMouseOver={setOpaque}
      onMouseOut={setFaded}
      onTouchStart={setOpaque}
      onTouchEnd={setFaded}
      onFocus={setOpaque}
      onBlur={setFaded}
    >
      CLEAR SESSION
    </button>
  );
}