import { useCallback } from "react";
import { useUser } from "@/context/UserContext";

export function useSubscription() {
  const { userData, isProUser, isFreeTrialExpired, daysOnFree } = useUser();

  const daysRemaining = Math.max(0, 3 - daysOnFree);

  const handleUpgrade = useCallback(async () => {
    if (!userData?.email) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("[useSubscription] checkout error:", err);
    }
  }, [userData?.email]);

  const handleManage = useCallback(async () => {
    if (!userData?.email) return;
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("[useSubscription] portal error:", err);
    }
  }, [userData?.email]);

  return {
    isProUser,
    isFreeTrialExpired,
    daysRemaining,
    handleUpgrade,
    handleManage,
  };
}
