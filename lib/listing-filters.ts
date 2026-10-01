import { getCategoryLabel, getOriginLabel, getPartner, getStatusLabel } from "@/lib/listing-helpers";
import { Listing, ListingOrigin, ListingStatus } from "@/types";

/**
 * Search criteria shared by the catalogue filters, saved searches and recommendations.
 * Prices are always in EUR here (the catalogue converts the visitor's currency before calling).
 */
export type ListingCriteria = {
  query?: string;
  categoryId?: string;
  country?: string;
  origin?: string;
  status?: string;
  minEur?: number;
  maxEur?: number;
};

export function matchesCriteria(listing: Listing, criteria: ListingCriteria) {
  const query = (criteria.query ?? "").trim().toLowerCase();
  const matchesQuery =
    query.length === 0 ||
    [
      listing.title,
      listing.description,
      listing.city,
      listing.region,
      listing.country,
      getCategoryLabel(listing.categoryId),
      getPartner(listing.partnerId)?.name ?? ""
    ].some((field) => field.toLowerCase().includes(query));
  const is = (value: string | undefined, actual: string) => !value || value === "all" || value === actual;

  return (
    matchesQuery &&
    is(criteria.categoryId, listing.categoryId) &&
    is(criteria.country, listing.country) &&
    is(criteria.origin, listing.origin) &&
    is(criteria.status, listing.status) &&
    listing.price >= (criteria.minEur ?? 0) &&
    listing.price <= (criteria.maxEur ?? Number.POSITIVE_INFINITY)
  );
}

export function hasCriteria(criteria: ListingCriteria) {
  return Boolean(
    criteria.query?.trim() ||
      (criteria.categoryId && criteria.categoryId !== "all") ||
      (criteria.country && criteria.country !== "all") ||
      (criteria.origin && criteria.origin !== "all") ||
      (criteria.status && criteria.status !== "all") ||
      criteria.minEur ||
      criteria.maxEur
  );
}

/** Human-readable summary, e.g. `"truck" · Vehicles · in Sweden · under SEK 600,000`. */
export function describeCriteria(criteria: ListingCriteria, formatEur: (eur: number) => string) {
  const parts: string[] = [];
  if (criteria.query?.trim()) parts.push(`"${criteria.query.trim()}"`);
  if (criteria.categoryId && criteria.categoryId !== "all") parts.push(getCategoryLabel(criteria.categoryId));
  if (criteria.country && criteria.country !== "all") parts.push(`in ${criteria.country}`);
  if (criteria.origin && criteria.origin !== "all") parts.push(getOriginLabel(criteria.origin as ListingOrigin));
  if (criteria.status && criteria.status !== "all") parts.push(getStatusLabel(criteria.status as ListingStatus));
  if (criteria.minEur && criteria.maxEur) parts.push(`${formatEur(criteria.minEur)}–${formatEur(criteria.maxEur)}`);
  else if (criteria.minEur) parts.push(`from ${formatEur(criteria.minEur)}`);
  else if (criteria.maxEur) parts.push(`under ${formatEur(criteria.maxEur)}`);
  return parts.length > 0 ? parts.join(" · ") : "All listings";
}
