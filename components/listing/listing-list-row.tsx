"use client";

import { Listing } from "@/types";
import { ListingTitle, PartnerLine, SessionOnlyNote } from "@/components/listing/listing-card";
import { StatusBadge } from "@/components/listing/status-badge";
import { getCategoryLabel, getOriginLabel } from "@/lib/listing-helpers";
import { getAssetPath, hasStaticListingDetail } from "@/lib/site";
import { Price } from "@/components/ui/price";
import { cn, formatPublished, formatSpecValue } from "@/lib/utils";

export function ListingListRow({ listing }: { listing: Listing }) {
  return (
    <article className="card-link group grid overflow-hidden rounded-[1.75rem] bg-surface-lowest shadow-panel tonal-rule transition hover:-translate-y-0.5 md:grid-cols-[280px_1fr]">
      <div className="relative overflow-hidden">
        <img
          src={getAssetPath(listing.images[0])}
          alt=""
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02] md:h-full"
        />
        {listing.status !== "available" ? (
          <StatusBadge status={listing.status} className="absolute left-4 top-4" />
        ) : null}
      </div>
      <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="institutional-kicker">
            {getCategoryLabel(listing.categoryId)} · {getOriginLabel(listing.origin)}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-snug tracking-[-0.03em] text-ink">
            <ListingTitle listing={listing} />
          </h3>
          <p className="mt-1 text-sm text-muted">
            {listing.city}, {listing.region}, {listing.country}
          </p>
          <p className="support-copy mt-3 line-clamp-2 max-w-2xl">{listing.description}</p>
          {listing.specs.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Key specifications">
              {listing.specs.slice(0, 4).map((spec) => (
                <li key={spec.label} className="rounded-full bg-surface-low px-3 py-1 text-xs text-ink">
                  <span className="text-muted">{spec.label}:</span> {formatSpecValue(spec)}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex flex-col justify-between gap-4 lg:min-w-52 lg:items-end lg:text-right">
          <Price
            eur={listing.price}
            sold={listing.status === "sold"}
            className="font-display text-3xl font-semibold tracking-[-0.03em] text-primary"
          />
          <div className="grid gap-1">
            <PartnerLine partnerId={listing.partnerId} />
            <p className="text-xs text-muted">Published {formatPublished(listing.publishedAt).toLowerCase()}</p>
          </div>
        </div>
        {!hasStaticListingDetail(listing.id) ? <SessionOnlyNote /> : null}
      </div>
    </article>
  );
}
