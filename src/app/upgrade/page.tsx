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
    <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {/* Kaal wordmark */}
      <Link href="/" style={{ textDecoration: "none", color: "inherit", marginBottom: "3rem" }}>
        <span style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.5rem", fontWeight: 600, color: "#2C2418" }}>Kaal</span>
      </Link>

      <div style={{ maxWidth: "380px", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.75rem", color: "#2C2418", margin: "0 0 1rem", fontWeight: 600 }}>
          unlock your daily signal.
        </h1>

        <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "0.875rem", color: "#7A7469", margin: "0 0 2rem", lineHeight: 1.6 }}>
          know what each day asks of you. built on vedic timing systems.
        </p>

        <div style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.25rem", color: "#B4A878", marginBottom: "2rem", fontWeight: 500 }}>
          $6.99 / month
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "0.75rem", color: "#A04040", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <button
          onClick={onUpgrade}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 24px",
            backgroundColor: loading ? "#A65D46" : "#C75B3A",
            color: "#F5F0E8",
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

        <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "0.75rem", color: "#9C9488", marginTop: "1.5rem", marginBottom: 0 }}>
          cancel anytime. no commitment.
        </p>
      </div>
    </div>
  );
}
