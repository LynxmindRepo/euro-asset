"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { setFormatLanguage } from "@/lib/utils";

export type Language = "en" | "fr" | "sv";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Applies the saved (or browser) language once; called by <LanguageRestorer> after the page has hydrated. */
  restoreLanguage: () => void;
};

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
  // Formatters read the language synchronously, before the children of this render are formatted.
  setFormatLanguage(language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Persist only explicit choices. Writing from an effect would store the "en" default on the first render,
  // before the saved value is read, and overwrite the visitor's choice.
  const value = useMemo(
    () => ({
      language,
      restoreLanguage: () => {
        let next: Language = browserLanguage();
        try {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          if (saved === "en" || saved === "fr" || saved === "sv") next = saved;
        } catch {
          // Storage may be unavailable in private browsing; use the browser language instead.
        }
        setLanguageState(next);
      },
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

let restored = false;

/**
 * Restores the visitor's language. Rendered by PageShell, i.e. inside the page's Suspense boundary, so its effect
 * runs only once the page has hydrated. Switching earlier (from the provider) would let the page hydrate with the
 * new language's number/date formats (`setFormatLanguage` is module state) while the server HTML is in English.
 */
export function LanguageRestorer() {
  const { restoreLanguage } = useLanguage();
  useEffect(() => {
    if (restored) return;
    restored = true;
    restoreLanguage();
  }, [restoreLanguage]);
  return null;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
