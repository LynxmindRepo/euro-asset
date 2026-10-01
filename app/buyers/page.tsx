"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { CategoryIcon } from "@/components/listing/category-icon";
import { BenefitGrid, ClosingStatement } from "@/components/marketing/benefit-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { buttonStyles } from "@/components/ui/button";
import { categories } from "@/data/categories";

// Copy from the client's feedback document ("Why buyers choose us").
const benefits = [
  {
    title: "Search once, see everything",
    text: "One search across every country we cover — no more checking a dozen different national sites to find what you're looking for."
  },
  {
    title: "Filter, sort, and save your search",
    text: "Narrow down by category, location, or price in seconds, then save your search and get notified automatically when a new match appears."
  },
  {
    title: "Find what you won't find locally",
    text: "Access cross-border assets your local market never sees — inventory that never even reaches a domestic listing site."
  },
  {
    title: "Let matches come to you",
    text: "Relevant listings are surfaced automatically, based on what you're looking for — less time searching, more time deciding."
  },
  {
    title: "Only professional sellers, never guesswork",
    text: "We work exclusively with professional Disposal Partners — brokers, licensed auctioneers, disposal firms, and administrators. Every listing is already photographed and documented by someone who knows the asset, not an unverified individual seller."
  },
  {
    title: "Deal directly, no middleman",
    text: "Connect straight with the Disposal Partner selling the asset — no added markup, no unnecessary steps in between."
  }
];

export default function BuyersPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Why buyers choose us"
        title="Search once. Find it anywhere."
        intro={
          <p>
            Vehicles, machinery, real estate, stock and equipment from insolvencies across Europe — listed only by
            professional, verified Disposal Partners and ready to act on.
          </p>
        }
      >
        <Link href="/listings" className={buttonStyles("accent", "no-underline")}>
          Start searching
        </Link>
        <Link href="/sell" className={buttonStyles("outline-light", "no-underline")}>
          Selling assets? List with us
        </Link>
      </PageHero>

      <BenefitGrid id="why-buy-title" title="Why buyers choose us" benefits={benefits} />

      <ClosingStatement tagline="Search once. Find it anywhere.">
        Whether you&apos;re buying for yourself or your business, one search puts you in front of insolvency assets from
        across Europe — listed only by professional, verified Disposal Partners, translated, and ready to act on.
      </ClosingStatement>

      <section aria-labelledby="start-title" className="pb-8">
        <div className="shell">
          <h2 id="start-title" className="section-title text-[clamp(1.8rem,3vw,2.5rem)]">
            Start with a category
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/listings?category=${category.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-surface-lowest px-4 py-4 font-medium text-ink no-underline shadow-ambient tonal-rule transition hover:-translate-y-0.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-accent">
                    <CategoryIcon categoryId={category.id} className="h-5 w-5" />
                  </span>
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
