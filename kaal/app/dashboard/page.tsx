"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import PhaseSection from "@/components/dashboard/PhaseSection";
import TodaySection from "@/components/dashboard/TodaySection";
import DecisionSection from "@/components/dashboard/DecisionSection";
import PatternSection from "@/components/dashboard/PatternSection";
import SectionDivider from "@/components/ui/SectionDivider";
import SettingsDropdown from "@/components/ui/SettingsDropdown";

export default function Dashboard() {
  const router = useRouter();
  const { userData, apiData, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!userData) {
      router.replace("/");
    } else if (!apiData) {
      router.replace("/loading-screen");
    }
  }, [isLoading, userData, apiData, router]);

  if (isLoading || !userData || !apiData) {
    return <div style={{ minHeight: "100dvh", backgroundColor: "#F5F0E8" }} />;
  }

  return (
    <div style={{ minHeight: "100dvh" }} className="relative">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between pointer-events-none">
        <div className="p-6 pointer-events-auto flex flex-col">
          <div
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "1.25rem",
              color: "#2C2418",
              lineHeight: 1
            }}
          >
            Kaal
          </div>
          <div
            className="mt-1"
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "0.75rem",
              color: "#7A7469"
            }}
          >
            {apiData.user.name}
          </div>
        </div>
        <div className="pointer-events-auto">
          <SettingsDropdown />
        </div>
      </div>

      <main
        className="mx-auto px-6 pt-24 pb-32"
        style={{ maxWidth: "720px" }}
      >
        <PhaseSection />
        <SectionDivider />
        <TodaySection />
        <SectionDivider />
        <DecisionSection />
        <SectionDivider />
        <PatternSection />
      </main>
    </div>
  );
}
