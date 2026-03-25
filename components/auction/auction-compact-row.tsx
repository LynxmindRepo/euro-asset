"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/auction/status-badge";
import { getCountryLabel, getSaleProcedureLabel } from "@/lib/auction-helpers";
import { hasStaticAuctionDetail } from "@/lib/site";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";
import { Auction } from "@/types";

export function AuctionCompactRow({ auction }: { auction: Auction }) {
  const router = useRouter();
  const hasDetailPage = hasStaticAuctionDetail(auction.id);

  function openProcess() {
    if (!hasDetailPage) {
      return;
    }

    router.push(`/auctions/${auction.id}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProcess();
    }
  }

  return (
    <div
      role={hasDetailPage ? "link" : undefined}
      tabIndex={hasDetailPage ? 0 : undefined}
      onClick={hasDetailPage ? openProcess : undefined}
      onKeyDown={hasDetailPage ? handleKeyDown : undefined}
      className={`grid gap-4 rounded-2xl bg-surface-lowest px-4 py-4 shadow-ambient tonal-rule transition hover:bg-surface-bright focus:outline-none focus:ring-2 focus:ring-primary/30 lg:grid-cols-[1.7fr_1.15fr_0.85fr_0.95fr_0.95fr_0.9fr] lg:items-center ${hasDetailPage ? "cursor-pointer" : ""}`}
    >
      <div className="min-w-0">
        <p className="truncate font-display text-[1.2rem] font-semibold tracking-[-0.03em] text-ink">
          {auction.title}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
          <span>{getCountryLabel(auction.country)}</span>
          <span>{auction.location}</span>
          <span className="hidden xl:inline">{auction.jurisdiction}</span>
        </div>
      </div>
      <div className="min-w-0 self-start text-sm text-muted lg:self-center">
        <p className="font-medium text-ink">{auction.caseReference}</p>
        <p className="mt-1 truncate">{getSaleProcedureLabel(auction.saleProcedure)}</p>
      </div>
      <div className="self-start lg:flex lg:min-h-10 lg:items-center">
        <StatusBadge status={auction.status} className="min-w-[7.5rem] justify-center" />
      </div>
      <div className="self-start text-sm lg:self-center">
        <p className="font-semibold text-ink">{formatCurrency(auction.currentBid)}</p>
        <p className="mt-1 text-xs text-muted">Current proposal</p>
      </div>
      <div className="self-start text-sm text-muted lg:flex lg:min-h-[2.75rem] lg:min-w-[10.5rem] lg:flex-col lg:justify-center">
        <p className="font-medium text-ink">{getTimeRemaining(auction.endDate)}</p>
        <p className="mt-1 truncate">{auction.administratorEntity}</p>
      </div>
      {hasDetailPage ? (
        <Link
          href={`/auctions/${auction.id}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-surface-low px-4 py-2 text-sm font-medium text-primary tonal-rule no-underline transition hover:bg-surface-tint lg:justify-self-end"
        >
          View process
        </Link>
      ) : (
        <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-surface-low px-4 py-2 text-sm text-muted tonal-rule lg:justify-self-end">
          Session-only process
        </span>
      )}
    </div>
  );
}
