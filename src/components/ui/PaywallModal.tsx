"use client";

import { useState } from "react";
import Link from "next/link";
import { useSubscription } from "@/hooks/useSubscription";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  email?: string;
}

export default function PaywallModal({ open, onClose, email }: PaywallModalProps) {
  const { handleUpgrade } = useSubscription();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onClickUpgrade = async () => {
    if (!email) { alert("Please sign in first."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { console.error("[PaywallModal] checkout error:", data.error); alert("Unable to start checkout. Please try again."); }
    } catch (err) {
      console.error("[PaywallModal] checkout error:", err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          onClick={onClickUpgrade}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 24px",
             backgroundColor: loading ? "var(--text-muted)" : "var(--accent-terracotta)",
             color: "var(--bg-cream)",
            border: "none",
            borderRadius: "4px",
            fontFamily: "var(--font-inter-var), sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s ease",
          }}
        >
          {loading ? "redirecting..." : "unlock kaal →"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "0.75rem",
          }}
        >
          <Link
            href="/pricing"
            onClick={onClose}
            style={{
              color: "#9C9488",
              fontFamily: "var(--font-inter-var), sans-serif",
              fontSize: "0.75rem",
              textDecoration: "underline",
              padding: "4px",
            }}
          >
            manage subscription
          </Link>
        </p>
      </div>
    </div>
  );
}
