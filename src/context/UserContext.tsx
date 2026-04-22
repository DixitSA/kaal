"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { KaalIntake, KaalSnapshot } from "@/lib/client/kaalApp";

interface UserContextType {
  userData: KaalIntake | null;
  computedData: KaalSnapshot | null;
  setUserData: (data: KaalIntake) => void;
  setComputedData: (data: KaalSnapshot) => void;
  clearUserData: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

const USER_STORAGE_KEY = "kaal-user";
const SNAPSHOT_STORAGE_KEY = "kaal-snapshot";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<KaalIntake | null>(null);
  const [computedData, setComputedDataState] = useState<KaalSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedSnapshot = localStorage.getItem(SNAPSHOT_STORAGE_KEY);

      if (storedUser) {
        setUserDataState(JSON.parse(storedUser) as KaalIntake);
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

  function setUserData(data: KaalIntake) {
    setUserDataState(data);
    setComputedDataState(null);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
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
        isLoading
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
