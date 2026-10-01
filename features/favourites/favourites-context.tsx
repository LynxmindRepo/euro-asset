"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Per-visitor convenience state: kept in this browser only (localStorage), never shared.
const STORAGE_KEY = "bridgeon.favourites";

type FavouritesContextValue = {
  /** Listing ids, most recently added first. */
  ids: string[];
  isFavourite: (id: string) => boolean;
  /** Adds or removes the listing; returns true when it is now a favourite. */
  toggleFavourite: (id: string) => boolean;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  // Empty on the server and first render; the saved list is applied after mount.
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setIds(saved.filter((item): item is string => typeof item === "string"));
    } catch {
      // Storage unavailable or corrupt — start with no favourites.
    }
  }, []);

  const toggleFavourite = useCallback(
    (id: string) => {
      const adding = !ids.includes(id);
      const next = adding ? [id, ...ids] : ids.filter((item) => item !== id);
      setIds(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // The list still works for this page session.
      }
      return adding;
    },
    [ids]
  );

  const value = useMemo(
    () => ({ ids, isFavourite: (id: string) => ids.includes(id), toggleFavourite }),
    [ids, toggleFavourite]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const value = useContext(FavouritesContext);
  if (!value) throw new Error("useFavourites must be used inside FavouritesProvider");
  return value;
}
