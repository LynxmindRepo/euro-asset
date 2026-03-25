"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/auction/status-badge";
import { buttonStyles } from "@/components/ui/button";
import { getCategoryLabel, getCountryLabel, getSaleProcedureLabel } from "@/lib/auction-helpers";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";
import { Auction } from "@/types";

export function AuctionListRow({ auction }: { auction: Auction }) {
  const router = useRouter();

  function openProcess() {
    router.push(`/auctions/${auction.id}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProcess();
    }
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProcess}
      onKeyDown={handleKeyDown}
      className="panel-lg grid cursor-pointer gap-6 bg-surface-lowest shadow-panel tonal-rule transition hover:-translate-y-0.5 hover:bg-surface-bright focus:outline-none focus:ring-2 focus:ring-primary/30 lg:grid-cols-[248px_1fr_248px] lg:items-stretch"
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="h-52 w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.015] lg:h-full lg:min-h-[19.5rem]"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="institutional-kicker">{getCategoryLabel(auction.categoryId)}</span>
          <StatusBadge status={auction.status} className="min-w-[7.5rem] justify-center" />
          <span className="rounded-full bg-surface-tint px-3 py-1 text-xs text-muted">
            {getSaleProcedureLabel(auction.saleProcedure)}
          </span>
        </div>
        <h3 className="section-title mt-3">
          {auction.title}
        </h3>
        <p className="support-copy mt-2">
          {getCountryLabel(auction.country)} / {auction.location} / {auction.jurisdiction}
        </p>
        <p className="support-copy mt-4 max-w-3xl line-clamp-3">{auction.description}</p>
        <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-3">
          <div className="flex min-h-[7.25rem] flex-col justify-between rounded-2xl bg-surface-tint px-4 py-4 tonal-rule">
            <p className="institutional-kicker">Current value</p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-tertiary-ink">
              {formatCurrency(auction.currentBid)}
            </p>
          </div>
          <div className="flex min-h-[7.25rem] flex-col justify-between rounded-2xl bg-surface-legal px-4 py-4 tonal-rule">
            <p className="institutional-kicker">Reference</p>
            <p className="mt-2 font-medium text-ink">{auction.caseReference}</p>
          </div>
          <div className="flex min-h-[7.25rem] flex-col justify-between rounded-2xl bg-surface-low px-4 py-4 tonal-rule">
            <p className="institutional-kicker">Timing</p>
            <p className="mt-2 font-medium text-ink">{getTimeRemaining(auction.endDate)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <div className="rounded-2xl bg-surface-low px-4 py-4 tonal-rule">
          <p className="institutional-kicker">Responsible entity</p>
          <p className="mt-2 text-sm leading-6 text-ink">{auction.administratorEntity}</p>
        </div>
        <div className="rounded-2xl bg-surface-legal px-4 py-4 tonal-rule">
          <p className="institutional-kicker">Action</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Open the full process record and continue to proposal review.
          </p>
        </div>
        <Link
          href={`/auctions/${auction.id}`}
          onClick={(event) => event.stopPropagation()}
          className={buttonStyles("primary", "w-full no-underline")}
        >
          View process
        </Link>
      </div>
    </article>
  );
}
