"use client";

import { useMemo, useState } from "react";
import { getCategoryLabel, getPartner } from "@/lib/listing-helpers";
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

export function useListingFilters(listings: Listing[], initialState?: ListingFilterState) {
  const [query, setQuery] = useState(initialState?.query ?? "");
  const [categoryId, setCategoryId] = useState(initialState?.categoryId ?? "all");
  const [country, setCountry] = useState(initialState?.country ?? "all");
  const [origin, setOrigin] = useState(initialState?.origin ?? "all");
  const [status, setStatus] = useState(initialState?.status ?? "all");
  const [minPrice, setMinPrice] = useState(initialState?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialState?.maxPrice ?? "");
  const [sortBy, setSortBy] = useState(initialState?.sortBy ?? "latest");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Number.POSITIVE_INFINITY;

    const result = listings.filter((listing) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          listing.title,
          listing.city,
          listing.region,
          listing.country,
          getCategoryLabel(listing.categoryId),
          getPartner(listing.partnerId)?.name ?? ""
        ].some((field) => field.toLowerCase().includes(normalizedQuery));

      return (
        matchesQuery &&
        (categoryId === "all" || listing.categoryId === categoryId) &&
        (country === "all" || listing.country === country) &&
        (origin === "all" || listing.origin === origin) &&
        (status === "all" || listing.status === status) &&
        listing.price >= min &&
        listing.price <= max
      );
    });

    return result.sort((left, right) => {
      if (sortBy === "price-asc") return left.price - right.price;
      if (sortBy === "price-desc") return right.price - left.price;
      if (sortBy === "alphabetical") return left.title.localeCompare(right.title);
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    });
  }, [listings, query, categoryId, country, origin, status, minPrice, maxPrice, sortBy]);

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
