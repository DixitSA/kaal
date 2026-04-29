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

const FREE_FEATURES = [
  "Vedic birth chart",
  "Current phase reading",
  "Today's daily signal",
  "3-day trial window",
];

const PRO_FEATURES = [
  "Everything in free",
  "Decision engine — career, health, money, relationships",
  "Unlimited daily access",
  "Daily chart refresh",
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}>
      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
    <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }}>
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
                color: "#7A7469",
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
              color: "#786030",
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
              color: "#2C2418",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              margin: "0 0 1.25rem",
            }}>
              Plans
            </h1>
            <p style={{
              fontFamily: "var(--font-inter-var), sans-serif",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "#5C574F",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
              margin: 0,
            }}>
              Choose the signal that fits your rhythm.
            </p>
          </motion.div>

          {/* Plan cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={childAnim(0.2)}
          >
            <style>{`
              .pricing-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
              }
              @media (max-width: 560px) {
                .pricing-grid { grid-template-columns: 1fr; }
              }
            `}</style>

            <div className="pricing-grid">
              {/* Free card */}
              <div style={{
                backgroundColor: "rgba(122,116,105,0.06)",
                border: "1px solid rgba(122,116,105,0.2)",
                borderRadius: "6px",
                padding: "2rem 1.75rem",
                display: "flex",
                flexDirection: "column",
              }}>
                <p style={{
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "10px",
                  color: "#786030",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  margin: "0 0 1rem",
                }}>
                  Free Trial
                </p>
                <p style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#2C2418",
                  margin: "0 0 0.25rem",
                  lineHeight: 1,
                }}>
                  3 days
                </p>
                <p style={{
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "12px",
                  color: "#9C9488",
                  margin: "0 0 2rem",
                  letterSpacing: "0.02em",
                }}>
                  no card required
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {FREE_FEATURES.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-inter-var)", fontSize: "13px", color: "#4A4F46", lineHeight: 1.5 }}>
                      <span style={{ color: "#786030" }}><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div style={{
                  padding: "10px 16px",
                  border: "1px solid rgba(122,116,105,0.25)",
                  borderRadius: "4px",
                  textAlign: "center",
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "11px",
                  color: "#9C9488",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}>
                  {!isLoading && !isProUser ? "Current Plan" : "Included"}
                </div>
              </div>

              {/* Pro card */}
              <div style={{
                backgroundColor: "rgba(181,86,62,0.04)",
                border: "1px solid rgba(181,86,62,0.35)",
                borderRadius: "6px",
                padding: "2rem 1.75rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}>
                {/* "Most popular" tag */}
                <div style={{
                  position: "absolute",
                  top: "-1px",
                  right: "1.25rem",
                  backgroundColor: "#B5563E",
                  color: "#F5F0E8",
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: "0 0 4px 4px",
                }}>
                  Pro
                </div>

                <p style={{
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "10px",
                  color: "#8B3620",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  margin: "0 0 1rem",
                }}>
                  Kaal Pro
                </p>
                <p style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#2C2418",
                  margin: "0 0 0.25rem",
                  lineHeight: 1,
                }}>
                  $6.99
                </p>
                <p style={{
                  fontFamily: "var(--font-inter-var)",
                  fontSize: "12px",
                  color: "#9C9488",
                  margin: "0 0 2rem",
                  letterSpacing: "0.02em",
                }}>
                  per month · cancel anytime
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {PRO_FEATURES.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-inter-var)", fontSize: "13px", color: "#4A4F46", lineHeight: 1.5 }}>
                      <span style={{ color: "#B5563E" }}><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>

                {!isLoading && isProUser ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{
                      padding: "10px 16px",
                      border: "1px solid rgba(181,86,62,0.3)",
                      borderRadius: "4px",
                      textAlign: "center",
                      fontFamily: "var(--font-inter-var)",
                      fontSize: "11px",
                      color: "#8B3620",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}>
                      Current Plan
                    </div>
                    <button
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        backgroundColor: "transparent",
                        color: "#7A7469",
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
                      width: "100%",
                      padding: "12px 20px",
                      backgroundColor: checkoutLoading ? "#9C9488" : "#B5563E",
                      color: "#F5F0E8",
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
                    {checkoutLoading ? "redirecting..." : "Unlock Kaal →"}
                  </button>
                )}
              </div>
            </div>
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
              color: "#9C9488",
              textAlign: "center",
              lineHeight: 1.7,
              letterSpacing: "0.02em",
            }}
          >
            Subscriptions renew monthly. Cancel at any time from the billing portal.
            <br />
            Questions? Reach us at <span style={{ color: "#786030" }}>hello@getkaal.com</span>.
          </motion.p>

        </main>
      </div>

      <Footer />
    </div>
  );
}
