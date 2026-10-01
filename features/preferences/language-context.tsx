"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "fr" | "sv";

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "bridgeon-language";

function browserLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  const tag = navigator.language.toLowerCase();
  if (tag.startsWith("fr")) return "fr";
  if (tag.startsWith("sv")) return "sv";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "fr" || saved === "sv") {
        setLanguageState(saved);
        return;
      }
    } catch {
      // Storage may be unavailable in private browsing; use the browser language instead.
    }
    setLanguageState(browserLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Persist only explicit choices. Writing from an effect would store the "en" default on the first render,
  // before the saved value is read, and overwrite the visitor's choice.
  const value = useMemo(
    () => ({
      language,
      setLanguage: (next: Language) => {
        setLanguageState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // The preference still works for this page session when storage is unavailable.
        }
      }
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
