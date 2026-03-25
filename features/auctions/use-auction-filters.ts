"use client";

import { useMemo, useState } from "react";
import { Auction } from "@/types";

type FilterState = {
  query?: string;
  categoryId?: string;
  status?: string;
  country?: string;
  procedure?: string;
  sortBy?: string;
};

export function useAuctionFilters(auctions: Auction[], initialState?: FilterState) {
  const [query, setQuery] = useState(initialState?.query ?? "");
  const [categoryId, setCategoryId] = useState(initialState?.categoryId ?? "all");
  const [status, setStatus] = useState(initialState?.status ?? "all");
  const [country, setCountry] = useState(initialState?.country ?? "all");
  const [procedure, setProcedure] = useState(initialState?.procedure ?? "all");
  const [sortBy, setSortBy] = useState(initialState?.sortBy ?? "latest");

  const filtered = useMemo(() => {
    const result = auctions.filter((auction) => {
      const normalizedQuery = query.toLowerCase();
      const matchesQuery =
        query.length === 0 ||
        auction.title.toLowerCase().includes(normalizedQuery) ||
        auction.location.toLowerCase().includes(normalizedQuery) ||
        auction.region.toLowerCase().includes(normalizedQuery) ||
        auction.country.toLowerCase().includes(normalizedQuery) ||
        auction.caseReference.toLowerCase().includes(normalizedQuery) ||
        auction.administratorEntity.toLowerCase().includes(normalizedQuery);

      const matchesCategory = categoryId === "all" || auction.categoryId === categoryId;
      const matchesStatus = status === "all" || auction.status === status;
      const matchesCountry = country === "all" || auction.country === country;
      const matchesProcedure = procedure === "all" || auction.saleProcedure === procedure;

      return matchesQuery && matchesCategory && matchesStatus && matchesCountry && matchesProcedure;
    });

    return result.sort((left, right) => {
      if (sortBy === "highest-value") {
        return right.currentBid - left.currentBid;
      }

      if (sortBy === "closing-soon") {
        return new Date(left.endDate).getTime() - new Date(right.endDate).getTime();
      }

      if (sortBy === "alphabetical") {
        return left.title.localeCompare(right.title);
      }

      return new Date(right.startDate).getTime() - new Date(left.startDate).getTime();
    });
  }, [auctions, categoryId, country, procedure, query, sortBy, status]);

  return {
    query,
    categoryId,
    status,
    country,
    procedure,
    sortBy,
    filtered,
    setQuery,
    setCategoryId,
    setStatus,
    setCountry,
    setProcedure,
    setSortBy
  };
}
