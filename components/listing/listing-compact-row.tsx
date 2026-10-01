"use client";

import { Listing } from "@/types";
import { ListingTitle } from "@/components/listing/listing-card";
import { StatusBadge } from "@/components/listing/status-badge";
import { getCategoryLabel, getPartner } from "@/lib/listing-helpers";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/utils";

export const compactColumns = "lg:grid-cols-[2fr_1fr_1.2fr_1fr_0.8fr]";

export function ListingCompactRow({ listing }: { listing: Listing }) {
  return (
    <article
      className={cn(
        "card-link grid gap-2 rounded-2xl bg-surface-lowest px-5 py-4 shadow-ambient tonal-rule transition hover:bg-surface-bright lg:items-center lg:gap-4",
        compactColumns
      )}
    >
      <div>
        <h3 className="font-semibold text-ink">
          <ListingTitle listing={listing} />
        </h3>
        <p className="text-sm text-muted">
          {listing.city}, {listing.country}
        </p>
      </div>
      <p className="text-sm text-muted">{getCategoryLabel(listing.categoryId)}</p>
      <p className="text-sm text-ink">{getPartner(listing.partnerId)?.name}</p>
      <div className="lg:text-right">
        <Price eur={listing.price} sold={listing.status === "sold"} className="font-semibold text-primary" />
      </div>
      <div className="lg:text-right">
        <StatusBadge status={listing.status} />
      </div>
    </article>
  );
}
