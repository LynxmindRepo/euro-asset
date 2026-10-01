"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { ListingCard } from "@/components/listing/listing-card";
import { compactColumns, ListingCompactRow } from "@/components/listing/listing-compact-row";
import { ListingFilters } from "@/components/listing/filters";
import { ListingListRow } from "@/components/listing/listing-list-row";
import { Select } from "@/components/ui/select";
import { useListingFilters } from "@/features/listings/use-listing-filters";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getListingCountries } from "@/lib/listing-helpers";
import { cn } from "@/lib/utils";

type View = "grid" | "list" | "compact";

const views: { id: View; label: string }[] = [
  { id: "grid", label: "Grid" },
  { id: "list", label: "List" },
  { id: "compact", label: "Compact" }
];

export default function ListingsPage() {
  const { listings } = useMarketplace();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useListingFilters(listings, {
    query: searchParams.get("q") ?? "",
    categoryId: searchParams.get("category") ?? "all",
    country: searchParams.get("country") ?? "all",
    origin: searchParams.get("origin") ?? "all",
    status: searchParams.get("status") ?? "all",
    minPrice: searchParams.get("min") ?? "",
    maxPrice: searchParams.get("max") ?? "",
    sortBy: searchParams.get("sort") ?? "latest"
  });
  const [view, setView] = useState<View>((searchParams.get("view") as View | null) ?? "grid");
  const pageSize = useMemo(() => (view === "compact" ? 12 : view === "list" ? 6 : 9), [view]);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const countries = useMemo(() => getListingCountries(listings), [listings]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [
    pageSize,
    filters.query,
    filters.categoryId,
    filters.country,
    filters.origin,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy
  ]);

  // Keep the URL in sync so a search can be shared or reopened.
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.query) params.set("q", filters.query);
    if (filters.categoryId !== "all") params.set("category", filters.categoryId);
    if (filters.country !== "all") params.set("country", filters.country);
    if (filters.origin !== "all") params.set("origin", filters.origin);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.minPrice) params.set("min", filters.minPrice);
    if (filters.maxPrice) params.set("max", filters.maxPrice);
    if (filters.sortBy !== "latest") params.set("sort", filters.sortBy);
    if (view !== "grid") params.set("view", view);

    const next = params.toString();

    if (next !== searchParams.toString()) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [
    filters.query,
    filters.categoryId,
    filters.country,
    filters.origin,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
    pathname,
    router,
    searchParams,
    view
  ]);

  const visibleListings = filters.filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filters.filtered.length;
  const total = filters.filtered.length;

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell">
          <p className="institutional-kicker">Listings across Europe</p>
          <h1 className="page-title mt-3 max-w-4xl text-[clamp(2.3rem,4vw,3.4rem)]">
            Insolvency assets from professional sellers, in one search.
          </h1>
          <p className="body-copy mt-4 max-w-3xl">
            Vehicles, machinery, real estate, stock and more — listed by verified Disposal Partners and ready to buy
            directly from the seller.
          </p>

          <div className="mt-10">
            <ListingFilters filters={filters} countries={countries} />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted" role="status" aria-live="polite">
              <span className="font-semibold text-ink">{total}</span> listing{total === 1 ? "" : "s"} found
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="whitespace-nowrap text-sm text-muted">
                  Sort by
                </label>
                <Select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={(event) => filters.setSortBy(event.target.value)}
                  className="h-10 min-w-48 py-2"
                >
                  <option value="latest">Newest first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="alphabetical">Alphabetical</option>
                </Select>
              </div>
              <div role="group" aria-label="View" className="flex rounded-2xl bg-surface-low p-1 tonal-rule">
                {views.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={view === option.id}
                    onClick={() => setView(option.id)}
                    className={cn(
                      "h-9 rounded-xl px-4 text-sm font-medium transition",
                      view === option.id ? "bg-primary text-white" : "text-muted hover:bg-surface-high hover:text-primary"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {total === 0 ? (
              <EmptyState
                title="No listings match your search"
                description="Try another category or country, widen the price range, or clear the filters."
              />
            ) : (
              <>
                {view === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : null}
                {view === "list" ? (
                  <div className="grid gap-5">
                    {visibleListings.map((listing) => (
                      <ListingListRow key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : null}
                {view === "compact" ? (
                  <div className="grid gap-3">
                    <div
                      aria-hidden="true"
                      className={cn("hidden rounded-2xl bg-surface-tint px-5 py-3 lg:grid lg:gap-4", compactColumns)}
                    >
                      <p className="institutional-kicker">Asset</p>
                      <p className="institutional-kicker">Category</p>
                      <p className="institutional-kicker">Seller</p>
                      <p className="institutional-kicker text-right">Price</p>
                      <p className="institutional-kicker text-right">Status</p>
                    </div>
                    {visibleListings.map((listing) => (
                      <ListingCompactRow key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : null}
                {hasMore ? (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((current) => current + pageSize)}
                      className="rounded-2xl bg-surface-low px-6 py-3 text-sm font-semibold text-primary tonal-rule transition hover:bg-surface-tint"
                    >
                      Show more listings
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
