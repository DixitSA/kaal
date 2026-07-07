"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import type { KaalIntake } from "@/lib/client/kaalApp";

const PENDING_INTAKE_KEY = "kaal-pending-intake";

function AuthCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserData } = useUser();
  const [error, setError] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const email = searchParams.get("email");
    if (!email) {
      setError("missing verification details.");
      return;
    }

    void (async () => {
      try {
        const pendingRaw = localStorage.getItem(PENDING_INTAKE_KEY);
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw) as KaalIntake & { email: string };
          const res = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pending),
          });
          localStorage.removeItem(PENDING_INTAKE_KEY);
          if (res.ok) {
            const userFromDb = await res.json();
            setUserData({ ...pending, ...userFromDb });
            router.replace("/loading-screen");
            return;
          }
          setError("couldn't finish creating your reading. please try again.");
          return;
        }

        const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const user = await res.json();
          setUserData(user);
          router.replace("/loading-screen");
          return;
        }
        setError("no reading found for that email. create one from the homepage.");
      } catch {
        setError("something went wrong finishing sign-in. please try again.");
      }
    })();
  }, [router, searchParams, setUserData]);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-cream)", textAlign: "center", padding: "24px" }}>
      <p style={{ fontFamily: "var(--font-inter-var), sans-serif", fontSize: "14px", color: error ? "var(--accent-red)" : "var(--text-secondary)" }}>
        {error || "signing you in…"}
      </p>
    </div>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", backgroundColor: "var(--bg-cream)" }} />}>
      <AuthCompleteContent />
    </Suspense>
  );
}
