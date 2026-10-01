"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { BenefitGrid, ClosingStatement } from "@/components/marketing/benefit-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { PartnerSignupForm } from "@/components/marketing/partner-signup-form";
import { buttonStyles } from "@/components/ui/button";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getListingCountries } from "@/lib/listing-helpers";

// Copy from the client's feedback document ("Why list with us").
const benefits = [
  {
    title: "Register once, reach everywhere",
    text: "Sign up as a Disposal Partner — brokers, licensed auctioneers, disposal firms, and administrators welcome. One registration gives you access to buyers in every country we cover, not just your own."
  },
  {
    title: "List in minutes, not hours",
    text: "Add the category, location, photos, and description — the same information you've already prepared for your local sale. No new process to learn, no extra work."
  },
  {
    title: "Instantly go international",
    text: "Your listing is translated and optimized automatically the moment you publish it. International buyers can find and understand it without you lifting a finger."
  },
  {
    title: "Pay only for what you need",
    text: "Pricing is tailored to your listing — get in touch for a quote, especially if you're listing several assets at once. No bloated packages, no paying for reach you don't use."
  },
  {
    title: "Live everywhere, instantly",
    text: "The moment you publish, your listing is visible to buyers across every market we cover — no manual republishing, no juggling separate accounts per country."
  },
  {
    title: "Stay in control",
    text: "A simple dashboard to edit listings, mark items as sold, and see buyer inquiries — everything in one place, so nothing slips through the cracks."
  }
];

const steps = [
  { title: "Register", text: "Tell us who you are and what you sell. We reply with a quote tailored to your listings." },
  { title: "Add your listing", text: "Category, location, photos and description — the material you already have." },
  { title: "Receive inquiries", text: "Buyers from every market contact you directly. You agree the deal with them." }
];

export default function SellPage() {
  const { listings } = useMarketplace();
  const countries = getListingCountries(listings);

  return (
    <PageShell>
      <PageHero
        eyebrow="Why list with us"
        title="List once. Sell everywhere."
        intro={
          <p>
            Bridgeon Assets is a European marketplace for assets from insolvencies and professional disposals. As a{" "}
            <strong className="font-semibold text-white">Disposal Partner</strong> — a broker, licensed auctioneer,
            disposal firm or insolvency administrator — you publish the assets you are already selling locally, and we
            put them in front of buyers in every country we cover.
          </p>
        }
      >
        <Link href="#register" className={buttonStyles("accent", "no-underline")}>
          Become a Disposal Partner
        </Link>
        <Link href="/listings" className={buttonStyles("outline-light", "no-underline")}>
          See live listings
        </Link>
      </PageHero>

      <section aria-labelledby="reach-title" className="pb-20">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 id="reach-title" className="section-title text-[clamp(1.8rem,3vw,2.5rem)]">
              Where your listing is seen
            </h2>
            <p className="body-copy mt-4 max-w-xl">
              One listing is visible to buyers in every market we cover — searchable in their language and shown in a
              way they understand, without you republishing anything.
            </p>
            <ul aria-label="Markets covered" className="mt-6 flex flex-wrap gap-2">
              {countries.map((country) => (
                <li key={country} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
                  {country}
                </li>
              ))}
              <li className="rounded-full bg-surface-high px-4 py-2 text-sm text-ink">More markets coming</li>
            </ul>
          </div>
          <ol className="grid gap-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-[1.5rem] bg-surface-low p-5 tonal-rule">
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BenefitGrid id="why-list-title" title="Why list with us" benefits={benefits} />

      <section aria-labelledby="try-import-title" className="pb-20">
        <div className="shell">
          <div className="flex flex-col gap-5 rounded-[2rem] bg-surface-lowest p-6 shadow-panel tonal-rule sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <SparkleIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 id="try-import-title" className="font-display text-2xl font-semibold text-ink">
                  See how importing works
                </h2>
                <p className="support-copy mt-1 max-w-2xl">
                  Paste a listing you already have — any language, any currency — and it becomes a Bridgeon listing in
                  seconds. Then manage it, mark it as sold and read buyer inquiries from your dashboard.
                </p>
              </div>
            </div>
            <Link href="/partner/import" className={buttonStyles("accent", "shrink-0 no-underline")}>
              Try the import tool
            </Link>
          </div>
        </div>
      </section>

      <ClosingStatement tagline="List once. Sell everywhere.">
        You&apos;ve already done the hard part — appraising, photographing, and documenting the asset. We take it from
        there: one listing reaches buyers in every market we cover, automatically translated, with zero extra work on
        your end.
      </ClosingStatement>

      <section id="register" aria-labelledby="register-title" className="scroll-mt-28 pb-8">
        <div className="shell grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] bg-surface-lowest p-6 shadow-panel tonal-rule sm:p-8">
            <h2 id="register-title" className="section-title text-[clamp(1.7rem,3vw,2.2rem)]">
              Become a Disposal Partner
            </h2>
            <p className="support-copy mt-2 mb-6 max-w-xl">
              Register your company and we&apos;ll get back to you with a quote tailored to the assets you want to list.
            </p>
            <PartnerSignupForm />
          </div>
          <aside aria-labelledby="next-title" className="rounded-[2rem] bg-surface-low p-6 tonal-rule sm:p-8">
            <h2 id="next-title" className="font-display text-xl font-semibold text-ink">
              What happens next
            </h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink">
              <li className="flex gap-3">
                <span aria-hidden="true" className="font-semibold text-accent-ink">✓</span>
                We review your registration and confirm you as a verified Disposal Partner.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="font-semibold text-accent-ink">✓</span>
                You receive a quote tailored to your listings — no fixed packages.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="font-semibold text-accent-ink">✓</span>
                You publish your first listing and start receiving inquiries.
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
