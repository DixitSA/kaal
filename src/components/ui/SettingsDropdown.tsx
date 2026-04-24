"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SettingsDropdown() {
  const router = useRouter();
  const { clearUserData } = useUser();

  function handleClear() {
    clearUserData();
    router.push("/");
  }

  return (
    <button
      onClick={handleClear}
      style={{
        background: "none",
        border: "none",
        fontFamily: "var(--font-inter-var)",
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "#7A7469",
        opacity: 0.5,
        cursor: "pointer",
        transition: "opacity 0.3s ease",
        padding: "8px",
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseOut={(e) => (e.currentTarget.style.opacity = "0.5")}
    >
      CLEAR SESSION
    </button>
  );
}