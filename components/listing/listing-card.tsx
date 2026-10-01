"use client";

import Link from "next/link";
import { Listing } from "@/types";
import { StatusBadge } from "@/components/listing/status-badge";
import { getCategoryLabel, getPartner } from "@/lib/listing-helpers";
import { getAssetPath, hasStaticListingDetail } from "@/lib/site";
import { Price } from "@/components/ui/price";
import { useUnits } from "@/features/preferences/units-context";
import { cn, formatPublished, formatSpecShort } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";
import { FavouriteButton } from "@/components/listing/favourite-button";

export function ListingTitle({ listing, className }: { listing: Listing; className?: string }) {
  if (!hasStaticListingDetail(listing.id)) {
    return <Localized><span className={className}>{listing.title}</span></Localized>;
  }

  return (
    <Localized><Link href={`/listings/${listing.id}`} className={cn("card-link-target no-underline hover:underline", className)}>
      {listing.title}
    </Link></Localized>
  );
}

export function SessionOnlyNote() {
  return <Localized><p className="mt-3 text-xs text-muted">Created in this session — no detail page in the static demo.</p></Localized>;
}

export function PartnerLine({ partnerId }: { partnerId: string }) {
  const partner = getPartner(partnerId);

  if (!partner) return null;

  return (
    <Localized><p className="text-sm text-muted">
      Sold by <span className="font-medium text-ink">{partner.name}</span>
      {partner.verified ? <span className="ml-1 text-success-ink">✓ Verified</span> : null}
    </p></Localized>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  const { units } = useUnits();

  return (
    <Localized><article className="card-link group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface-lowest shadow-panel tonal-rule transition hover:-translate-y-0.5">
      <div className="relative overflow-hidden">
        <img
          src={getAssetPath(listing.images[0])}
          alt=""
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        {listing.status !== "available" ? (
          <StatusBadge status={listing.status} className="absolute left-4 top-4" />
        ) : null}
        {/* Sits above the card's stretched title link (z-10), so it is a separate control, not nested in the link. */}
        <FavouriteButton listing={listing} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{getCategoryLabel(listing.categoryId)}</p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-ink">
          <ListingTitle listing={listing} />
        </h3>
        <p className="mt-1 text-sm text-muted">
          {listing.city}, {listing.country}
        </p>
        <div className="mt-4">
          <Price
            eur={listing.price}
            sold={listing.status === "sold"}
            className="font-display text-2xl font-semibold tracking-[-0.03em] text-primary"
          />
        </div>
        {listing.specs.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Key specifications">
            {listing.specs.slice(0, 3).map((spec) => (
              <li key={spec.label} className="rounded-full bg-surface-low px-3 py-1 text-xs text-ink">
                <span className="sr-only">{spec.label}: </span>
                {formatSpecShort(spec, units)}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-5">
          <PartnerLine partnerId={listing.partnerId} />
          <p className="text-xs text-muted">{formatPublished(listing.publishedAt)}</p>
        </div>
        {!hasStaticListingDetail(listing.id) ? <SessionOnlyNote /> : null}
      </div>
    </article></Localized>
  );
}
