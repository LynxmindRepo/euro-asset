"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/auction/status-badge";
import { AdminSidebar } from "@/components/admin/sidebar";
import { PageShell } from "@/components/layout/page-shell";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { hasStaticAuctionDetail } from "@/lib/site";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AdminPage() {
  const { currentUser } = useMockSession();
  const { auctions, sessionEvents } = useMarketplace();

  function openLoginModal() {
    window.dispatchEvent(new Event("open-mock-login"));
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <PageShell>
        <div className="shell section-space">
          <div className="panel-xl bg-surface-low">
            <p className="institutional-kicker">Admin access</p>
            <h1 className="page-title mt-3 text-[clamp(2.2rem,4vw,3.1rem)]">
              Sign in with the admin profile to enter the operational dashboard.
            </h1>
            <p className="support-copy mt-4 max-w-2xl">
              This area is intentionally gated in the demo so you can present a cleaner transition
              between the buyer journey and the backoffice workflow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={openLoginModal}>Open login</Button>
              <Link href="/auctions" className={buttonStyles("secondary", "no-underline")}>
                Return to processes
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const openCount = auctions.filter((auction) => auction.status !== "encerrado").length;
  const totalVolume = auctions.reduce((sum, auction) => sum + auction.currentBid, 0);
  const closingSoonCount = auctions.filter((auction) => auction.status === "a-encerrar").length;
  const scheduledCount = auctions.filter((auction) => auction.status === "agendado").length;
  const createdThisSession = sessionEvents.filter((event) => event.type === "auction-created");
  const docsOnRequestCount = auctions.filter((auction) =>
    auction.documents.some((document) => document.availability === "sob-pedido")
  ).length;

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-8 xl:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div className="grid gap-8">
            <div className="grid gap-5 lg:grid-cols-4">
              <Card variant="metric">
                <p className="institutional-kicker">Active processes</p>
                <p className="mt-3 metric-figure">{openCount}</p>
                <p className="mt-2 text-sm text-muted">Processes currently under curation and negotiation</p>
              </Card>
              <Card variant="metric">
                <p className="institutional-kicker">Tracked volume</p>
                <p className="mt-3 metric-figure">{formatCurrency(totalVolume)}</p>
                <p className="mt-2 text-sm text-muted">Aggregate value across active processes</p>
              </Card>
              <Card variant="metric">
                <p className="institutional-kicker">Closing soon</p>
                <p className="mt-3 metric-figure text-tertiary-ink">{closingSoonCount}</p>
                <p className="mt-2 text-sm text-muted">Assets requiring immediate commercial attention</p>
              </Card>
              <Card variant="metric" className="bg-surface-legal">
                <p className="institutional-kicker">Scheduled intake</p>
                <p className="mt-3 metric-figure">{scheduledCount}</p>
                <p className="mt-2 text-sm text-muted">Processes prepared but not yet live for review</p>
              </Card>
            </div>

            <Card variant="muted" className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="institutional-kicker">Process management</p>
                  <h1 className="page-title mt-3 text-[clamp(2.4rem,4vw,3.35rem)]">
                    Operational dashboard for curation, intake, and review.
                  </h1>
                  <p className="support-copy mt-4 max-w-3xl">
                    The admin environment is intentionally lightweight in this phase, but it should
                    still read like a controlled backoffice rather than a generic content tool.
                  </p>
                </div>
                <Link href="/admin/new" className={buttonStyles("primary", "no-underline")}>
                  Create new process
                </Link>
              </div>
              <div className="mt-6 grid gap-3 lg:grid-cols-[0.85fr_0.85fr_1.1fr]">
                <div className="panel-lg bg-surface-lowest tonal-rule shadow-ambient">
                  <p className="institutional-kicker">Current session</p>
                  <p className="section-title mt-3">
                    {createdThisSession.length} created
                  </p>
                  <p className="support-copy mt-2">
                    This counter highlights processes created in memory during the current demo session.
                  </p>
                </div>
                <div className="panel-lg bg-surface-tint tonal-rule">
                  <p className="institutional-kicker">Controlled documents</p>
                  <p className="section-title mt-3">
                    {docsOnRequestCount}
                  </p>
                  <p className="support-copy mt-2">
                    Active processes containing materials marked as available on request.
                  </p>
                </div>
                <div className="panel-lg bg-surface-legal tonal-rule">
                  <p className="institutional-kicker">Latest event</p>
                  {createdThisSession.length > 0 ? (
                    <>
                      <p className="mt-3 font-medium text-ink">
                        {auctions.find((auction) => auction.id === createdThisSession[0].auctionId)?.title ??
                          "Process created"}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        {formatDateTime(createdThisSession[0].createdAt)}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-muted">
                      No processes have been created in this session yet.
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8 hidden rounded-[1.4rem] bg-surface-tint px-5 py-4 tonal-rule lg:grid lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.7fr_0.6fr]">
                <p className="institutional-kicker">Asset</p>
                <p className="institutional-kicker text-right">Status</p>
                <p className="institutional-kicker text-right">Current value</p>
                <p className="institutional-kicker text-right">Bids</p>
                <p className="institutional-kicker text-right">Action</p>
              </div>
              <div className="mt-3 grid gap-3">
                {auctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="panel-lg grid gap-4 bg-surface-lowest shadow-ambient tonal-rule lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.7fr_0.6fr] lg:items-center"
                  >
                    <div>
                      <p className="font-display text-2xl font-semibold tracking-[-0.04em]">
                        {auction.title}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        {auction.location} / {auction.region}
                      </p>
                      <p className="mt-1 text-xs text-muted">{auction.caseReference}</p>
                    </div>
                    <div className="lg:justify-self-end">
                      <StatusBadge status={auction.status} />
                    </div>
                    <p className="text-sm font-semibold text-ink lg:text-right">
                      {formatCurrency(auction.currentBid)}
                    </p>
                    <p className="text-sm text-muted lg:text-right">{auction.bids.length}</p>
                    {hasStaticAuctionDetail(auction.id) ? (
                      <Link href={`/auctions/${auction.id}`} className="text-sm text-primary lg:text-right">
                        View detail
                      </Link>
                    ) : (
                      <span className="text-sm text-muted lg:text-right">Session-only</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
