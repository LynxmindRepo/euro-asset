"use client";

import { useMemo } from "react";
import { CartItem } from "@/types";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { getCountryLabel, getSaleProcedureLabel } from "@/lib/auction-helpers";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function QuoteCartItemRow({ item }: { item: CartItem }) {
  const { auctions, removeCartItem, updateCartItem } = useMarketplace();
  const auction = useMemo(
    () => auctions.find((candidate) => candidate.id === item.auctionId),
    [auctions, item.auctionId]
  );

  if (!auction) {
    return null;
  }

  return (
    <article className="rounded-[1.75rem] bg-surface-lowest p-5 shadow-ambient">
      <div className="grid gap-5 lg:grid-cols-[160px_1fr_auto] lg:items-center">
        <img src={auction.images[0]} alt={auction.title} className="h-32 w-full rounded-2xl object-cover" />
        <div>
          <p className="institutional-kicker">
            {getCountryLabel(auction.country)} / {getSaleProcedureLabel(auction.saleProcedure)} / {auction.caseReference}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">
            {auction.title}
          </h3>
          <p className="mt-2 text-sm text-muted">
            Current reference: {formatCurrency(auction.currentBid)}
          </p>
          <p className="mt-1 text-sm text-muted">
            Jurisdiction: {auction.jurisdiction}
          </p>
        </div>
        <div className="grid gap-3 lg:min-w-56">
          <Input
            aria-label={`Edit proposal ${auction.title}`}
            value={String(item.amount)}
            onChange={(event) => updateCartItem(item.id, Number(event.target.value) || 0)}
          />
          <Button variant="ghost" onClick={() => removeCartItem(item.id)}>
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}
