"use client";

import { type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useSubscription } from "@/hooks/useSubscription";

export default function SettingsDropdown() {
  const router = useRouter();
  const { clearUserData, isProUser } = useUser();
  const { handleUpgrade, handleManage } = useSubscription();

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
    <>
      {!isProUser && (
        <span
          onClick={handleUpgrade}
          onMouseOver={setOpaque}
          onMouseOut={setFaded}
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "11px",
            color: "#C75B3A",
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
          Upgrade to Pro →
        </span>
      )}
      {isProUser && (
        <span
          onClick={handleManage}
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