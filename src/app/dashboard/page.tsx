"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useSubscription } from "@/hooks/useSubscription";
import { needsDailyRefresh } from "@/lib/client/kaalApp";
import PhaseSection from "@/components/dashboard/PhaseSection";
import TodaySection from "@/components/dashboard/TodaySection";
import DecisionSection from "@/components/dashboard/DecisionSection";
import PatternSection from "@/components/dashboard/PatternSection";
import VedicDivider from "@/components/ui/VedicDivider";
import SettingsDropdown from "@/components/ui/SettingsDropdown";
import Footer from "@/components/ui/Footer";
import PaywallModal from "@/components/ui/PaywallModal";

interface Contemplation {
  quote: string;
  source: string;
}

const CONTEMPLATIONS: Contemplation[] = [
  { quote: "The stars impel, they do not compel.", source: "B. V. Raman" },
  { quote: "Wisdom begins in wonder.", source: "Plato" },
  { quote: "The universe is not only stranger than we imagine, it is stranger than we can imagine.", source: "J. B. S. Haldane" },
  { quote: "As above, so below.", source: "Hermes Trismegistus" },
  { quote: "Time is the wisest counselor.", source: "Pythagoras" },
  { quote: "Nature does not hurry, yet everything is accomplished.", source: "Lao Tzu" },
  { quote: "In the middle of difficulty lies opportunity.", source: "Einstein" },
];

const NAV_LINKS = [
  { label: "Phase", href: "#current-phase" },
  { label: "Today", href: "#today" },
  { label: "Decision", href: "#decision" },
  { label: "Card", href: "#card" },
] as const;

function getContemplation() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return CONTEMPLATIONS[dayOfYear % CONTEMPLATIONS.length];
}

