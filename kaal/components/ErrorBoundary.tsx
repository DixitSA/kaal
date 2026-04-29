"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F5F0E8",
            gap: "1.5rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              color: "#2C2418",
            }}
          >
            Something went wrong.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              fontFamily: "var(--font-inter-var)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#F5F0E8",
              backgroundColor: "#B5563E",
              border: "none",
              borderRadius: "2px",
              padding: "10px 24px",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
