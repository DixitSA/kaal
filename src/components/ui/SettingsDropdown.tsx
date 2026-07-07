"use client";

import { type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SettingsDropdown() {
  const router = useRouter();
  const { clearUserData, isProUser } = useUser();

  function handleClear(e: SyntheticEvent<HTMLButtonElement>) {
    e.stopPropagation();
    clearUserData();
    router.push("/");
  }

  function handleManageClick(e: SyntheticEvent<HTMLButtonElement>) {
    e.stopPropagation();
    router.push("/pricing");
  }

  function setOpaque(e: SyntheticEvent<HTMLButtonElement>) {
    e.currentTarget.style.opacity = "1";
  }

  function setFaded(e: SyntheticEvent<HTMLButtonElement>) {
    e.currentTarget.style.opacity = "0.6";
  }

  return (
    <>
      {isProUser && (
        <button
          type="button"
          onClick={handleManageClick}
          onMouseOver={setOpaque}
          onMouseOut={setFaded}
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--font-playfair-display)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: 0.6,
            cursor: "pointer",
            transition: "opacity 0.2s ease",
            borderBottom: "1px solid transparent",
            paddingBottom: "2px",
            display: "block",
            marginBottom: "8px",
          }}
          onFocus={setOpaque}
          onBlur={setFaded}
        >
          Manage subscription
        </button>
      )}
      <button
        type="button"
        onClick={handleClear}
        onMouseOver={setOpaque}
        onMouseOut={setFaded}
        style={{
          background: "none",
          border: "none",
          fontFamily: "var(--font-playfair-display)",
          fontSize: "11px",
          color: "var(--text-secondary)",
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
      </button>
    </>
  );
}