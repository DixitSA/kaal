"use client";

import { useEffect } from "react";
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

export default function Dashboard() {
  const router = useRouter();
  const { userData, computedData, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!userData) {
      router.replace("/");
      return;
    }

    if (needsDailyRefresh(computedData) || !computedData) {
      router.replace("/loading-screen");
    }
  }, [computedData, isLoading, router, userData]);

  if (isLoading) {
    return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;
  }

  if (!userData || !computedData) return null;

  return (
    <div style={{ minHeight: "100dvh" }} className="relative">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ backgroundColor: "#F5F0E8", padding: "2.5rem" }}>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              transition: "opacity 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.85")}
          >
            <span
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#2C2418",
              }}
            >
              Kaal
            </span>
          </Link>
          <div>
            <SettingsDropdown />
          </div>
        </div>
      </div>

      <main
        className="mx-auto px-4 sm:px-6 pt-24 pb-32"
        style={{ maxWidth: "720px" }}
      >
        {/* Visually hidden h1 for screen-reader heading hierarchy */}
        <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          Kaal — your daily vedic report
        </h1>

        {/* Date stamp — grounds the reading in today */}
        <p
          className="tracking-[0.2em] mb-12"
          style={{
            fontFamily: "var(--font-inter-var)",
            fontSize: "13px",
            color: "#7A7469",
            textTransform: "lowercase",
          }}
        >
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <PhaseSection />
        <SectionDivider />
        <TodaySection />
        <SectionDivider />
        <DecisionSection />
        <SectionDivider />
        <div style={{ marginTop: "3rem" }}>
          <PatternSection />
        </div>
      </main>
    </div>
  );
}
