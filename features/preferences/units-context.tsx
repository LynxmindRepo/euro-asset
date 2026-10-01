"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UnitSystem } from "@/lib/utils";

const STORAGE_KEY = "bridgeon.units";

/** Browser languages that default to imperial units (miles, pounds, square feet). */
const imperialLanguages = new Set(["en-US", "en-GB"]);

type UnitsContextValue = {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
};

const UnitsContext = createContext<UnitsContextValue | null>(null);

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  // Metric on the server and first render; the saved/guessed preference is applied after mount.
  const [units, setUnitsState] = useState<UnitSystem>("metric");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — fall back to the browser language.
    }
    if (saved === "metric" || saved === "imperial") {
      setUnitsState(saved);
    } else if (imperialLanguages.has(navigator.language)) {
      setUnitsState("imperial");
    }
  }, []);

  const value = useMemo<UnitsContextValue>(
    () => ({
      units,
      setUnits: (next) => {
        setUnitsState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Ignore — the choice simply won't be remembered.
        }
      }
    }),
    [units]
  );

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits() {
  const context = useContext(UnitsContext);

  if (!context) {
    throw new Error("useUnits must be used within UnitsProvider");
  }

  return context;
}