const FOOTER_LINKS = [
  { label: "Methodology", href: "/methodology" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

function DashboardContent() {
  const router = useRouter();
  const { userData, computedData, isLoading, isFreeTrialExpired, daysOnFree, patchUserData } = useUser();
  const { isProUser, daysRemaining } = useSubscription();
  const [contemplation, setContemplation] = useState<Contemplation | null>(null);
  const [clientDate, setClientDate] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [lockedSection, setLockedSection] = useState<"decision" | null>(null);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const searchParams = useSearchParams();
  const pendingUpgradeRefreshRef = useRef(false);

  useEffect(() => {
    setHasMounted(true);
    setContemplation(getContemplation());
    setClientDate(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  }, []);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      pendingUpgradeRefreshRef.current = true;
      setShowUpgradeSuccess(true);
      router.replace("/dashboard");
      setTimeout(() => setShowUpgradeSuccess(false), 4000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!pendingUpgradeRefreshRef.current) return;
    if (isLoading || !userData?.email) return;
    pendingUpgradeRefreshRef.current = false;

    fetch(`/api/user?email=${encodeURIComponent(userData.email)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((freshUser) => {
        if (freshUser) patchUserData(freshUser);
      })
      .catch((err) => console.error("[dashboard] failed to refresh subscription status:", err));
  }, [isLoading, userData, patchUserData]);

  useEffect(() => {
    if (!hasMounted) return;
    if (isLoading) return;
    if (!userData) { router.replace("/"); return; }
    if (needsDailyRefresh(computedData) || !computedData) { router.replace("/loading-screen"); }
  }, [hasMounted, computedData, isLoading, router, userData]);

  const showTrialBanner = hasMounted && !isProUser && !isFreeTrialExpired && daysOnFree >= 0;

  if (!hasMounted) return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;
  if (isLoading) return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;
  if (!userData || !computedData) return null;

  return (
    <div style={{ minHeight: "100dvh" }} className="relative">
      {/* Sticky header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "rgba(245,240,232,0.95)", paddingTop: showTrialBanner ? 0 : "env(safe-area-inset-top)" }}>
        <style>{`
          .dash-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 1rem clamp(1rem, 5vw, 3rem); position: relative; }
          .dash-nav { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: clamp(0.75rem, 3vw, 2rem); }
          .dash-nav-mobile { display: none; justify-content: center; padding: 0.3rem 1rem 0.65rem; gap: 0; border-top: 1px solid rgba(122,116,105,0.08); }
          @media (max-width: 768px) {
            .dash-header-bar { padding: 0.75rem 1rem; }
            .dash-nav { display: none; }
            .dash-nav-mobile { display: flex; }
          }
        `}</style>
        {/* Row 1: Logo + Settings — always visible */}
        <div className="dash-header-bar">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <span style={{ fontFamily: "var(--font-playfair-display)", fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>Kaal</span>
          </Link>
          {/* Desktop nav — absolutely centered */}
          <nav className="dash-nav" aria-label="Page sections" aria-hidden="true">
           {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} style={{ fontFamily: "var(--font-playfair-display)", fontSize: "clamp(10px, 2vw, 12px)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none", whiteSpace: "nowrap", transition: "color 0.2s ease" }}
              aria-label={link.label}
            >
              {link.label}
            </a>
          ))}
          </nav>
          <SettingsDropdown />
        </div>
         {/* Row 2: Mobile nav — second row below logo/settings */}
          <nav className="dash-nav-mobile" aria-label="Page sections" aria-hidden="true">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} style={{ fontFamily: "var(--font-playfair-display)", fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", textDecoration: "none", whiteSpace: "nowrap", transition: "color 0.2s ease", padding: "8px 12px" }}
              aria-label={link.label}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Banner area — below header, above all content */}
      <div style={{ position: "sticky", top: showTrialBanner ? "0" : undefined, zIndex: showTrialBanner ? 98 : undefined }}>
        {/* Upgrade success banner */}
        {showUpgradeSuccess && (
          <div
            style={{
              backgroundColor: "rgba(120,140,120,0.1)",
              fontFamily: "var(--font-inter-var), sans-serif",
              fontSize: "0.75rem",
              color: "#2C2418",
              textAlign: "center",
              padding: "0.5rem 1rem",
            }}
          >
            welcome to kaal pro. your signal is now unlocked.
          </div>
        )}

        {/* Trial countdown banner */}
        {!showUpgradeSuccess && showTrialBanner && (
          <div
            style={{
              backgroundColor: "rgba(184,168,120,0.1)",
              fontFamily: "var(--font-inter-var), sans-serif",
              fontSize: "0.75rem",
              color: "#2C2418",
              textAlign: "center",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
            onClick={() => setPaywallOpen(true)}
          >
             {daysRemaining} days of full access remaining. upgrade to keep your signal going →
          </div>
        )}
      </div>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "0 clamp(1rem, 5vw, 3rem) 8rem", touchAction: "pan-y" }}>
        <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>Kaal — your daily vedic report</h1>

        <p style={{ fontFamily: "var(--font-inter-var)", fontSize: "13px", color: "#7A7469", textTransform: "lowercase", letterSpacing: "0.2em", marginTop: "1rem", marginBottom: "3rem" }}>
          {hasMounted ? clientDate : ""}
        </p>

        {/* Contemplation */}
        {contemplation && (
          <section style={{ textAlign: "center", padding: "3rem 0 4rem", borderBottom: "1px solid rgba(122,116,105,0.15)", marginBottom: "3rem" }}>
            <blockquote style={{ fontFamily: "var(--font-playfair-display)", fontSize: "1.5rem", fontStyle: "italic", color: "#2C2418", lineHeight: 1.5, margin: "0 0 1rem" }}>"{contemplation.quote}"</blockquote>
             <cite style={{ fontFamily: "var(--font-inter-var)", fontSize: "12px", color: "#9C9488", letterSpacing: "0.1em", textTransform: "uppercase" }}>, {contemplation.source}</cite>
          </section>
        )}

        <section id="current-phase" style={{ scrollMarginTop: "80px" }}><PhaseSection /></section>
        <VedicDivider />
        <section id="today" style={{ scrollMarginTop: "80px" }}>
          <TodaySection />
        </section>
        <VedicDivider />
        <section id="decision" style={{ scrollMarginTop: "80px" }}>
          <DecisionSection
            locked={isFreeTrialExpired}
            onUpgrade={() => { setLockedSection("decision"); setPaywallOpen(true); }}
          />
        </section>
        <VedicDivider />
        <section id="card" style={{ scrollMarginTop: "80px", marginTop: "3rem" }}><PatternSection /></section>
      </main>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 30, padding: "4rem 24px 2rem", textAlign: "center", marginTop: "8rem" }}>
        <div style={{ fontFamily: "var(--font-playfair-display)", fontSize: "0.9rem", fontStyle: "italic", color: "#2C2418", marginBottom: "6px", opacity: 0.7 }}>Kaal</div>
        <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontStyle: "italic", fontSize: "11px", color: "#9C9488", letterSpacing: "0.04em", margin: "0 0 1.5rem" }}>built on vedic timing systems. © 2026 Kaal Astrology</p>
        <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0" }}>
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.href} style={{ display: "flex", alignItems: "center" }}>
              <a href={link.href} style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "11px", color: "#9C9488", letterSpacing: "0.07em", textTransform: "uppercase", padding: "16px 14px", minHeight: "44px", display: "inline-flex", alignItems: "center", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#2C2418"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#9C9488"}
              >
                {link.label}
              </a>
              {i < FOOTER_LINKS.length - 1 && <span style={{ color: "rgba(122,116,105,0.3)", fontSize: "11px", userSelect: "none" }}>|</span>}
            </span>
          ))}
        </nav>
      </footer>

      {/* Paywall modal */}
      <PaywallModal open={paywallOpen || !!lockedSection} onClose={() => { setPaywallOpen(false); setLockedSection(null); }} email={userData?.email} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />}>
      <DashboardContent />
    </Suspense>
  );
}
