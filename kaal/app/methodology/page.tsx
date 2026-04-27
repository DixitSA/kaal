"use client";

import BackLink from "@/components/ui/BackLink";
import DecorativeDivider from "@/components/svg/DecorativeDivider";
import SectionDivider from "@/components/ui/SectionDivider";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-6 py-8" style={{ maxWidth: "720px", margin: "0 auto" }}>
      <BackLink />

      <article className="mt-4">
        <h1
          className="text-2xl font-normal"
          style={{ fontFamily: "var(--font-playfair-display)", color: "#2C2418" }}
        >
          Methodology
        </h1>

        <div className="mt-6">
          <DecorativeDivider width={200} opacity={0.2} />
        </div>

        <section className="mt-8 space-y-6">
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: "var(--font-inter-var)", color: "#2C2418" }}
          >
            Kaal is built on the foundation of <em style={{ fontFamily: "var(--font-playfair-display)" }}>Vedic Timing Systems</em> — specifically the Panchang, the traditional Hindu almanac used for centuries to determine auspicious moments and understand temporal influences.
          </p>

          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: "var(--font-inter-var)", color: "#2C2418" }}
          >
            Rather than making predictions, Kaal analyzes the relationship between your birth moment and the cosmic cycles at that exact time. This creates a personalized map of tendencies — the patterns that emerge when you move through the world at a particular pace.
          </p>
        </section>

        <SectionDivider />

        <section className="mt-10">
          <h2
            className="text-sm uppercase tracking-wider mb-6"
            style={{ fontFamily: "var(--font-inter-var)", color: "#8A7240" }}
          >
            System Overview
          </h2>

          <div
            className="p-6 sm:p-8 border border-[#9C9488]/20 rounded-sm"
            style={{ backgroundColor: "rgba(245, 240, 232, 0.6)" }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-baseline pb-3 border-b border-[#9C9488]/10">
                <span style={{ fontFamily: "var(--font-inter-var)", color: "#7A7469", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Birth Tithi
                </span>
                <span style={{ fontFamily: "var(--font-playfair-display)", color: "#2C2418", fontStyle: "italic" }}>
                  Lunar day of birth
                </span>
              </div>
              <div className="flex justify-between items-baseline pb-3 border-b border-[#9C9488]/10">
                <span style={{ fontFamily: "var(--font-inter-var)", color: "#7A7469", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Nakshatra
                </span>
                <span style={{ fontFamily: "var(--font-playfair-display)", color: "#2C2418", fontStyle: "italic" }}>
                  Lunar constellation
                </span>
              </div>
              <div className="flex justify-between items-baseline pb-3 border-b border-[#9C9488]/10">
                <span style={{ fontFamily: "var(--font-inter-var)", color: "#7A7469", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Yoga
                </span>
                <span style={{ fontFamily: "var(--font-playfair-display)", color: "#2C2418", fontStyle: "italic" }}>
                  Combination of luminaries
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span style={{ fontFamily: "var(--font-inter-var)", color: "#7A7469", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Weekday Signature
                </span>
                <span style={{ fontFamily: "var(--font-playfair-display)", color: "#2C2418", fontStyle: "italic" }}>
                  Planetary ruler influence
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-inter-var)", color: "#7A7469" }}
          >
            These four dimensions combine to form your unique timing profile. Each dimension carries its own rhythm — some faster, some slower — and the interplay between them creates the distinctive cadence of how you experience time.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-[#9C9488]/20">
          <p
            className="text-xs text-center"
            style={{ fontFamily: "var(--font-inter-var)", color: "#7A7469" }}
          >
            Built on Vedic Timing Systems · For entertainment & educational purposes
          </p>
        </div>
      </article>
    </main>
  );
}