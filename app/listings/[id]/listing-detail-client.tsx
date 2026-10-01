"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { ContactPanel } from "@/components/listing/contact-panel";
import { Gallery } from "@/components/listing/gallery";
import { ListingCard } from "@/components/listing/listing-card";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getCategoryLabel, getOriginLabel } from "@/lib/listing-helpers";
import { formatDate, formatSpecValue } from "@/lib/utils";
import { Listing } from "@/types";

export function ListingDetailClient({ listing }: { listing: Listing }) {
  const { listings } = useMarketplace();
  const similar = listings
    .filter(
      (candidate) =>
        candidate.id !== listing.id && candidate.categoryId === listing.categoryId && candidate.status !== "sold"
    )
    .slice(0, 3);

  return (
    <PageShell>
      <div className="shell pb-20 pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/listings" className="text-primary">
                Listings
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/listings?category=${listing.categoryId}`} className="text-primary">
                {getCategoryLabel(listing.categoryId)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {listing.title}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <div className="grid gap-8">
            <Gallery images={listing.images} title={listing.title} />

            <header>
              <p className="institutional-kicker">
                {getCategoryLabel(listing.categoryId)} · {getOriginLabel(listing.origin)}
              </p>
              <h1 className="page-title mt-3 text-[clamp(2rem,4vw,3rem)]">{listing.title}</h1>
              <p className="mt-2 text-base text-muted">
                {listing.city}, {listing.region}, {listing.country} · Published {formatDate(listing.publishedAt)}
              </p>
            </header>

            <section aria-labelledby="description-title">
              <h2 id="description-title" className="subsection-title text-2xl">
                Description
              </h2>
              <p className="body-copy mt-3 max-w-3xl">{listing.description}</p>
            </section>

            {listing.specs.length > 0 ? (
              <section aria-labelledby="specs-title">
                <h2 id="specs-title" className="subsection-title text-2xl">
                  Specifications
                </h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {listing.specs.map((spec) => (
                    <div key={spec.label} className="rounded-2xl bg-surface-low px-4 py-3 tonal-rule">
                      <dt className="text-sm text-muted">{spec.label}</dt>
                      <dd className="mt-1 font-semibold text-ink">{formatSpecValue(spec)}</dd>
                    </div>
                  ))}
                  <div className="rounded-2xl bg-surface-low px-4 py-3 tonal-rule">
                    <dt className="text-sm text-muted">Re-registration</dt>
                    <dd className="mt-1 font-semibold text-ink">
                      {listing.requiresRegistration ? "Required in the buyer's country" : "Not required"}
                    </dd>
                  </div>
                </dl>
              </section>
            ) : null}

            {listing.highlights.length > 0 ? (
              <section aria-labelledby="highlights-title">
                <h2 id="highlights-title" className="subsection-title text-2xl">
                  Highlights
                </h2>
                <ul className="mt-4 grid gap-2">
                  {listing.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-base text-ink">
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <ContactPanel listing={listing} />
        </div>

        {similar.length > 0 ? (
          <section aria-labelledby="similar-title" className="mt-16">
            <h2 id="similar-title" className="section-title text-[clamp(1.8rem,3vw,2.4rem)]">
              Similar listings
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {similar.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
