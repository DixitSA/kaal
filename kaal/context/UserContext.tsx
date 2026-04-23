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

interface UserContextType {
  userData: UserFormData | null;
  setUserData: (data: UserFormData) => void;
  apiData: ProfileResponse | null;
  setApiData: (data: ProfileResponse | null) => void;
  clearUserData: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = "kaal-user";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserFormData | null>(null);
  const [apiData, setApiDataState] = useState<ProfileResponse | null>(null);
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
  }

  function clearUserData() {
    setUserDataState(null);
    setApiDataState(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <UserContext.Provider value={{ userData, setUserData, apiData, setApiData, clearUserData, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
