"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Auction } from "@/types";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { formatCurrency, getAuctionMinimumBid, getTimeRemaining } from "@/lib/utils";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Banner } from "@/components/feedback/banner";
import { useToast } from "@/components/feedback/toast-provider";
import { cn } from "@/lib/utils";

type Feedback = { tone: "success" | "error"; text: string } | null;

function BidForm({
  amount,
  note,
  isAdding,
  feedback,
  minimumBid,
  auction,
  onAmountChange,
  onNoteChange,
  onSubmit,
  onClose
}: {
  amount: string;
  note: string;
  isAdding: boolean;
  feedback: Feedback;
  minimumBid: number;
  auction: Auction;
  onAmountChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  onClose?: () => void;
}) {
  const currentAmount = Number(amount) || minimumBid;
  const presetValues = [minimumBid, minimumBid + 50000, minimumBid + 100000];

  return (
    <>
      <div className="mt-8 grid gap-4 rounded-[1.25rem] bg-surface-low p-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted">Suggested minimum</span>
          <span className="font-semibold text-ink">{formatCurrency(minimumBid)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted">Time remaining</span>
          <span className="font-semibold text-ink">{getTimeRemaining(auction.endDate)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted">Mode</span>
          <span className="font-semibold text-ink">Proposal staged in formal dossier</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.25rem] bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-white/70">Increment over current reference</span>
          <span className="font-semibold">{formatCurrency(currentAmount - auction.currentBid)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetValues.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onAmountChange(String(value))}
              className={cn(
                "rounded-full px-3 py-2 text-xs transition",
                value === currentAmount ? "bg-white text-primary" : "bg-white/10 text-white"
              )}
            >
              {formatCurrency(value)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Proposal value</span>
          <Input
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            inputMode="numeric"
            aria-label="Proposal value"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Internal note</span>
          <Textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Internal context for the submitting team."
          />
        </label>
      </div>

      <div className="mt-4 rounded-[1.25rem] bg-surface-low p-4 text-sm leading-6 text-muted">
        The proposal is staged in the dossier for formal delivery, allowing counterparties to review
        requirements, documentation, and process context before final submission.
      </div>

      {feedback ? (
        <div className="mt-4">
          <Banner tone={feedback.tone}>{feedback.text}</Banner>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        <Button onClick={onSubmit} className="w-full" disabled={isAdding}>
          {isAdding ? "Validating proposal..." : "Stage in dossier"}
        </Button>
        {onClose ? (
          <Button variant="secondary" onClick={onClose}>
            Close drawer
          </Button>
        ) : null}
        <Link href="/cart" className={buttonStyles("secondary", "w-full no-underline")}>
          Review formal dossier
        </Link>
      </div>
    </>
  );
}

export function BidPanel({ auction }: { auction: Auction }) {
  const minimumBid = useMemo(() => getAuctionMinimumBid(auction), [auction]);
  const [amount, setAmount] = useState(String(minimumBid));
  const [note, setNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { addBidIntent } = useMarketplace();
  const { pushToast } = useToast();

  async function handleAddToCart() {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < minimumBid) {
      const nextFeedback = {
        tone: "error",
        text: `A proposta deve ser igual ou superior a ${formatCurrency(minimumBid)}.`
      } as const;
      setFeedback(nextFeedback);
      pushToast(nextFeedback);
      return;
    }

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = addBidIntent(auction.id, numericAmount, note);
    const nextFeedback = { tone: "success", text: result.message } as const;
    setFeedback(nextFeedback);
    pushToast(nextFeedback);
    setIsAdding(false);
    setIsDrawerOpen(false);
  }

  return (
    <>
      <div className="mb-4 lg:hidden">
        <Button className="w-full" onClick={() => setIsDrawerOpen(true)}>
          Start proposal process
        </Button>
      </div>

      <aside className="hidden rounded-[1.75rem] bg-surface-lowest/95 p-5 shadow-ambient tonal-rule backdrop-blur-sm lg:block">
        <p className="institutional-kicker">Proposal panel</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Review the current reference, prepare the proposal value, and stage the case in the formal dossier.
        </p>
        <div className="mt-4">
          <p className="text-sm text-muted">Current reference</p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] text-tertiary-ink">
            {formatCurrency(auction.currentBid)}
          </p>
        </div>
        <div className="mt-5 rounded-[1.25rem] bg-surface-legal px-4 py-3.5 tonal-rule">
          <p className="institutional-kicker">Next step</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            Stage the proposal and continue to the dossier for final review.
          </p>
        </div>
        <BidForm
          amount={amount}
          note={note}
          isAdding={isAdding}
          feedback={feedback}
          minimumBid={minimumBid}
          auction={auction}
          onAmountChange={setAmount}
          onNoteChange={setNote}
          onSubmit={handleAddToCart}
        />
      </aside>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-x-0 bottom-0 rounded-t-[2rem] bg-surface-bright p-5 shadow-ambient">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-surface-high" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="institutional-kicker">Proposal workspace</p>
                <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">
                  {formatCurrency(auction.currentBid)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full bg-surface-low px-4 py-2 text-sm text-ink"
              >
                Close
              </button>
            </div>
            <BidForm
              amount={amount}
              note={note}
              isAdding={isAdding}
              feedback={feedback}
              minimumBid={minimumBid}
              auction={auction}
              onAmountChange={setAmount}
              onNoteChange={setNote}
              onSubmit={handleAddToCart}
              onClose={() => setIsDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
