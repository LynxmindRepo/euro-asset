"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buyerCountries, languageCountry } from "@/data/cost-rates";
import { eurRates } from "@/data/currencies";
import { formatCurrency } from "@/lib/utils";

const STORAGE_KEY = "bridgeon.currency";

type CurrencyContextValue = {
  /** Currency the visitor wants to see prices in. Listings are always priced in EUR by the seller. */
  currency: string;
  setCurrency: (code: string) => void;
  rate: number;
  convert: (eur: number) => number;
  /** Format an EUR amount in the visitor's currency. */
  format: (eur: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function guessCurrency(language: string | undefined) {
  if (!language) return "EUR";
  const country = languageCountry[language] ?? languageCountry[language.split("-")[0]];
  return buyerCountries.find((item) => item.name === country)?.currency ?? "EUR";
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Server render and first client render use EUR; the saved/guessed currency is applied after mount.
  const [currency, setCurrencyState] = useState("EUR");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies) — fall back to the browser language.
    }
    const initial = saved && eurRates[saved] ? saved : guessCurrency(navigator.language);
    setCurrencyState(initial);
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const rate = eurRates[currency] ?? 1;

    return {
      currency,
      rate,
      setCurrency: (code) => {
        if (!eurRates[code]) return;
        setCurrencyState(code);
        try {
          window.localStorage.setItem(STORAGE_KEY, code);
        } catch {
          // Ignore — the choice simply won't be remembered.
        }
      },
      convert: (eur) => eur * rate,
      format: (eur) => formatCurrency(eur * rate, currency)
    };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
}
