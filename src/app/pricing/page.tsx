"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import Footer from "@/components/ui/Footer";
import VedicDivider from "@/components/ui/VedicDivider";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function childAnim(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
  };
}

export default function PricingPage() {
  const shouldReduce = useReducedMotion();
  const { userData, isLoading } = useUser();
  const isProUser = userData?.subscriptionStatus === "pro";
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleUpgrade() {
    if (!userData?.email) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("[pricing] checkout error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleManageBilling() {
    if (!userData?.email) return;
    setPortalLoading(true);
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("[pricing] portal error:", err);
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--bg-cream)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
        <main style={{ maxWidth: "720px", margin: "0 auto", paddingBottom: "8rem" }}>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduce ? 0 : 0.5, ease: EASE }}
            style={{ paddingTop: "clamp(1.5rem, 4vw, 2.5rem)" }}
          >
            <Link
              href="/dashboard"
              style={{
                fontFamily: "var(--font-inter-var)",
                fontSize: "11px",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 0",
                transition: "color 0.15s ease",
              }}
            >
              ← Back to Dashboard
            </Link>
          </motion.div>

          {/* Page header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={childAnim(0.1)}
            style={{ textAlign: "center", marginTop: "3.5rem", marginBottom: "4rem" }}
          >
            <p style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              color: "var(--accent-gold)",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              margin: "0 0 1.25rem",
            }}>
              Access
            </p>
            <h1 style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(2.25rem, 7vw, 3.75rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              margin: "0 0 1.25rem",
            }}>
              Plans
            </h1>
            <p style={{
              fontFamily: "var(--font-playfair-display)",
              fontStyle: "italic",
              fontSize: "1.25rem",
              color: "var(--text-primary)",
              letterSpacing: "0.01em",
              lineHeight: 1.5,
              margin: 0,
            }}>
              three days free, then $6.99/month.
            </p>
          </motion.div>

          {/* Editorial plan description */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={childAnim(0.2)}
            style={{ maxWidth: "52ch", margin: "0 auto", textAlign: "center" }}
          >
            <p style={{
              fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
              fontSize: "1.05rem",
              color: "var(--olive-dark)",
              lineHeight: 1.8,
              letterSpacing: "0.015em",
              margin: "0 0 3rem",
            }}>
              Every profile starts with a three-day trial: your Vedic birth chart, current phase reading, and daily signal, no card required. Kaal Pro adds the decision engine across career, money, relationships, and travel, plus unlimited daily access and a fresh chart every day.
            </p>

            <p style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: "0 0 0.25rem",
              lineHeight: 1,
            }}>
              $6.99 <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--text-muted)" }}>/ month</span>
            </p>
            <p style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "12px",
              color: "var(--text-muted)",
              margin: "0 0 2.5rem",
              letterSpacing: "0.02em",
            }}>
              cancel anytime
            </p>

            {!isLoading && isProUser ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <p style={{
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "11px",
                  color: "var(--accent-terracotta-text)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  margin: 0,
                }}>
                  Current Plan
                </p>
                <button
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid rgba(122,116,105,0.25)",
                    borderRadius: "4px",
                    fontFamily: "var(--font-inter-var)",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: portalLoading ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s ease",
                    opacity: portalLoading ? 0.5 : 1,
                  }}
                >
                  {portalLoading ? "redirecting..." : "Manage Billing →"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                style={{
                  padding: "12px 32px",
                  backgroundColor: checkoutLoading ? "var(--text-muted)" : "var(--accent-terracotta)",
                  color: "var(--bg-cream)",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: checkoutLoading ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => { if (!checkoutLoading) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {checkoutLoading ? "redirecting..." : "Continue →"}
              </button>
            )}
          </motion.div>

          <VedicDivider />

          {/* Fine print */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={childAnim(0)}
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "12px",
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: 1.7,
              letterSpacing: "0.02em",
            }}
          >
            Subscriptions renew monthly. Cancel at any time from the billing portal.
            <br />
            Questions? Reach us at <span style={{ color: "var(--accent-gold)" }}>hello@getkaal.com</span>.
          </motion.p>

        </main>
      </div>

      <Footer />
    </div>
  );
}
