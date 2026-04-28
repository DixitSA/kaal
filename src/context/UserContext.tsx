"use client";

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";

import type { KaalIntake, KaalSnapshot } from "@/lib/client/kaalApp";

export interface UserData extends KaalIntake {
  email: string;
  subscriptionStatus: "free" | "pro";
  trialStartDate: string;
}

interface UserContextType {
  userData: UserData | null;
  computedData: KaalSnapshot | null;
  setUserData: (data: UserData | KaalIntake) => void;
  setComputedData: (data: KaalSnapshot) => void;
  clearUserData: () => void;
  isLoading: boolean;
  isProUser: boolean;
  isFreeTrialExpired: boolean;
  daysOnFree: number;
}

const UserContext = createContext<UserContextType | null>(null);

const USER_STORAGE_KEY = "kaal-user";
const SNAPSHOT_STORAGE_KEY = "kaal-snapshot";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [computedData, setComputedDataState] = useState<KaalSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isProUser = useMemo(() => userData?.subscriptionStatus === "pro", [userData?.subscriptionStatus]);
  const daysOnFree = useMemo(() => {
    if (!userData?.trialStartDate) return 0;
    const start = new Date(userData.trialStartDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / 86400000);
  }, [userData?.trialStartDate]);
  const isFreeTrialExpired = useMemo(() => daysOnFree > 3 && !isProUser, [daysOnFree, isProUser]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedSnapshot = localStorage.getItem(SNAPSHOT_STORAGE_KEY);

      if (storedUser) {
        setUserDataState(JSON.parse(storedUser) as UserData);
      }

      if (storedSnapshot) {
        setComputedDataState(JSON.parse(storedSnapshot) as KaalSnapshot);
      }
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
    }

    setIsLoading(false);
  }, []);

  function setUserData(data: UserData | KaalIntake) {
    const fullData: UserData = {
      ...data,
      email: (data as UserData).email || "",
      subscriptionStatus: (data as UserData).subscriptionStatus || "free",
      trialStartDate: (data as UserData).trialStartDate || new Date().toISOString(),
    };
    setUserDataState(fullData);
    setComputedDataState(null);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fullData));
    localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
  }

  function setComputedData(data: KaalSnapshot) {
    setComputedDataState(data);
    localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(data));
  }

  function clearUserData() {
    setUserDataState(null);
    setComputedDataState(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        computedData,
        setUserData,
        setComputedData,
        clearUserData,
        isLoading,
        isProUser,
        isFreeTrialExpired,
        daysOnFree,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return ctx;
}
