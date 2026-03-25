"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Auction } from "@/types";
import { getCategoryLabel, getCountryLabel, getSaleProcedureLabel } from "@/lib/auction-helpers";
import { getAssetPath, hasStaticAuctionDetail } from "@/lib/site";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";
import { StatusBadge } from "@/components/auction/status-badge";
import { buttonStyles } from "@/components/ui/button";

function getProcedureTone(value: Auction["saleProcedure"]) {
  if (value === "insolvencia") return "bg-tertiary text-tertiary-ink";
  if (value === "venda-judicial") return "bg-primary text-white";
  if (value === "reestruturacao") return "bg-surface-high text-primary";
  return "bg-surface-low text-muted";
}

export function AuctionCard({ auction }: { auction: Auction }) {
  return <AuctionCardBase auction={auction} variant="stacked" />;
}

export function AuctionCardBase({
  auction,
  variant
}: {
  auction: Auction;
  variant: "stacked" | "split";
}) {
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

  if (variant === "split") {
    return (
      <article
        role={hasDetailPage ? "link" : undefined}
        tabIndex={hasDetailPage ? 0 : undefined}
        onClick={hasDetailPage ? openProcess : undefined}
        onKeyDown={hasDetailPage ? handleKeyDown : undefined}
        className={`group grid overflow-hidden rounded-[1.75rem] bg-surface-lowest shadow-panel tonal-rule transition hover:-translate-y-0.5 hover:bg-surface-bright focus:outline-none focus:ring-2 focus:ring-primary/30 md:grid-cols-[0.92fr_1.08fr] ${hasDetailPage ? "cursor-pointer" : ""}`}
      >
        <div className="overflow-hidden md:h-full">
          <img
            src={getAssetPath(auction.images[0])}
            alt={auction.title}
            className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02] md:h-full md:min-h-[28rem]"
          />
        </div>
        <div className="panel-lg flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="institutional-kicker">{getCategoryLabel(auction.categoryId)}</span>
            <StatusBadge status={auction.status} />
          </div>
          <h3 className="subsection-title mt-3 text-[1.85rem]">{auction.title}</h3>
          <p className="support-copy mt-2">
            {getCountryLabel(auction.country)} / {auction.location} / {auction.jurisdiction}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs ${getProcedureTone(auction.saleProcedure)}`}>
              {getSaleProcedureLabel(auction.saleProcedure)}
            </span>
            <span className="rounded-full bg-tertiary/60 px-3 py-1 text-xs text-tertiary-ink">
              {auction.caseReference}
            </span>
            <span className="rounded-full bg-surface-tint px-3 py-1 text-xs text-muted">
              {getCountryLabel(auction.country)}
            </span>
          </div>
          <div className="mt-10 grid gap-2">
            <p className="institutional-kicker">Current proposal</p>
            <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-tertiary-ink">
              {formatCurrency(auction.currentBid)}
            </p>
            <p className="text-sm text-muted">{getTimeRemaining(auction.endDate)}</p>
          </div>
          <p className="support-copy mt-4">Responsible entity: {auction.administratorEntity}</p>
          <div className="mt-6 flex gap-3 md:mt-auto">
            {hasDetailPage ? (
              <Link
                href={`/auctions/${auction.id}`}
                onClick={(event) => event.stopPropagation()}
                className={buttonStyles("primary", "w-full flex-1 no-underline")}
              >
                View process
              </Link>
            ) : (
              <span className="inline-flex w-full flex-1 items-center justify-center rounded-xl bg-surface-low px-4 py-3 text-sm text-muted tonal-rule">
                Session-only process
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      role={hasDetailPage ? "link" : undefined}
      tabIndex={hasDetailPage ? 0 : undefined}
      onClick={hasDetailPage ? openProcess : undefined}
      onKeyDown={hasDetailPage ? handleKeyDown : undefined}
      className={`group panel-lg flex h-full flex-col bg-surface-lowest shadow-panel tonal-rule transition hover:-translate-y-0.5 hover:bg-surface-bright focus:outline-none focus:ring-2 focus:ring-primary/30 ${hasDetailPage ? "cursor-pointer" : ""}`}
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          src={getAssetPath(auction.images[0])}
          alt={auction.title}
          className="h-64 w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="institutional-kicker">{getCategoryLabel(auction.categoryId)}</span>
        <StatusBadge status={auction.status} />
      </div>
      <h3 className="subsection-title mt-3 text-[1.85rem]">{auction.title}</h3>
      <p className="support-copy mt-2">
        {getCountryLabel(auction.country)} / {auction.location} / {auction.jurisdiction}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs ${getProcedureTone(auction.saleProcedure)}`}>
          {getSaleProcedureLabel(auction.saleProcedure)}
        </span>
        <span className="rounded-full bg-tertiary/60 px-3 py-1 text-xs text-tertiary-ink">
          {auction.caseReference}
        </span>
        <span className="rounded-full bg-surface-tint px-3 py-1 text-xs text-muted">
          {getCountryLabel(auction.country)}
        </span>
      </div>
      <div className="mt-10 grid gap-2">
        <p className="institutional-kicker">Current proposal</p>
        <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-tertiary-ink">
          {formatCurrency(auction.currentBid)}
        </p>
        <p className="text-sm text-muted">{getTimeRemaining(auction.endDate)}</p>
      </div>
      <div className="mt-auto pt-6">
        <p className="support-copy">Responsible entity: {auction.administratorEntity}</p>
        <div className="mt-6 flex gap-3">
          {hasDetailPage ? (
            <Link
              href={`/auctions/${auction.id}`}
              onClick={(event) => event.stopPropagation()}
              className={buttonStyles("primary", "w-full flex-1 no-underline")}
            >
              View process
            </Link>
          ) : (
            <span className="inline-flex w-full flex-1 items-center justify-center rounded-xl bg-surface-low px-4 py-3 text-sm text-muted tonal-rule">
              Session-only process
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
