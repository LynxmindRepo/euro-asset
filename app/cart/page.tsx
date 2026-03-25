"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuoteCartItemRow } from "@/components/cart/quote-cart-item";
import { EmptyState } from "@/components/feedback/empty-state";
import { FlowSteps } from "@/components/feedback/flow-steps";
import { PageShell } from "@/components/layout/page-shell";
import { Button, buttonStyles } from "@/components/ui/button";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { auctions, cartItems } = useMarketplace();
  const total = cartItems.reduce((sum, item) => sum + item.amount, 0);
  const selectedAuctions = cartItems
    .map((item) => auctions.find((auction) => auction.id === item.auctionId))
    .filter(Boolean);

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <FlowSteps current="dossier" />
            <p className="institutional-kicker">Proposal dossier</p>
            <h1 className="page-title mt-3">
              Review staged proposals before formal delivery.
            </h1>
            <p className="body-copy mt-5 max-w-2xl">
              This stage consolidates selected processes, verifies dossier readiness, and prepares
              the final delivery step without losing legal or documentary context.
            </p>
            <div className="panel-lg mt-6 bg-surface-low">
              <p className="institutional-kicker">Submitting entity</p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted">Name</p>
                  <p className="font-semibold text-ink">Atlas Holdings</p>
                </div>
                <div>
                  <p className="text-muted">Profile</p>
                  <p className="font-semibold text-ink">Mock institutional buyer</p>
                </div>
              </div>
            </div>
            <div className="mt-10 grid gap-4">
              {cartItems.length === 0 ? (
                <EmptyState
                  title="No proposals have been added yet"
                  description="Stage a proposal from a process detail page to continue the workflow."
                  href="/auctions"
                  cta="Review processes"
                />
              ) : (
                cartItems.map((item) => <QuoteCartItemRow key={item.id} item={item} />)
              )}
            </div>
          </div>

          <aside className="panel-lg h-fit bg-surface-lowest shadow-ambient">
            <p className="institutional-kicker">Dossier summary</p>
            <div className="mt-5 grid gap-4 rounded-2xl bg-surface-low p-4 tonal-rule">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted">Staged proposals</span>
                <span className="font-semibold text-ink">{cartItems.length}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted">Aggregate value in EUR</span>
                <span className="font-semibold text-ink">{formatCurrency(total)}</span>
              </div>
            </div>
            <p className="support-copy mt-5">
              Formal delivery is simulated, including loading, an optional failure path,
              and a final confirmation state. No external integration exists in this phase.
            </p>
            <div className="panel-lg mt-6 bg-surface-low">
              <p className="institutional-kicker">Formal checklist</p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted">Submitting entity identified</span>
                  <span className="font-semibold text-ink">Simulated</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted">Processes included</span>
                  <span className="font-semibold text-ink">{selectedAuctions.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted">Documents on request</span>
                  <span className="font-semibold text-ink">
                    {selectedAuctions.some((auction) =>
                      auction?.documents.some((document) => document.availability === "sob-pedido")
                    )
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted">Acceptance of conditions</span>
                  <span className="font-semibold text-ink">Prepared</span>
                </div>
              </div>
            </div>
            <div className="panel-lg mt-6 bg-primary text-white">
              <p className="institutional-kicker text-white/60">Dossier readiness</p>
              <p className="section-title mt-3 text-white">
                {cartItems.length > 0 ? "Ready for final review" : "No processes selected"}
              </p>
              <p className="support-copy mt-3 text-white/75">
                The workflow is designed to communicate process discipline: prepare, review, confirm, and deliver.
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              <Button disabled={cartItems.length === 0} onClick={() => router.push("/checkout")}>
                Proceed to formal delivery
              </Button>
              <Link href="/auctions" className={buttonStyles("secondary", "w-full no-underline")}>
                Continue reviewing opportunities
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
