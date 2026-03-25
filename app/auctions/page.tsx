"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuctionCompactRow } from "@/components/auction/auction-compact-row";
import { AuctionCard } from "@/components/auction/auction-card";
import { AuctionFilters } from "@/components/auction/filters";
import { AuctionListRow } from "@/components/auction/auction-list-row";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Select } from "@/components/ui/select";
import { useAuctionFilters } from "@/features/auctions/use-auction-filters";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/features/cart/marketplace-store";

export default function AuctionsPage() {
  const { auctions } = useMarketplace();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialView = (searchParams.get("view") as "grid" | "list" | "compact" | null) ?? "list";
  const filters = useAuctionFilters(auctions, {
    query: searchParams.get("q") ?? "",
    categoryId: searchParams.get("category") ?? "all",
    status: searchParams.get("status") ?? "all",
    country: searchParams.get("country") ?? "all",
    procedure: searchParams.get("procedure") ?? "all",
    sortBy: searchParams.get("sort") ?? "latest"
  });
  const [view, setView] = useState<"grid" | "list" | "compact">(initialView);
  const [visibleCount, setVisibleCount] = useState(5);

  const pageSize = useMemo(() => {
    if (view === "compact") return 10;
    if (view === "list") return 5;
    return 6;
  }, [view]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [
    pageSize,
    filters.query,
    filters.categoryId,
    filters.status,
    filters.country,
    filters.procedure,
    filters.sortBy
  ]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.query) params.set("q", filters.query);
    if (filters.categoryId !== "all") params.set("category", filters.categoryId);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.country !== "all") params.set("country", filters.country);
    if (filters.procedure !== "all") params.set("procedure", filters.procedure);
    if (filters.sortBy !== "latest") params.set("sort", filters.sortBy);
    if (view !== "list") params.set("view", view);

    const next = params.toString();
    const current = searchParams.toString();

    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [
    filters.categoryId,
    filters.country,
    filters.procedure,
    filters.query,
    filters.sortBy,
    filters.status,
    pathname,
    router,
    searchParams,
    view
  ]);

  const visibleAuctions = filters.filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filters.filtered.length;

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell">
          <p className="institutional-kicker">European processes and assets</p>
          <h1 className="page-title mt-3 max-w-4xl">
            Opportunities arising from insolvency, liquidation, restructuring, and judicial sales.
          </h1>
          <p className="body-copy mt-5 max-w-3xl">
            The listing is designed to foreground process origin, jurisdiction, responsible parties,
            and proposal-readiness for industrial buyers and cross-border traders.
          </p>
          <div className="mt-10">
            <AuctionFilters {...filters} />
          </div>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="panel-lg bg-surface-lowest shadow-ambient tonal-rule">
              <p className="institutional-kicker">Catalogue reading</p>
              <p className="support-copy mt-2">
                Showing {Math.min(visibleCount, filters.filtered.length)} of {filters.filtered.length} process
                {filters.filtered.length === 1 ? "" : "es"}.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-48 rounded-2xl bg-surface-low p-1 tonal-rule">
                <Select
                  value={filters.sortBy}
                  onChange={(event) => filters.setSortBy(event.target.value)}
                  className="h-10 bg-transparent"
                >
                  <option value="latest">Latest</option>
                  <option value="highest-value">Highest value</option>
                  <option value="closing-soon">Closing soon</option>
                  <option value="alphabetical">Alphabetical</option>
                </Select>
              </div>
              <div className="rounded-2xl bg-surface-low p-1 tonal-rule">
                {[
                  { id: "grid", label: "Grid" },
                  { id: "list", label: "List" },
                  { id: "compact", label: "Compact" }
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setView(option.id as "grid" | "list" | "compact")}
                    className={cn(
                      "h-10 rounded-xl px-4 py-2 text-sm font-medium transition",
                      view === option.id
                        ? "bg-midnight-gradient text-white shadow-ambient"
                        : "text-muted hover:bg-surface-high hover:text-primary"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10">
            {filters.filtered.length === 0 ? (
              <EmptyState
                title="No matching processes found"
                description="Adjust the filters by country, procedure, or case reference to recover opportunities in this demo."
              />
            ) : (
              <>
                {view === "grid" ? (
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {visibleAuctions.map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : null}
                {view === "list" ? (
                  <div className="grid gap-5">
                    {visibleAuctions.map((auction) => (
                      <AuctionListRow key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : null}
                {view === "compact" ? (
                  <div className="grid gap-3">
                    <div className="hidden rounded-2xl bg-surface-tint px-4 py-4 tonal-rule lg:grid lg:grid-cols-[1.7fr_1.15fr_0.85fr_0.95fr_0.95fr_0.9fr] lg:items-center">
                      <p className="institutional-kicker">Asset</p>
                      <p className="institutional-kicker">Case / procedure</p>
                      <p className="institutional-kicker">Status</p>
                      <p className="institutional-kicker">Current proposal</p>
                      <p className="institutional-kicker">Timing / entity</p>
                      <p className="institutional-kicker text-right">Action</p>
                    </div>
                    {visibleAuctions.map((auction) => (
                      <AuctionCompactRow key={auction.id} auction={auction} />
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
                      Load more processes
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
