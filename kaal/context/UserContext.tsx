"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ProfileResponse } from "@/types/api";

export interface UserFormData {
  name: string;
  dob: string;
  timeOfBirth: string;
  unknownTime: boolean;
  placeOfBirth: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

const STALE_THRESHOLD_MS = 6 * 60 * 60 * 1000; // 6 hours

export interface UserContextType {
  userData: UserFormData | null;
  setUserData: (data: UserFormData) => void;
  apiData: ProfileResponse | null;
  setApiData: (data: ProfileResponse | null) => void;
  clearUserData: () => void;
  isLoading: boolean;
  isStale: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = "kaal-user";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserFormData | null>(null);
  const [apiData, setApiDataState] = useState<ProfileResponse | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserDataState(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setIsLoading(false);
  }, []);

  function setUserData(data: UserFormData) {
    setUserDataState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function setApiData(data: ProfileResponse | null) {
    setApiDataState(data);
    setLastFetchedAt(data ? Date.now() : 0);
  }

  function clearUserData() {
    setUserDataState(null);
    setApiDataState(null);
    setLastFetchedAt(0);
    localStorage.removeItem(STORAGE_KEY);
  }

  const isStale = apiData !== null && lastFetchedAt > 0 && (Date.now() - lastFetchedAt) > STALE_THRESHOLD_MS;

  return (
    <UserContext.Provider value={{ userData, setUserData, apiData, setApiData, clearUserData, isLoading, isStale }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
