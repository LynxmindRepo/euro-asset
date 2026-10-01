"use client";

import { FormEvent, useState } from "react";
import { Listing } from "@/types";
import { Banner } from "@/components/feedback/banner";
import { useToast } from "@/components/feedback/toast-provider";
import { StatusBadge } from "@/components/listing/status-badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getOriginLabel, getPartner, getPartnerTypeLabel } from "@/lib/listing-helpers";
import { Price } from "@/components/ui/price";
import { cn, formatDate } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Enter a valid email address, e.g. name@company.com.";
  if (values.message.trim().length < 10) errors.message = "Write a short message (at least 10 characters).";
  return errors;
}

export function ContactPanel({ listing }: { listing: Listing }) {
  const partner = getPartner(listing.partnerId);
  const { currentUser } = useMockSession();
  const { sendInquiry } = useMarketplace();
  const { pushToast } = useToast();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(`Hello, I'm interested in "${listing.title}". Is it still available?`);
  const [errors, setErrors] = useState<Errors>({});
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isSold = listing.status === "sold";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate({ name, email, message });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = (["name", "email", "message"] as const).find((field) => nextErrors[field]);
      document.getElementById(`contact-${firstField}`)?.focus();
      return;
    }

    setIsSending(true);
    await sendInquiry({ listingId: listing.id, name: name.trim(), email: email.trim(), message: message.trim() });
    setIsSending(false);
    setSent(true);
    pushToast({ tone: "success", text: `Message sent to ${partner?.name ?? "the seller"}.` });
  }

  const fieldError = (field: keyof Errors) =>
    errors[field] ? (
      <p id={`contact-${field}-error`} className="text-sm text-danger-ink">
        {errors[field]}
      </p>
    ) : null;

  return (
    <aside aria-label="Price and seller" className="grid gap-5">
      <div className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={listing.status} />
          <span className="rounded-full bg-surface-low px-3 py-1 text-xs text-ink">{getOriginLabel(listing.origin)}</span>
        </div>
        <p className="mt-4 text-sm text-muted">Asking price</p>
        <div className="mt-1">
          <Price
            eur={listing.price}
            sold={isSold}
            className="font-display text-4xl font-semibold tracking-[-0.04em] text-primary"
            originalClassName="mt-1 text-sm"
          />
        </div>
        <p className="mt-2 text-xs text-muted">Excl. VAT, transport and registration costs.</p>
        {!isSold ? (
          <a href="#cost-estimator" className="mt-3 inline-flex text-sm font-semibold text-primary">
            Estimate the total cost to your country ↓
          </a>
        ) : null}
      </div>

      {partner ? (
        <section aria-labelledby="seller-title" className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
          <p className="institutional-kicker">Disposal Partner</p>
          <h2 id="seller-title" className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
            {partner.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {getPartnerTypeLabel(partner.type)} · {partner.city}, {partner.country}
          </p>
          {partner.verified ? (
            <p className="mt-3 inline-flex rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-ink">
              ✓ Verified Disposal Partner
            </p>
          ) : null}
          <p className="support-copy mt-3">{partner.description}</p>
          <p className="mt-2 text-xs text-muted">Partner since {formatDate(partner.memberSince)}</p>
          <dl className="mt-4 grid gap-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted">Phone</dt>
              <dd>
                <a href={`tel:${partner.phone.replace(/\s/g, "")}`} className="text-primary">
                  {partner.phone}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted">Email</dt>
              <dd>
                <a href={`mailto:${partner.email}`} className="break-all text-primary">
                  {partner.email}
                </a>
              </dd>
            </div>
          </dl>
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles("secondary", "mt-5 w-full no-underline")}
          >
            Visit seller website<span className="sr-only"> (opens in a new tab)</span>
            <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        </section>
      ) : null}

      <section aria-labelledby="contact-title" className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
        <h2 id="contact-title" className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
          Contact the seller
        </h2>
        <p className="support-copy mt-1">Your message goes directly to the Disposal Partner — no middleman.</p>

        {isSold ? (
          <div className="mt-4">
            <Banner tone="info">This asset has been sold. Browse similar listings or contact the seller about other assets.</Banner>
          </div>
        ) : sent ? (
          <div className="mt-4" role="status">
            <Banner tone="success">
              Message sent. {partner?.name ?? "The seller"} will reply to {email}. (Demo — no email is actually sent.)
            </Banner>
            <button type="button" onClick={() => setSent(false)} className={buttonStyles("ghost", "mt-3 px-0")}>
              Send another message
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="contact-name" className="field-label">
                Name
              </label>
              <Input
                id="contact-name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              {fieldError("name")}
            </div>
            <div className="grid gap-2">
              <label htmlFor="contact-email" className="field-label">
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
              {fieldError("email")}
            </div>
            <div className="grid gap-2">
              <label htmlFor="contact-message" className="field-label">
                Message
              </label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
              />
              {fieldError("message")}
            </div>
            <Button type="submit" variant="accent" disabled={isSending} className="w-full">
              {isSending ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </section>
    </aside>
  );
}
