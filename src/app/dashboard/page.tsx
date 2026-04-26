{"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { needsDailyRefresh } from "@/lib/client/kaalApp";
import PhaseSection from "@/components/dashboard/PhaseSection";
import TodaySection from "@/components/dashboard/TodaySection";
import DecisionSection from "@/components/dashboard/DecisionSection";
import PatternSection from "@/components/dashboard/PatternSection";
import SectionDivider from "@/components/ui/SectionDivider";
import SettingsDropdown from "@/components/ui/SettingsDropdown";

const CONTEMPLATIONS = [
  { quote: "The stars impel, they do not compel.", source: "B. V. Raman" },
  { quote: " Wisdom begins in wonder.", source: "Plato" },
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

export default function Dashboard() {
  const router = useRouter();
  const { userData, computedData, isLoading } = useUser();
  const [contemplation] = useState(getContemplation);

  useEffect(() => {
    if (isLoading) return;
    if (!userData) { router.replace("/"); return; }
    if (needsDailyRefresh(computedData) || !computedData) { router.replace("/loading-screen"); }
  }, [computedData, isLoading, router, userData]);

  if (isLoading) return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;
  if (!userData || !computedData) return null;

  return (
    <div style={{ minHeight: "100dvh" }} className="relative">
      {/* Sticky header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "rgba(245,240,232,0.9)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "1rem clamp(1rem, 5vw, 3rem)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span style={{ fontFamily: "var(--font-playfair-display)", fontSize: "1.1rem", fontWeight: 600, color: "#2C2418" }}>Kaal</span>
        </Link>
        <nav style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "clamp(0.75rem, 3vw, 2rem)" }}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} style={{ fontFamily: "var(--font-playfair-display)", fontSize: "clamp(10px, 2vw, 12px)", color: "#7A7469", textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none", whiteSpace: "nowrap", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2C2418"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#7A7469"}>
              {link.label}
            </a>
          ))}
        </nav>
        <SettingsDropdown />
      </header>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "0 clamp(1rem, 5vw, 3rem) 8rem" }}>
        <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>Kaal — your daily vedic report</h1>

        <p style={{ fontFamily: "var(--font-inter-var)", fontSize: "13px", color: "#7A7469", textTransform: "lowercase", letterSpacing: "0.2em", marginTop: "1rem", marginBottom: "3rem" }}>
          {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {/* Contemplation */}
        <section style={{ textAlign: "center", padding: "3rem 0 4rem", borderBottom: "1px solid rgba(122,116,105,0.15)", marginBottom: "3rem" }}>
          <blockquote style={{ fontFamily: "var(--font-playfair-display)", fontSize: "1.5rem", fontStyle: "italic", color: "#2C2418", lineHeight: 1.5, margin: "0 0 1rem" }}>"{contemplation.quote}"</blockquote>
          <cite style={{ fontFamily: "var(--font-inter-var)", fontSize: "12px", color: "#9C9488", letterSpacing: "0.1em", textTransform: "uppercase" }}>— {contemplation.source}</cite>
        </section>

        <section id="current-phase" style={{ scrollMarginTop: "80px" }}><PhaseSection /></section>
        <SectionDivider />
        <section id="today" style={{ scrollMarginTop: "80px" }}><TodaySection /></section>
        <SectionDivider />
        <section id="decision" style={{ scrollMarginTop: "80px" }}><DecisionSection /></section>
        <SectionDivider />
        <section id="card" style={{ scrollMarginTop: "80px", marginTop: "3rem" }}><PatternSection /></section>
      </main>
    </div>
  );
}