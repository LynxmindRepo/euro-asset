"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { ContactPanel } from "@/components/listing/contact-panel";
import { CostEstimator } from "@/components/listing/cost-estimator";
import { Gallery } from "@/components/listing/gallery";
import { ListingCard } from "@/components/listing/listing-card";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { useUnits } from "@/features/preferences/units-context";
import { getCategoryLabel, getOriginLabel } from "@/lib/listing-helpers";
import { formatDate, formatSpecValue } from "@/lib/utils";
import { Listing } from "@/types";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import { FavouriteButton } from "@/components/listing/favourite-button";
import { translateText } from "@/data/translations";
import { useLanguage } from "@/features/preferences/language-context";

/**
 * Seller text shown untouched. It is a component on purpose: <Localized> only translates strings it can see,
 * not the inside of components, so the original stays in English (marked with lang="en").
 */
function OriginalText({ text }: { text: string }) {
  return <span lang="en">{text}</span>;
}

export function ListingDetailClient({ listing: initial }: { listing: Listing }) {
  const { listings } = useMarketplace();
  // The page is pre-rendered from the initial data; use the in-session version so edits (price, status…) show up.
  const listing = listings.find((candidate) => candidate.id === initial.id) ?? initial;
  const { units } = useUnits();
  const { language } = useLanguage();
  const [showOriginal, setShowOriginal] = useState(false);
  // Only listings with a translation get the notice (session-created listings stay as written).
  const isTranslated = language !== "en" && translateText(listing.title, language) !== listing.title;
  const original = isTranslated && showOriginal;
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
              <p className="eyebrow">
                {getCategoryLabel(listing.categoryId)} · {getOriginLabel(listing.origin)}
              </p>
              <h1 className="page-title mt-3 text-[clamp(2rem,4vw,3rem)]">
                {original ? <OriginalText text={listing.title} /> : listing.title}
              </h1>
              <p className="mt-2 text-base text-muted">
                {listing.city}, {listing.region}, {listing.country} · Published {formatDate(listing.publishedAt)}
              </p>
              {isTranslated ? (
                <p className="mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-surface-low px-3.5 py-1.5 text-sm text-ink tonal-rule">
                  <SparkleIcon className="h-4 w-4 text-accent-ink" />
                  {original ? "Original text in English." : "Translated automatically from English."}
                  <button
                    type="button"
                    onClick={() => setShowOriginal((value) => !value)}
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    {original ? "Show translation" : "Show original"}
                  </button>
                </p>
              ) : null}
              <div className="mt-4">
                <FavouriteButton listing={listing} variant="full" />
              </div>
            </header>

            <section aria-labelledby="description-title">
              <h2 id="description-title" className="subsection-title text-2xl">
                Description
              </h2>
              <p className="body-copy mt-3 max-w-3xl">
                {original ? <OriginalText text={listing.description} /> : listing.description}
              </p>
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
                      <dd className="mt-1 font-semibold text-ink">{formatSpecValue(spec, units)}</dd>
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

            <CostEstimator listing={listing} />
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
