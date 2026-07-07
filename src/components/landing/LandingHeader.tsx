"use client";

const NAV_LINKS = [
  { href: "#method", label: "Method" },
  { href: "#sample", label: "Sample" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function LandingHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(245,240,232,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(122,116,105,0.08)",
      }}
    >
      <style>{`
        .landing-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 1rem clamp(1rem, 5vw, 3rem); }
        .landing-header-nav { display: flex; align-items: center; gap: clamp(1rem, 3vw, 2rem); }
        @media (max-width: 640px) {
          .landing-header-bar { padding: 0.85rem 1.25rem; }
          .landing-header-nav a:not(:last-child) { display: none; }
        }
      `}</style>
      <div className="landing-header-bar">
        <span
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "1rem",
            fontWeight: 400,
            color: "var(--text-primary)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Kaal
        </span>

        <nav className="landing-header-nav" aria-label="Page sections">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-inter-var)",
                fontSize: "11px",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#start"
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--accent-terracotta-text)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              textDecoration: "none",
              borderBottom: "1px solid var(--accent-terracotta)",
              paddingBottom: "2px",
              whiteSpace: "nowrap",
            }}
          >
            begin →
          </a>
        </nav>
      </div>
    </header>
  );
}
