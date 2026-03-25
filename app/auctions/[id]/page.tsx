"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BidPanel } from "@/components/auction/bid-panel";
import { Gallery } from "@/components/auction/gallery";
import { StatusBadge } from "@/components/auction/status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { mockUsers } from "@/data/users";
import { useMarketplace } from "@/features/cart/marketplace-store";
import {
  getCountryLabel,
  getDocumentAvailabilityLabel,
  getDocumentTypeLabel,
  getSaleProcedureLabel
} from "@/lib/auction-helpers";
import { formatCurrency, formatDateTime, getTimeRemaining } from "@/lib/utils";

function getDocumentAvailabilityClass(value: "disponivel" | "sob-pedido") {
  return value === "disponivel"
    ? "bg-success text-success-ink"
    : "bg-tertiary text-tertiary-ink";
}

export default function AuctionDetailPage() {
  const params = useParams<{ id: string }>();
  const { auctions } = useMarketplace();
  const auction = useMemo(
    () => auctions.find((candidate) => candidate.id === params.id),
    [auctions, params.id]
  );

  if (!auction) {
    return (
      <PageShell>
        <div className="shell section-space">
          <EmptyState
            title="Process not found"
            description="The requested asset does not exist in the current demo memory."
            href="/auctions"
            cta="Back to processes"
          />
        </div>
      </PageShell>
    );
  }

  const strategicAngle = auction.highlights[0] ?? "Institutional-scale asset within a structured process.";
  const processReadiness = auction.documents.some((document) => document.availability === "sob-pedido")
    ? "Core pack available, with controlled access to additional materials."
    : "Primary process pack already available for direct review.";
  const operatingPosition =
    auction.highlights[1] ?? auction.occupancyStatus;
  const legalPosition =
    auction.legalNotes[0] ?? "Process subject to formal legal review and controlled submission mechanics.";

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-10 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-8">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auctions" className="text-sm text-primary">
                Back to processes
              </Link>
              <StatusBadge status={auction.status} />
              <span className="rounded-full bg-surface-high px-3 py-1 text-xs text-muted">
                {getSaleProcedureLabel(auction.saleProcedure)}
              </span>
            </div>
            <section className="overflow-hidden rounded-[1.9rem] bg-surface-lowest shadow-panel tonal-rule">
              <Gallery images={auction.images} title={auction.title} hero />
              <div className="panel-xl">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-surface-legal px-3 py-1 text-xs text-muted">
                    {getCountryLabel(auction.country)}
                  </span>
                  <span className="rounded-full bg-tertiary/60 px-3 py-1 text-xs text-tertiary-ink">
                    {auction.caseReference}
                  </span>
                  <span className="rounded-full bg-surface-tint px-3 py-1 text-xs text-muted">
                    EUR
                  </span>
                </div>
                <p className="institutional-kicker mt-5">
                  {getCountryLabel(auction.country)} / {auction.location} / {auction.jurisdiction}
                </p>
                <h1 className="page-title mt-3">
                  {auction.title}
                </h1>
                <p className="body-copy mt-5 max-w-4xl">{auction.description}</p>
                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-surface-tint px-4 py-4 tonal-rule">
                    <p className="institutional-kicker">Current proposal</p>
                    <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-tertiary-ink">
                      {formatCurrency(auction.currentBid)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-surface-low px-4 py-4 tonal-rule">
                    <p className="institutional-kicker">Time remaining</p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {getTimeRemaining(auction.endDate)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-surface-legal px-4 py-4 tonal-rule">
                    <p className="institutional-kicker">Responsible entity</p>
                    <p className="mt-2 text-sm leading-6 text-ink">{auction.administratorEntity}</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="panel-lg rounded-[1.75rem] bg-midnight-gradient text-white shadow-panel">
              <p className="institutional-kicker text-white/60">Executive summary</p>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {auction.executiveSummary.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/10 px-4 py-4 text-sm leading-6 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="panel-lg bg-surface-lowest shadow-panel tonal-rule">
                <p className="institutional-kicker">Why this matters</p>
                <h2 className="section-title mt-3">
                  A process-led opportunity with immediate commercial reading.
                </h2>
                <p className="body-copy mt-4 text-sm">
                  This case combines process visibility, operating context, and a clear path to
                  formal delivery, which is precisely why it works well for institutional review.
                </p>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl bg-surface-tint px-4 py-4 tonal-rule">
                    <p className="institutional-kicker">Strategic angle</p>
                    <p className="mt-2 text-sm leading-6 text-ink">{strategicAngle}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-low px-4 py-4 tonal-rule">
                    <p className="institutional-kicker">Operating position</p>
                    <p className="mt-2 text-sm leading-6 text-ink">{operatingPosition}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-legal px-4 py-4 tonal-rule">
                    <p className="institutional-kicker">Process readiness</p>
                    <p className="mt-2 text-sm leading-6 text-ink">{processReadiness}</p>
                  </div>
                </div>
              </div>
              <div className="legal-panel">
                <p className="institutional-kicker">Legal posture</p>
                <h2 className="section-title mt-3">
                  Formal mechanics remain central to execution.
                </h2>
                <p className="body-copy mt-4 text-sm">
                  This opportunity should be read through both its asset merits and its procedural
                  perimeter, including access conditions, eligibility, and submission discipline.
                </p>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm leading-6 tonal-rule">
                    {legalPosition}
                  </div>
                  <div className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm leading-6 tonal-rule">
                    {auction.submissionRequirements[0] ?? "Formal submission requirements apply."}
                  </div>
                  <div className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm leading-6 tonal-rule">
                    {auction.encumbrancesSummary}
                  </div>
                </div>
              </div>
            </section>
            <section className="panel-lg bg-surface-tint tonal-rule xl:hidden">
              <p className="institutional-kicker">Next step</p>
              <p className="section-title mt-3">
                Prepare the proposal and review the dossier.
              </p>
              <p className="support-copy mt-3">
                The demo flow is designed to move from process context to formal submission with
                minimal friction.
              </p>
            </section>
            <div className="lg:hidden">
              <div className="panel-lg bg-surface-legal tonal-rule">
                <p className="institutional-kicker">Quick access</p>
                <p className="support-copy mt-2">
                  On mobile, proposal submission opens in a dedicated drawer so the process context remains visible.
                </p>
              </div>
            </div>
            <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="panel-lg bg-surface-legal tonal-rule lg:col-span-2">
                <p className="institutional-kicker">Commercial reading</p>
                <h2 className="section-title mt-3">Visual context and commercial highlights in one opening section.</h2>
                <p className="support-copy mt-4">
                  Move between key asset views while keeping the process summary, current reference,
                  and core commercial points within the same reading sequence.
                </p>
                <div className="mt-5 grid gap-3">
                  {auction.highlights.map((highlight) => (
                    <div key={highlight} className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm tonal-rule">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="legal-panel">
                <p className="institutional-kicker">Process file</p>
                <h2 className="section-title mt-3">Documentation and access conditions.</h2>
                <div className="mt-5 grid gap-3">
                  {auction.documents.map((document) => (
                    <div key={document.id} className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm tonal-rule">
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                        <div className="min-w-0">
                          <span className="font-medium text-ink">{document.label}</span>
                          <p className="mt-1 text-xs text-muted">{getDocumentTypeLabel(document.type)}</p>
                        </div>
                        <span
                          className={`inline-flex min-w-[7.5rem] justify-center rounded-full px-3 py-1 text-xs ${getDocumentAvailabilityClass(
                            document.availability
                          )}`}
                        >
                          {getDocumentAvailabilityLabel(document.availability)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel-lg bg-surface-tint tonal-rule">
                <p className="institutional-kicker">Submission requirements</p>
                <div className="mt-5 grid gap-3">
                  {auction.submissionRequirements.map((item) => (
                    <div key={item} className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm tonal-rule">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="legal-panel">
                <p className="institutional-kicker">Legal notes</p>
                <div className="mt-5 grid gap-3">
                  {auction.legalNotes.map((note) => (
                    <div key={note} className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm leading-6 tonal-rule">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel-lg bg-surface-low tonal-rule">
                <p className="institutional-kicker">Additional information</p>
                <p className="support-copy mt-3">
                  Supporting reference data for final review before proposal staging and dossier delivery.
                </p>
                <dl className="mt-5 grid gap-4 text-sm">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <dt className="text-muted">Base price</dt>
                    <dd className="text-right font-semibold text-ink">{formatCurrency(auction.basePrice)}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <dt className="text-muted">Seller</dt>
                    <dd className="text-right font-semibold text-ink">{auction.seller}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <dt className="text-muted">Start</dt>
                    <dd className="text-right font-semibold text-ink">{formatDateTime(auction.startDate)}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <dt className="text-muted">Close</dt>
                    <dd className="text-right font-semibold text-ink">{formatDateTime(auction.endDate)}</dd>
                  </div>
                  <div className="grid gap-2">
                    <dt className="text-muted">Encumbrance summary</dt>
                    <dd className="font-semibold text-ink">{auction.encumbrancesSummary}</dd>
                  </div>
                </dl>
              </div>
            </section>
            <section className="panel-lg bg-surface-low tonal-rule">
              <p className="institutional-kicker">Dummy proposal history</p>
              <h2 className="section-title mt-3">
                Recent sequence of proposals received.
              </h2>
              <p className="support-copy mt-3">
                Included for demo context only, to show how recent proposal activity may be presented.
              </p>
              <div className="mt-6 grid gap-3">
                {auction.bids.length === 0 ? (
                  <div className="rounded-2xl bg-surface-lowest px-4 py-5 text-sm text-muted">
                    This process has not received any proposals yet.
                  </div>
                ) : (
                  auction.bids
                    .slice()
                    .reverse()
                    .map((bid) => {
                      const user = mockUsers.find((candidate) => candidate.id === bid.userId);

                      return (
                        <div
                          key={bid.id}
                          className="grid gap-2 rounded-2xl bg-surface-lowest px-4 py-4 md:grid-cols-[1fr_auto_auto]"
                        >
                          <div>
                            <p className="font-medium text-ink">{user?.company ?? "Entity"}</p>
                            <p className="text-sm text-muted">{user?.name ?? "User"}</p>
                          </div>
                          <p className="text-sm text-muted md:text-right">{formatDateTime(bid.createdAt)}</p>
                          <p className="font-semibold text-ink md:text-right">{formatCurrency(bid.amount)}</p>
                        </div>
                      );
                    })
                )}
              </div>
            </section>
          </div>
          <div className="grid h-fit gap-6">
            <BidPanel auction={auction} />
            <div className="legal-panel">
              <p className="institutional-kicker">Process context</p>
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Procedure</dt>
                  <dd className="font-semibold text-ink">{getSaleProcedureLabel(auction.saleProcedure)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Responsible entity</dt>
                  <dd className="font-semibold text-ink">{auction.administratorEntity}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Administrator</dt>
                  <dd className="font-semibold text-ink">{auction.administratorName}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Occupancy</dt>
                  <dd className="font-semibold text-ink">{auction.occupancyStatus}</dd>
                </div>
              </dl>
            </div>
            <div className="panel-lg bg-surface-lowest shadow-ambient tonal-rule">
              <p className="institutional-kicker">Review sequence</p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-surface-lowest px-4 py-4 tonal-rule">
                  <p className="institutional-kicker">1. Read the process</p>
                  <p className="mt-2 text-sm leading-6 text-ink">
                    Assess the commercial frame, process context, and current proposal reference.
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-lowest px-4 py-4 tonal-rule">
                  <p className="institutional-kicker">2. Review documentation</p>
                  <p className="mt-2 text-sm leading-6 text-ink">
                    Confirm legal notes, document availability, and submission requirements.
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-lowest px-4 py-4 tonal-rule">
                  <p className="institutional-kicker">3. Stage the proposal</p>
                  <p className="mt-2 text-sm leading-6 text-ink">
                    Add the proposal to the dossier and continue to final submission review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
