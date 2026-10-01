"use client";

import Link from "next/link";
import { Hero } from "@/components/hero";
import { PageShell } from "@/components/layout/page-shell";
import { ListingCard } from "@/components/listing/listing-card";
import { buttonStyles } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getLatestListings } from "@/lib/listing-helpers";

const steps = [
  {
    title: "Search once",
    text: "One search across every country we cover — filter by category, location and price."
  },
  {
    title: "Contact the seller",
    text: "Every listing comes from a professional Disposal Partner. Message them directly from the listing."
  },
  {
    title: "Buy directly",
    text: "Agree the deal with the seller — no middleman, no added markup."
  }
];

export default function HomePage() {
  const { listings } = useMarketplace();
  const latest = getLatestListings(listings, 6);

  return (
    <PageShell>
      <Hero />

      <section aria-labelledby="categories-title" className="pb-20">
        <div className="shell">
          <h2 id="categories-title" className="section-title text-[clamp(1.8rem,3vw,2.5rem)]">
            Browse by category
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = listings.filter(
                (listing) => listing.categoryId === category.id && listing.status !== "sold"
              ).length;

              return (
                <li key={category.id} className="card-link rounded-[1.5rem] bg-surface-lowest p-5 shadow-ambient tonal-rule transition hover:-translate-y-0.5">
                  <Link
                    href={`/listings?category=${category.id}`}
                    className="card-link-target font-display text-xl font-semibold text-ink no-underline"
                  >
                    {category.label}
                  </Link>
                  <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                  <p className="mt-3 text-sm font-semibold text-primary">
                    {count} listing{count === 1 ? "" : "s"}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="latest-title" className="section-space surface-mid">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="latest-title" className="section-title text-[clamp(1.8rem,3vw,2.5rem)]">
              Latest listings
            </h2>
            <Link href="/listings" className={buttonStyles("secondary", "no-underline")}>
              See all listings
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {latest.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-title" className="section-space scroll-mt-28">
        <div className="shell">
          <h2 id="how-title" className="section-title text-[clamp(1.8rem,3vw,2.5rem)]">
            How it works
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-[1.5rem] bg-surface-low p-6 tonal-rule">
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold text-primary"
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
