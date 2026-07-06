"use client";

import { useState } from "react";
import Link from "next/link";

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onUpgrade() {
    setLoading(true);
    setError("");
    try {
      const storedUser = localStorage.getItem("kaal-user");
      if (!storedUser) {
        setError("please sign in first.");
        setLoading(false);
        return;
      }
      const userData = JSON.parse(storedUser) as { email?: string };
      if (!userData.email) {
        setError("please sign in first.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "something went wrong. please try again.");
        setLoading(false);
      }
    } catch {
      setError("something went wrong. please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--bg-cream)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {/* Kaal wordmark */}
      <Link href="/" style={{ textDecoration: "none", color: "inherit", marginBottom: "3rem" }}>
        <span style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--text-primary)" }}>Kaal</span>
      </Link>

      <div style={{ maxWidth: "380px", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.75rem", color: "var(--text-primary)", margin: "0 0 1rem", fontWeight: 600 }}>
          keep your daily signal going.
        </h1>

        <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "0.875rem", color: "var(--text-secondary)", margin: "0 0 2rem", lineHeight: 1.6 }}>
          know what each day asks of you. built on vedic timing systems.
        </p>

        <div style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.25rem", color: "var(--accent-faded-gold)", marginBottom: "2rem", fontWeight: 500 }}>
          $6.99 / month
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "0.75rem", color: "var(--accent-red)", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <button
          onClick={onUpgrade}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 24px",
            backgroundColor: loading ? "var(--accent-terracotta-hover)" : "var(--accent-terracotta-btn)",
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
          onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {loading ? "REDIRECTING..." : "GET STARTED →"}
        </button>

        <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1.5rem", marginBottom: 0 }}>
          cancel anytime. no commitment.
        </p>
      </div>
    </div>
  );
}
