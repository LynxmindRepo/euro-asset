"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listing/listing-card";
import { buttonStyles } from "@/components/ui/button";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { useCurrency } from "@/features/preferences/currency-context";
import { useSavedSearches } from "@/features/saved-searches/saved-searches-context";
import { describeCriteria, hasCriteria, matchesCriteria } from "@/lib/listing-filters";
import { Listing } from "@/types";
import { Localized } from "@/components/ui/localized";

/** "Let matches come to you": listings surfaced from saved searches, or from the last search as a fallback. */
export function RecommendedListings({ limit = 3 }: { limit?: number }) {
  const { listings } = useMarketplace();
  const { searches, matchesFor, lastCriteria } = useSavedSearches();
  const { format } = useCurrency();

  let picks: Listing[] = [];
  let reason = "";

  if (searches.length > 0) {
    const seen = new Set<string>();
    picks = searches
      .flatMap((search) => matchesFor(search))
      .filter((listing) => listing.status !== "sold" && !seen.has(listing.id) && seen.add(listing.id));
    reason = `Because you saved “${describeCriteria(searches[0].criteria, format)}”${
      searches.length > 1 ? ` and ${searches.length - 1} other search${searches.length > 2 ? "es" : ""}` : ""
    }`;
  } else if (lastCriteria && hasCriteria(lastCriteria)) {
    picks = listings.filter((listing) => listing.status !== "sold" && matchesCriteria(listing, lastCriteria));
    // Too narrow? Keep only the broad part of the search (category / country).
    if (picks.length === 0) {
      picks = listings.filter(
        (listing) =>
          listing.status !== "sold" &&
          matchesCriteria(listing, { categoryId: lastCriteria.categoryId, country: lastCriteria.country })
      );
    }
    reason = `Based on your last search: ${describeCriteria(lastCriteria, format)}`;
  }

  if (picks.length === 0) return null;

  const shown = [...picks]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

  return (
    <Localized><section aria-labelledby="recommended-title" className="pb-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="recommended-title" className="section-title flex items-center gap-3 text-[clamp(1.8rem,3vw,2.5rem)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
                <SparkleIcon className="h-5 w-5" />
              </span>
              Recommended for you
            </h2>
            <p className="mt-2 text-sm text-muted">{reason}</p>
          </div>
          <Link href={searches.length > 0 ? "/saved" : "/listings"} className={buttonStyles("secondary", "no-underline")}>
            {searches.length > 0 ? "Manage saved searches" : "Refine your search"}
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section></Localized>
  );
}
