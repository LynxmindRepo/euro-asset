"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/feedback/toast-provider";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { ListingCriteria, matchesCriteria } from "@/lib/listing-filters";
import { Listing } from "@/types";

// Per-visitor convenience state: kept in this browser only (localStorage), never shared.
const SEARCHES_KEY = "bridgeon.savedSearches";
const LAST_SEARCH_KEY = "bridgeon.lastSearch";

export type SavedSearch = {
  id: string;
  criteria: ListingCriteria;
  createdAt: string;
  /** Listings published after this moment count as "new matches". */
  lastSeenAt: string;
  /** Simulated email alerts. */
  alerts: boolean;
};

type SavedSearchesContextValue = {
  searches: SavedSearch[];
  saveSearch: (criteria: ListingCriteria) => SavedSearch;
  removeSearch: (id: string) => void;
  toggleAlerts: (id: string) => void;
  markSeen: (id: string) => void;
  matchesFor: (search: SavedSearch) => Listing[];
  newMatchesFor: (search: SavedSearch) => Listing[];
  totalNew: number;
  /** Most recent catalogue search, used for recommendations when nothing is saved. */
  lastCriteria: ListingCriteria | null;
  setLastCriteria: (criteria: ListingCriteria) => void;
  isSaved: (criteria: ListingCriteria) => SavedSearch | undefined;
};

const SavedSearchesContext = createContext<SavedSearchesContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — the data just won't survive a reload.
  }
}

/** Two criteria are the same search if every field matches (empty / "all" count as unset). */
function sameCriteria(a: ListingCriteria, b: ListingCriteria) {
  const norm = (c: ListingCriteria) =>
    JSON.stringify({
      query: c.query?.trim().toLowerCase() || "",
      categoryId: c.categoryId && c.categoryId !== "all" ? c.categoryId : "",
      country: c.country && c.country !== "all" ? c.country : "",
      origin: c.origin && c.origin !== "all" ? c.origin : "",
      status: c.status && c.status !== "all" ? c.status : "",
      minEur: c.minEur ? Math.round(c.minEur) : 0,
      maxEur: c.maxEur ? Math.round(c.maxEur) : 0
    });
  return norm(a) === norm(b);
}

export function SavedSearchesProvider({ children }: { children: React.ReactNode }) {
  const { listings } = useMarketplace();
  const { pushToast } = useToast();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [lastCriteria, setLastCriteriaState] = useState<ListingCriteria | null>(null);
  const [loaded, setLoaded] = useState(false);
  const knownIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    setSearches(read<SavedSearch[]>(SEARCHES_KEY, []));
    setLastCriteriaState(read<ListingCriteria | null>(LAST_SEARCH_KEY, null));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) write(SEARCHES_KEY, searches);
  }, [searches, loaded]);

  // Simulated alerts: when a new listing appears (e.g. a partner imports one) and it matches a saved search, notify.
  useEffect(() => {
    if (!knownIds.current) {
      knownIds.current = new Set(listings.map((listing) => listing.id));
      return;
    }
    const added = listings.filter((listing) => !knownIds.current!.has(listing.id));
    added.forEach((listing) => knownIds.current!.add(listing.id));
    for (const listing of added) {
      const hit = searches.find((search) => search.alerts && matchesCriteria(listing, search.criteria));
      if (hit) {
        pushToast({ tone: "success", text: `New match for your saved search: "${listing.title}". (Email alert simulated.)` });
      }
    }
  }, [listings, searches, pushToast]);

  const value = useMemo<SavedSearchesContextValue>(() => {
    const matchesFor = (search: SavedSearch) => listings.filter((listing) => matchesCriteria(listing, search.criteria));
    const newMatchesFor = (search: SavedSearch) =>
      matchesFor(search).filter((listing) => new Date(listing.publishedAt) > new Date(search.lastSeenAt));

    return {
      searches,
      saveSearch: (criteria) => {
        const now = new Date().toISOString();
        const search: SavedSearch = { id: `search-${Date.now()}`, criteria, createdAt: now, lastSeenAt: now, alerts: true };
        setSearches((current) => [search, ...current]);
        return search;
      },
      removeSearch: (id) => setSearches((current) => current.filter((search) => search.id !== id)),
      toggleAlerts: (id) =>
        setSearches((current) => current.map((search) => (search.id === id ? { ...search, alerts: !search.alerts } : search))),
      markSeen: (id) =>
        setSearches((current) =>
          current.map((search) => (search.id === id ? { ...search, lastSeenAt: new Date().toISOString() } : search))
        ),
      matchesFor,
      newMatchesFor,
      totalNew: searches.reduce((sum, search) => sum + newMatchesFor(search).length, 0),
      lastCriteria,
      setLastCriteria: (criteria) => {
        setLastCriteriaState(criteria);
        write(LAST_SEARCH_KEY, criteria);
      },
      isSaved: (criteria) => searches.find((search) => sameCriteria(search.criteria, criteria))
    };
  }, [listings, searches, lastCriteria]);

  return <SavedSearchesContext.Provider value={value}>{children}</SavedSearchesContext.Provider>;
}

export function useSavedSearches() {
  const context = useContext(SavedSearchesContext);

  if (!context) {
    throw new Error("useSavedSearches must be used within SavedSearchesProvider");
  }

  return context;
}
