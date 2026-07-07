"use client";

import { useEffect, useState, type CSSProperties, type FocusEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";

interface LoginFormProps {
  fieldVariants?: Variants;
  shouldReduce?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TERRACOTTA = "var(--accent-terracotta)";

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: EASE },
  }),
};

const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0, transition: { duration: 0 } }),
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-inter-var), sans-serif",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: "var(--olive-dark)",
  opacity: 0.7,
  display: "block",
  marginBottom: "10px",
  fontWeight: 500,
  textAlign: "left",
};

const inputStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #4A4F46",
  outline: "none",
  fontFamily: "var(--font-inter-var), sans-serif",
  fontSize: "16px",
  color: "var(--text-primary)",
  padding: 0,
  paddingBottom: "8px",
  minHeight: "36px",
  borderRadius: 0,
  display: "block",
  textAlign: "left",
};

function onFocus(e: FocusEvent<HTMLInputElement>) {
  e.target.style.borderBottom = `2px solid ${TERRACOTTA}`;
}
function onBlur(e: FocusEvent<HTMLInputElement>, hasError: boolean) {
  e.target.style.borderBottom = hasError ? `1px solid ${TERRACOTTA}` : "1px solid var(--text-primary)";
}

export default function LoginForm({ fieldVariants = defaultVariants, shouldReduce = false }: LoginFormProps) {
  const router = useRouter();
  const { setUserData } = useUser();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  async function requestMagicLink(targetEmail: string) {
    await fetch("/api/auth/request-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail }),
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("enter the email you signed up with.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/user?email=${encodeURIComponent(email.trim())}`);
      if (res.ok) {
        const user = await res.json();
        setUserData(user);
        router.push("/loading-screen");
        return;
      }
      if (res.status === 401) {
        // This browser doesn't hold a valid session for that email — send a
        // magic link so they can log in from here instead of a dead end.
        await requestMagicLink(email.trim());
        setLinkSent(true);
        setResendCooldown(30);
      } else if (res.status === 404) {
        setError("no reading found for that email. create one below.");
      } else {
        setError("couldn't log you in. please try again.");
      }
    } catch {
      setError("couldn't log you in. please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (isResending || resendCooldown > 0) return;
    setIsResending(true);
    try {
      await requestMagicLink(email.trim());
      setResendCooldown(30);
    } finally {
      setIsResending(false);
    }
  }

  const vars = shouldReduce ? reducedVariants : fieldVariants;
  const errStyle: CSSProperties = { color: TERRACOTTA, fontSize: "10px", marginTop: "4px", fontFamily: "var(--font-inter-var)", letterSpacing: "0.02em", lineHeight: 1.6 };

  if (linkSent) {
    const resendLabel = isResending
      ? "sending…"
      : resendCooldown > 0
        ? `resend link (${resendCooldown}s)`
        : "resend link";

    return (
      <div className="birth-form-card landing-form" style={{ width: "100%", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "12px" }}>
          check your email
        </p>
        <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px" }}>
          we sent a sign-in link to {email}. open it on this device to log in.
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--font-inter-var)",
            fontSize: "11px",
            color: resendCooldown > 0 || isResending ? "var(--text-muted)" : "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            textDecoration: "none",
            borderBottom: resendCooldown > 0 || isResending ? "1px solid transparent" : "1px solid rgba(122,116,105,0.3)",
            paddingBottom: "3px",
            cursor: isResending || resendCooldown > 0 ? "default" : "pointer",
            minHeight: "44px",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => { if (!isResending && resendCooldown === 0) e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { if (!isResending && resendCooldown === 0) e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          {resendLabel}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="birth-form-card landing-form"
      style={{ width: "100%", maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}
    >
      <motion.div custom={-1} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="login-email" style={labelStyle}>email address</label>
        <div className="input-underline-wrapper">
          <input
            id="login-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{ ...inputStyle, fontSize: "16px" }}
            onFocus={onFocus}
            onBlur={(e) => onBlur(e, !!error)}
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
          />
          <div className="input-underline" />
        </div>
        {error && <p id="login-error" role="alert" style={errStyle}>{error}</p>}
      </motion.div>

      <motion.div custom={0} variants={vars} initial="hidden" animate="visible" style={{ textAlign: "center", marginTop: "8px" }}>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 48px",
            minHeight: "44px",
            backgroundColor: TERRACOTTA,
            color: "var(--bg-cream)",
            fontFamily: "var(--font-playfair-display), sans-serif",
            fontWeight: 400,
            fontSize: "0.95rem",
            fontStyle: "italic",
            letterSpacing: "0.04em",
            border: "none",
            borderRadius: "2px",
            cursor: isSubmitting ? "wait" : "pointer",
            transition: "background-color 0.2s ease",
          }}
          initial={{ y: 0, scale: 1 }}
          whileHover={shouldReduce || isSubmitting ? {} : { y: -2, boxShadow: `0 8px 24px ${TERRACOTTA}66` }}
          whileTap={shouldReduce || isSubmitting ? {} : { scale: 0.97, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {isSubmitting ? "Checking…" : "Log In"}
        </motion.button>
      </motion.div>
    </form>
  );
}
