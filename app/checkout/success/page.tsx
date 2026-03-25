"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FlowSteps } from "@/components/feedback/flow-steps";
import { PageShell } from "@/components/layout/page-shell";
import { buttonStyles } from "@/components/ui/button";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function SuccessPage() {
  const { lastSubmission } = useMarketplace();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell">
          <FlowSteps current="success" />
          <div className="mx-auto max-w-4xl rounded-[2.25rem] bg-midnight-gradient px-8 py-12 text-white shadow-ambient sm:px-12">
            <p className="institutional-kicker text-white/60">Submission completed</p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">
              Proposal dossier delivered successfully.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78">
              The final state confirms formal delivery of the proposal in this demonstration,
              preserving the institutional tone and process-driven framing of the product.
            </p>
            {lastSubmission ? (
              <div className="mt-8 grid gap-4 rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/70">Reference</span>
                  <span className="font-semibold">{lastSubmission.id}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/70">Date</span>
                  <span className="font-semibold">{formatDateTime(lastSubmission.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/70">Total</span>
                  <span className="font-semibold">{formatCurrency(lastSubmission.totalAmount)}</span>
                </div>
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auctions" className={buttonStyles("primary", "no-underline")}>
                Back to processes
              </Link>
              <Link href="/admin" className={buttonStyles("gold", "no-underline")}>
                Open admin area
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
