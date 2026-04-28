"use client";

import { useEffect, useRef } from "react";
import { useSubscription } from "@/hooks/useSubscription";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PaywallModal({ open, onClose }: PaywallModalProps) {
  const { handleUpgrade, handleManage } = useSubscription();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(44,36,24,0.6)",
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: "#F5F0E8",
          borderRadius: "4px",
          padding: "2.5rem 2rem",
          maxWidth: "380px",
          width: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            color: "#9C9488",
            fontSize: "14px",
            cursor: "pointer",
            padding: "4px",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <h2
          style={{
            fontFamily: "var(--font-playfair-display), serif",
            fontSize: "1.5rem",
            color: "#2C2418",
            margin: "0 0 0.75rem",
            fontWeight: 600,
          }}
        >
          your signal is ready.
        </h2>

        <p
          style={{
            fontFamily: "var(--font-inter-var), sans-serif",
            fontSize: "0.875rem",
            color: "#7A7469",
            margin: "0 0 1.75rem",
            lineHeight: 1.5,
          }}
        >
          unlock daily timing for $6.99/month. cancel anytime.
        </p>

        <button
          onClick={handleUpgrade}
          style={{
            width: "100%",
            padding: "14px 24px",
            backgroundColor: "#C75B3A",
            color: "#F5F0E8",
            border: "none",
            borderRadius: "4px",
            fontFamily: "var(--font-inter-var), sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          unlock kaal →
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "0.75rem",
          }}
        >
          <button
            onClick={handleManage}
            style={{
              background: "none",
              border: "none",
              color: "#9C9488",
              fontFamily: "var(--font-inter-var), sans-serif",
              fontSize: "0.75rem",
              cursor: "pointer",
              textDecoration: "underline",
              padding: "4px",
            }}
          >
            manage subscription
          </button>
        </p>
      </div>
    </div>
  );
}
