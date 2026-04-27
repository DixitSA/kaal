"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ALL_LINKS = [
  { label: "DASHBOARD", href: "/" },
  { label: "METHODOLOGY", href: "/methodology" },
  { label: "PRIVACY", href: "/privacy" },
  { label: "TERMS", href: "/terms" },
] as const;

const DEFAULT_LINKS = ALL_LINKS.filter((l) => l.href !== "/methodology");

export default function Footer() {
  const pathname = usePathname();
  const filtered = ALL_LINKS.filter((l) => l.href !== pathname);
  const links = filtered.length === 3 ? filtered : DEFAULT_LINKS;

  return (
    <footer style={{ position: "relative", zIndex: 30, padding: "4rem 24px 3rem", textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-playfair-display)",
        fontSize: "0.9rem",
        fontStyle: "italic",
        color: "#2C2418",
        marginBottom: "6px",
        opacity: 0.7,
      }}>
        Kaal
      </div>
      <p style={{
        fontFamily: "var(--font-inter-var), sans-serif",
        fontStyle: "italic",
        fontSize: "11px",
        color: "#9C9488",
        letterSpacing: "0.04em",
        margin: "0 0 1.5rem",
      }}>
        built on vedic timing systems. © 2026 Kaal Astrology
      </p>
      <nav
        aria-label="Site navigation"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}
      >
        {links.map((link, i) => (
          <span key={link.href} style={{ display: "flex", alignItems: "center" }}>
            <Link
              href={link.href}
              style={{
                fontFamily: "var(--font-inter-var), sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                color: "var(--kaal-footer-text)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "16px 14px",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2C2418")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--kaal-footer-text)")}
            >
              {link.label}
            </Link>
            {i < links.length - 1 && (
              <span aria-hidden="true" style={{ color: "rgba(140,134,122,0.35)", fontSize: "11px", userSelect: "none" }}>|</span>
            )}
          </span>
        ))}
      </nav>
    </footer>
  );
}
