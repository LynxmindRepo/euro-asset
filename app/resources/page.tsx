"use client";

import { useState } from "react";
import Link from "next/link";
import { Banner } from "@/components/feedback/banner";
import { useToast } from "@/components/feedback/toast-provider";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { buttonStyles } from "@/components/ui/button";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import { ResourceCategory, resourceCategories, servicePartners } from "@/data/resources";

const icons: Record<ResourceCategory["id"], React.ReactNode> = {
  logistics: (
    <>
      <path d="M3 16V7a1 1 0 0 1 1-1h10v10" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  currency: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 8.5a4 4 0 1 0 0 7" />
      <path d="M7.5 11h6M7.5 13.5h6" />
    </>
  ),
  insurance: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  registration: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  financing: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  )
};

function ResourceIcon({ id }: { id: ResourceCategory["id"] }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      {icons[id]}
    </svg>
  );
}

export default function ResourcesPage() {
  const { pushToast } = useToast();
  const [requested, setRequested] = useState<Set<string>>(new Set());

  function requestQuote(id: string, name: string) {
    setRequested((current) => new Set(current).add(id));
    pushToast({ tone: "success", text: `Quote request sent to ${name}. (Demo — nothing is sent.)` });
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Partners & Resources"
        title="Everything you need after you find the asset."
        intro={
          <p>
            Transport, currency exchange, insurance, registration and secure payment — service partners that make a
            cross-border purchase simple, from the seller&apos;s yard to yours.
          </p>
        }
      >
        <Link href="/listings" className={buttonStyles("accent", "no-underline")}>
          Find an asset
        </Link>
      </PageHero>

      <div className="shell pb-8">
        <nav aria-label="On this page" className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">On this page:</span>
          {resourceCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="rounded-full bg-surface-high px-3 py-1.5 text-sm font-medium text-primary no-underline tonal-rule transition hover:bg-surface-tint"
            >
              {category.title}
            </a>
          ))}
        </nav>
        <div className="mt-6 max-w-3xl">
          <Banner tone="info">
            The partners below are fictional examples for this prototype. In the live product they would be vetted
            service partners in each market.
          </Banner>
        </div>
      </div>

      {resourceCategories.map((category) => {
        const partners = servicePartners.filter((partner) => partner.categoryId === category.id);

        return (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="scroll-mt-28 py-8">
            <div className="shell">
              <div className="grid gap-6 rounded-[2rem] bg-surface-low p-6 tonal-rule sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-accent">
                    <ResourceIcon id={category.id} />
                  </span>
                  <h2 id={`${category.id}-title`} className="mt-4 font-display text-2xl font-semibold text-ink">
                    {category.title}
                  </h2>
                  <p className="support-copy mt-2">{category.description}</p>
                  <p className="mt-4 rounded-2xl bg-surface-lowest px-4 py-2 text-sm text-ink tonal-rule">
                    <span className="mr-1 font-semibold">Typical cost:</span> {category.typicalCost}
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {partners.map((partner) => {
                    const isRequested = requested.has(partner.id);

                    return (
                      <li key={partner.id} className="flex flex-col rounded-[1.5rem] bg-surface-lowest p-5 shadow-ambient tonal-rule">
                        <h3 className="font-display text-lg font-semibold text-ink">{partner.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted">{partner.description}</p>
                        <p className="mt-2 text-xs text-muted">{partner.coverage}</p>
                        <div className="mt-auto pt-4">
                          {isRequested ? (
                            <p className="inline-flex items-center gap-1 rounded-full bg-success px-3 py-1.5 text-sm font-semibold text-success-ink">
                              <span aria-hidden="true">✓</span> Quote requested
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => requestQuote(partner.id, partner.name)}
                              aria-label={`Request a quote from ${partner.name}`}
                              className={buttonStyles("secondary", "px-4 py-2")}
                            >
                              Request a quote
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <section aria-labelledby="valuation-title" className="py-8">
        <div className="shell">
          <div className="flex flex-col gap-5 rounded-[2rem] bg-midnight-gradient p-6 text-white shadow-panel sm:p-8 lg:flex-row lg:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <SparkleIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">Coming soon</p>
              <h2 id="valuation-title" className="mt-2 font-display text-2xl font-semibold">
                Automated asset valuation
              </h2>
              <p className="mt-2 max-w-3xl text-base leading-7 text-white/80">
                As deals go through the platform, we learn what sold, where, for how much and how fast. That data will
                power an automatic valuation — an estimate of what a similar asset is worth, even before it&apos;s
                listed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
