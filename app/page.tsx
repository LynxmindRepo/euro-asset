"use client";

import Link from "next/link";
import { Hero } from "@/components/hero";
import { PageShell } from "@/components/layout/page-shell";
import { CategoryIcon } from "@/components/listing/category-icon";
import { ListingCard } from "@/components/listing/listing-card";
import { buttonStyles } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getLatestListings } from "@/lib/listing-helpers";

const buyerSteps = [
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

const sellerPoints = [
  "Register once, reach buyers in every country we cover",
  "List in minutes with the information you already have",
  "Translated automatically for international buyers"
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
                <li
                  key={category.id}
                  className="card-link flex gap-4 rounded-[1.5rem] bg-surface-lowest p-5 shadow-ambient tonal-rule transition hover:-translate-y-0.5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-accent">
                    <CategoryIcon categoryId={category.id} className="h-6 w-6" />
                  </span>
                  <div>
                    <Link
                      href={`/listings?category=${category.id}`}
                      className="card-link-target font-display text-lg font-semibold text-ink no-underline"
                    >
                      {category.label}
                    </Link>
                    <p className="mt-1 text-sm leading-6 text-muted">{category.description}</p>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {count} listing{count === 1 ? "" : "s"}
                    </p>
                  </div>
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="how-title" className="section-title text-[clamp(1.8rem,3vw,2.5rem)]">
              How buying works
            </h2>
            <Link href="/buyers" className={buttonStyles("secondary", "no-underline")}>
              Why buyers choose us
            </Link>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {buyerSteps.map((step, index) => (
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

      <section id="for-sellers" aria-labelledby="sellers-title" className="scroll-mt-28 pb-8">
        <div className="shell">
          <div className="grid gap-8 rounded-[2.25rem] bg-midnight-gradient px-6 py-12 text-white shadow-panel sm:px-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-accent">For Disposal Partners</p>
              <h2 id="sellers-title" className="mt-3 font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold leading-tight tracking-[-0.03em]">
                List once. Sell everywhere.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
                Brokers, licensed auctioneers, disposal firms and administrators: you&apos;ve already done the hard
                part. One listing reaches buyers in every market we cover — with zero extra work on your end.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/sell#register" className={buttonStyles("accent", "no-underline")}>
                  Become a Disposal Partner
                </Link>
                <Link href="/sell" className={buttonStyles("outline-light", "no-underline")}>
                  Why list with us
                </Link>
              </div>
            </div>
            <ul className="grid gap-3">
              {sellerPoints.map((point) => (
                <li key={point} className="flex gap-3 rounded-2xl bg-white/10 px-5 py-4 text-base">
                  <span aria-hidden="true" className="font-semibold text-accent">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
