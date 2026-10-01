"use client";

import { useMemo, useState } from "react";
import { ListingCriteria, matchesCriteria } from "@/lib/listing-filters";
import { Listing } from "@/types";

export type ListingFilterState = {
  query?: string;
  categoryId?: string;
  country?: string;
  origin?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
};

/** `rate` converts EUR to the visitor's currency: min/max price are typed in that currency. */
export function useListingFilters(listings: Listing[], initialState?: ListingFilterState, rate = 1) {
  const [query, setQuery] = useState(initialState?.query ?? "");
  const [categoryId, setCategoryId] = useState(initialState?.categoryId ?? "all");
  const [country, setCountry] = useState(initialState?.country ?? "all");
  const [origin, setOrigin] = useState(initialState?.origin ?? "all");
  const [status, setStatus] = useState(initialState?.status ?? "all");
  const [minPrice, setMinPrice] = useState(initialState?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialState?.maxPrice ?? "");
  const [sortBy, setSortBy] = useState(initialState?.sortBy ?? "latest");

  // Criteria in EUR (min/max are typed in the visitor's currency) — shared with saved searches.
  const criteria = useMemo<ListingCriteria>(
    () => ({
      query,
      categoryId,
      country,
      origin,
      status,
      minEur: Number(minPrice) ? Number(minPrice) / rate : undefined,
      maxEur: Number(maxPrice) ? Number(maxPrice) / rate : undefined
    }),
    [query, categoryId, country, origin, status, minPrice, maxPrice, rate]
  );

  const filtered = useMemo(() => {
    const result = listings.filter((listing) => matchesCriteria(listing, criteria));

    return result.sort((left, right) => {
      if (sortBy === "price-asc") return left.price - right.price;
      if (sortBy === "price-desc") return right.price - left.price;
      if (sortBy === "alphabetical") return left.title.localeCompare(right.title);
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    });
  }, [listings, criteria, sortBy]);

  function clearFilters() {
    setQuery("");
    setCategoryId("all");
    setCountry("all");
    setOrigin("all");
    setStatus("all");
    setMinPrice("");
    setMaxPrice("");
  }

  const activeCount =
    (query ? 1 : 0) +
    (categoryId !== "all" ? 1 : 0) +
    (country !== "all" ? 1 : 0) +
    (origin !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  return {
    query,
    categoryId,
    country,
    origin,
    status,
    minPrice,
    maxPrice,
    sortBy,
    filtered,
    criteria,
    activeCount,
    setQuery,
    setCategoryId,
    setCountry,
    setOrigin,
    setStatus,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    clearFilters
  };
}

export type ListingFilters = ReturnType<typeof useListingFilters>;
