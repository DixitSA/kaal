"use client";

import { type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SettingsDropdown() {
  const router = useRouter();
  const { clearUserData, isProUser } = useUser();

  function handleClear(e: SyntheticEvent<HTMLSpanElement>) {
    e.stopPropagation();
    clearUserData();
    router.push("/");
  }

  function handleManageClick(e: SyntheticEvent<HTMLSpanElement>) {
    e.stopPropagation();
    router.push("/pricing");
  }

  function setOpaque(e: SyntheticEvent<HTMLSpanElement>) {
    e.currentTarget.style.opacity = "1";
  }

  function setFaded(e: SyntheticEvent<HTMLSpanElement>) {
    e.currentTarget.style.opacity = "0.6";
  }

  return (
    <>
      {isProUser && (
        <span
          onClick={handleManageClick}
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
            display: "block",
            marginBottom: "8px",
          }}
          onFocus={setOpaque}
          onBlur={setFaded}
        >
          Manage subscription
        </span>
      )}
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
    </>
  );
}