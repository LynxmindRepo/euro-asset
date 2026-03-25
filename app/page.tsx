"use client";

import Link from "next/link";
import { Hero } from "@/components/hero";
import { AuctionCard } from "@/components/auction/auction-card";
import { PageShell } from "@/components/layout/page-shell";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/features/cart/marketplace-store";
import {
  getCategoryLabel,
  getCountryLabel,
  getFeaturedAuctions,
  getRecentAuctions,
  getSaleProcedureLabel
} from "@/lib/auction-helpers";
import { getAssetPath, hasStaticAuctionDetail } from "@/lib/site";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";

export default function HomePage() {
  const { auctions } = useMarketplace();
  const featured = getFeaturedAuctions(auctions);
  const recent = getRecentAuctions(auctions);
  const heroProcess = featured[0];
  const supportingFeatured = featured.slice(1);
  const totalOpenValue = auctions.reduce((sum, auction) => sum + auction.currentBid, 0);
  const heroHasDetailPage = heroProcess ? hasStaticAuctionDetail(heroProcess.id) : false;

  return (
    <PageShell>
      <Hero />

      <section className="section-space surface-mid">
        <div className="shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="institutional-kicker">Featured process</p>
              <h2 className="page-title mt-3 max-w-4xl text-[clamp(2.5rem,4vw,3.5rem)]">
                Current priority process for institutional review.
              </h2>
            </div>
            <Link href="/auctions" className={buttonStyles("secondary", "no-underline")}>
              Review all processes
            </Link>
          </div>
          {heroProcess ? (
            <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <article className="overflow-hidden rounded-[1.9rem] bg-surface-lowest shadow-panel tonal-rule">
                <div className="overflow-hidden">
                  <img
                    src={getAssetPath(heroProcess.images[0])}
                    alt={heroProcess.title}
                    className="h-80 w-full object-cover md:h-[26rem] xl:h-[28rem]"
                  />
                </div>
                <div className="panel-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-tertiary/60 px-3 py-1 text-xs text-tertiary-ink">
                      {heroProcess.caseReference}
                    </span>
                    <span className="rounded-full bg-surface-tint px-3 py-1 text-xs text-muted">
                      {getSaleProcedureLabel(heroProcess.saleProcedure)}
                    </span>
                    <span className="rounded-full bg-surface-legal px-3 py-1 text-xs text-muted">
                      {getCountryLabel(heroProcess.country)} / {heroProcess.jurisdiction}
                    </span>
                  </div>
                  <p className="institutional-kicker mt-5">
                    {getCountryLabel(heroProcess.country)} / {heroProcess.location}
                  </p>
                  <h3 className="page-title mt-3 text-[clamp(2.1rem,4vw,3rem)]">
                    {heroProcess.title}
                  </h3>
                  <p className="support-copy mt-4 text-muted">
                    {getCategoryLabel(heroProcess.categoryId)} / {getSaleProcedureLabel(heroProcess.saleProcedure)}
                  </p>
                  <p className="body-copy mt-5 max-w-4xl">
                    {heroProcess.executiveSummary[0] ?? heroProcess.description}
                  </p>
                  <div className="mt-8 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-surface-tint px-4 py-4 tonal-rule">
                      <p className="institutional-kicker">Current proposal</p>
                      <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-tertiary-ink">
                        {formatCurrency(heroProcess.currentBid)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-surface-low px-4 py-4 tonal-rule">
                      <p className="institutional-kicker">Responsible entity</p>
                      <p className="mt-2 text-sm leading-6 text-ink">{heroProcess.administratorEntity}</p>
                    </div>
                    <div className="rounded-2xl bg-surface-legal px-4 py-4 tonal-rule">
                      <p className="institutional-kicker">Time remaining</p>
                      <p className="mt-2 text-sm font-semibold text-ink">
                        {getTimeRemaining(heroProcess.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {heroHasDetailPage ? (
                      <Link
                        href={`/auctions/${heroProcess.id}`}
                        className={buttonStyles("primary", "no-underline")}
                      >
                        Open process
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center rounded-xl bg-surface-low px-5 py-3 text-sm text-muted tonal-rule">
                        Session-only process
                      </span>
                    )}
                    <Link href="/cart" className={buttonStyles("secondary", "no-underline")}>
                      Review dossier
                    </Link>
                  </div>
                </div>
              </article>
              <div className="grid gap-4">
                <div className="panel-lg bg-surface-lowest shadow-panel tonal-rule">
                  <p className="institutional-kicker">Institutional confidence</p>
                  <h3 className="section-title mt-3">
                    Built to communicate legal visibility, documentary access, and proposal discipline.
                  </h3>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl bg-surface-tint px-4 py-4 tonal-rule">
                      <p className="institutional-kicker">Process origin</p>
                      <p className="mt-2 text-sm leading-6 text-ink">
                        Insolvency, liquidation, restructuring, and judicial sale contexts are visible from the outset.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-surface-legal px-4 py-4 tonal-rule">
                      <p className="institutional-kicker">Documentation posture</p>
                      <p className="mt-2 text-sm leading-6 text-ink">
                        Core packs, controlled access, and on-request documents are surfaced before proposal staging.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-surface-low px-4 py-4 tonal-rule">
                      <p className="institutional-kicker">Buyer workflow</p>
                      <p className="mt-2 text-sm leading-6 text-ink">
                        The experience guides industrial buyers and traders from review to a formal proposal dossier.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="panel-lg bg-primary text-white shadow-panel">
                  <p className="institutional-kicker text-white/60">Coverage in this phase</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="font-display text-3xl font-semibold tracking-[-0.04em]">
                        EUR
                      </p>
                      <p className="mt-2 text-sm text-white/75">Single-currency scope for the current release</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl font-semibold tracking-[-0.04em]">
                        4
                      </p>
                      <p className="mt-2 text-sm text-white/75">European jurisdictions represented in the demo</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl font-semibold tracking-[-0.04em]">
                        {auctions.length}
                      </p>
                      <p className="mt-2 text-sm text-white/75">Processes available for structured review</p>
                    </div>
                  </div>
                </div>
                {supportingFeatured.map((auction) => (
                  <Card key={auction.id} variant="editorial" className="shadow-panel">
                    <p className="institutional-kicker">
                      {getCountryLabel(auction.country)} / {getSaleProcedureLabel(auction.saleProcedure)}
                    </p>
                    <p className="subsection-title mt-3 text-[1.7rem]">{auction.title}</p>
                    <p className="support-copy mt-3">
                      {auction.executiveSummary[1] ?? auction.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="institutional-kicker">Current proposal</p>
                        <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-tertiary-ink">
                          {formatCurrency(auction.currentBid)}
                        </p>
                      </div>
                      {hasStaticAuctionDetail(auction.id) ? (
                        <Link href={`/auctions/${auction.id}`} className="text-sm font-medium text-primary no-underline">
                          Open process
                        </Link>
                      ) : (
                        <span className="text-sm text-muted">Session-only process</span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-space">
        <div className="shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="institutional-kicker">Categories</p>
            <h2 className="page-title mt-3 text-[clamp(2.25rem,4vw,3.15rem)]">
              Navigate by asset class and operating profile.
            </h2>
            <Card variant="metric" className="mt-8">
              <p className="institutional-kicker">Capital under review</p>
              <p className="mt-3 metric-figure text-primary">{formatCurrency(totalOpenValue)}</p>
              <p className="support-copy mt-3">
                Browse the catalogue by the operating profile most relevant to industrial acquirers,
                special-situations buyers, and cross-border trading mandates.
              </p>
            </Card>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <Card
                key={category.id}
                variant="editorial"
                className="h-full"
              >
                <p className="font-display text-2xl font-semibold tracking-[-0.04em]">
                  {category.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">{category.description}</p>
                <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">Processes in demo</span>
                  <span className="font-semibold text-ink">
                    {auctions.filter((auction) => auction.categoryId === category.id).length}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space surface-mid">
        <div className="shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="institutional-kicker">Additional live processes</p>
              <h2 className="page-title mt-3 text-[clamp(2.25rem,4vw,3.15rem)]">
                Recent catalogue entries across the current European scope.
              </h2>
            </div>
            <Link
              href="/auctions"
              className={buttonStyles(
                "secondary",
                "inline-flex self-start whitespace-nowrap leading-none no-underline lg:self-end"
              )}
            >
              Browse full catalogue
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {recent.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card variant="editorial" className="shadow-ambient">
              <p className="institutional-kicker">Catalogue posture</p>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">
                Live processes are presented with enough context to support early institutional screening.
              </p>
            </Card>
            <Card variant="elevated" className="bg-surface-legal p-6">
              <p className="institutional-kicker">Review path</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Open a process, assess the legal and documentary perimeter, stage a proposal, and complete
                the dossier through the simulated submission flow.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
