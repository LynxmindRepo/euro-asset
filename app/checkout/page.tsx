"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@/components/feedback/banner";
import { FlowSteps } from "@/components/feedback/flow-steps";
import { useToast } from "@/components/feedback/toast-provider";
import { PageShell } from "@/components/layout/page-shell";
import { Button, buttonStyles } from "@/components/ui/button";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { currentUser } = useMockSession();
  const { cartItems, submitCart } = useMarketplace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "error">("idle");
  const { pushToast } = useToast();

  function openLoginModal() {
    window.dispatchEvent(new Event("open-mock-login"));
  }

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [cartItems.length, router]);

  const total = cartItems.reduce((sum, item) => sum + item.amount, 0);

  async function handleSubmit() {
    if (!currentUser) {
      pushToast({ tone: "error", text: "Sign in with a mock profile before submitting the proposal dossier." });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (simulateError) {
      setIsSubmitting(false);
      setSubmissionState("error");
      pushToast({ tone: "error", text: "Simulated submission failure. Review the dossier and try again." });
      return;
    }

    await submitCart(currentUser.id);
    pushToast({ tone: "success", text: "Formal submission completed successfully." });
    router.push("/checkout/success");
  }

  if (!currentUser) {
    return (
      <PageShell>
        <section className="section-space">
          <div className="shell">
            <div className="panel-xl bg-surface-low">
              <p className="institutional-kicker">Sign in required</p>
              <h1 className="page-title mt-3 text-[clamp(2.2rem,4vw,3.1rem)]">
                Enter with a buyer profile before delivering the proposal dossier.
              </h1>
              <p className="support-copy mt-4 max-w-2xl">
                The checkout stage is intentionally protected in the prototype so the demo can show
                a clear sign-in moment before formal submission.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={openLoginModal}>Open login</Button>
                <Link href="/cart" className={buttonStyles("secondary", "no-underline")}>
                  Return to dossier
                </Link>
              </div>
              <div className="mt-6">
                <Banner tone="info">
                  Use the buyer profile to continue the review and delivery flow.
                </Banner>
              </div>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-8 xl:grid-cols-[1fr_0.85fr]">
          <div className="panel-xl bg-surface-low">
            <FlowSteps current="checkout" />
            <p className="institutional-kicker">Formal submission</p>
            <h1 className="page-title mt-3 text-[clamp(2.5rem,4vw,3.6rem)]">
              Final confirmation of the proposal dossier.
            </h1>
            <p className="body-copy mt-5 max-w-2xl">
              This screen represents the final stage before formal delivery of a proposal within
              an insolvency, liquidation or judicial sale process.
            </p>
            <div className="mt-8 grid gap-3">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-surface-lowest px-4 py-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted">Prepared proposal</span>
                    <span className="font-semibold text-ink">{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="panel-xl bg-surface-lowest shadow-ambient">
            <p className="institutional-kicker">Submission status</p>
            <div className="mt-5">
              <p className="field-hint">Active entity</p>
              <p className="subsection-title mt-2">
                {currentUser.name}
              </p>
            </div>
            <div className="panel-lg mt-6 bg-surface-low">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted">Dossier total in EUR</span>
                <span className="font-semibold text-ink">{formatCurrency(total)}</span>
              </div>
            </div>
            <label className="mt-6 flex items-center gap-3 rounded-2xl bg-surface-low px-4 py-4 text-sm text-ink tonal-rule">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(event) => setSimulateError(event.target.checked)}
                className="h-4 w-4"
              />
              Simulate submission failure for review purposes
            </label>
            <div className="mt-6">
              <Banner tone={submissionState === "error" ? "error" : "info"}>
                Simulated state:{" "}
                {submissionState === "error"
                  ? "Mock validation failure"
                  : isSubmitting
                    ? "Processing formal submission..."
                    : "Ready for delivery"}
              </Banner>
            </div>
            <div className="mt-6 grid gap-3">
              <Button disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? "Submitting..." : "Confirm delivery"}
              </Button>
              <Button variant="secondary" onClick={() => router.push("/cart")} disabled={isSubmitting}>
                Back to dossier
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
