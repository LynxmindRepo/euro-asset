"use client";

import Link from "next/link";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { BellIcon } from "@/components/ui/bell-icon";
import { buttonStyles } from "@/components/ui/button";
import { useCurrency } from "@/features/preferences/currency-context";
import { SavedSearch, useSavedSearches } from "@/features/saved-searches/saved-searches-context";
import { describeCriteria } from "@/lib/listing-filters";
import { hasStaticListingDetail } from "@/lib/site";
import { cn, formatDate } from "@/lib/utils";

function resultsHref(search: SavedSearch, rate: number) {
  const { criteria } = search;
  const params = new URLSearchParams();
  if (criteria.query?.trim()) params.set("q", criteria.query.trim());
  if (criteria.categoryId && criteria.categoryId !== "all") params.set("category", criteria.categoryId);
  if (criteria.country && criteria.country !== "all") params.set("country", criteria.country);
  if (criteria.origin && criteria.origin !== "all") params.set("origin", criteria.origin);
  if (criteria.status && criteria.status !== "all") params.set("status", criteria.status);
  // The catalogue's price fields are in the visitor's current currency.
  if (criteria.minEur) params.set("min", String(Math.round(criteria.minEur * rate)));
  if (criteria.maxEur) params.set("max", String(Math.round(criteria.maxEur * rate)));
  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}

export default function SavedSearchesPage() {
  const { searches, removeSearch, toggleAlerts, markSeen, matchesFor, newMatchesFor } = useSavedSearches();
  const { format, rate } = useCurrency();

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell max-w-5xl">
          <h1 className="page-title text-[clamp(2.2rem,4vw,3.2rem)]">Saved searches</h1>
          <p className="body-copy mt-3 max-w-2xl">
            Save a search from the catalogue and we&apos;ll tell you when a new match appears — less time searching, more
            time deciding. Saved in this browser only (demo).
          </p>

          <div className="mt-10">
            {searches.length === 0 ? (
              <EmptyState
                title="No saved searches yet"
                description='Filter the catalogue (category, country, price…) and press "Save this search".'
                href="/listings"
                cta="Start searching"
              />
            ) : (
              <ul className="grid gap-4">
                {searches.map((search) => {
                  const name = describeCriteria(search.criteria, format);
                  const matches = matchesFor(search);
                  const fresh = newMatchesFor(search);

                  return (
                    <li key={search.id} className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-display text-xl font-semibold text-ink">{name}</h2>
                            {fresh.length > 0 ? (
                              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                                {fresh.length} new
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-muted">
                            {`${matches.length} listing${matches.length === 1 ? "" : "s"} match · saved ${formatDate(search.createdAt)}`}
                          </p>
                          {fresh.length > 0 ? (
                            <ul aria-label="New matches" className="mt-3 grid gap-1 text-sm">
                              {fresh.map((listing) => (
                                <li key={listing.id} className="flex gap-2">
                                  <span aria-hidden="true" className="text-accent-ink">●</span>
                                  {hasStaticListingDetail(listing.id) ? (
                                    <Link href={`/listings/${listing.id}`} className="text-primary">
                                      {listing.title}
                                    </Link>
                                  ) : (
                                    <span className="text-ink">
                                      {listing.title} <span className="text-muted">(new this session)</span>
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={search.alerts}
                            onClick={() => toggleAlerts(search.id)}
                            className="inline-flex items-center gap-2 rounded-full px-1 py-1 text-sm text-ink"
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                                search.alerts ? "bg-primary" : "bg-muted"
                              )}
                            >
                              <span
                                className={cn(
                                  "inline-block h-5 w-5 rounded-full bg-white shadow transition",
                                  search.alerts ? "translate-x-5" : "translate-x-0.5"
                                )}
                              />
                            </span>
                            <BellIcon className="h-4 w-4" />
                            Email alerts
                          </button>
                          <Link
                            href={resultsHref(search, rate)}
                            onClick={() => markSeen(search.id)}
                            className={buttonStyles("accent", "px-5 py-2.5 no-underline")}
                          >
                            View results
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeSearch(search.id)}
                            aria-label={`Delete saved search: ${name}`}
                            className={buttonStyles("ghost", "px-4 py-2.5")}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
