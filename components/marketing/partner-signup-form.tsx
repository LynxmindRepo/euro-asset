"use client";

import { FormEvent, useState } from "react";
import { Banner } from "@/components/feedback/banner";
import { useToast } from "@/components/feedback/toast-provider";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { PartnerApplication, PartnerType } from "@/types";
import { Localized } from "@/components/ui/localized";

type Field = "company" | "country" | "contactName" | "email";
type Errors = Partial<Record<Field, string>>;

const initialForm = {
  company: "",
  type: "disposal-firm" as PartnerType,
  country: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  volume: "2-10" as PartnerApplication["volume"],
  message: ""
};

export function PartnerSignupForm() {
  const { submitApplication } = useMarketplace();
  const { pushToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [isSending, setIsSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!form.company.trim()) nextErrors.company = "Enter your company name.";
    if (!form.country.trim()) nextErrors.country = "Enter the country you operate from.";
    if (!form.contactName.trim()) nextErrors.contactName = "Enter a contact person.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address, e.g. name@company.com.";
    setErrors(nextErrors);

    const firstError = (["company", "country", "contactName", "email"] as const).find((field) => nextErrors[field]);
    if (firstError) {
      document.getElementById(`partner-${firstError}`)?.focus();
      return;
    }

    setIsSending(true);
    await submitApplication({ ...form, company: form.company.trim(), email: form.email.trim() });
    setIsSending(false);
    setSentTo(form.email.trim());
    pushToast({ tone: "success", text: "Registration received. We'll be in touch with a tailored quote." });
  }

  const describedBy = (field: Field) => (errors[field] ? `partner-${field}-error` : undefined);
  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={`partner-${field}-error`} className="text-sm text-danger-ink">
        {errors[field]}
      </p>
    ) : null;

  if (sentTo) {
    return (
      <Localized><div role="status" className="grid gap-4">
        <Banner tone="success">
          Thank you — your registration has been received. We&apos;ll contact you at {sentTo} with a quote tailored to
          your listings. (Demo — nothing is sent.)
        </Banner>
        <button
          type="button"
          onClick={() => {
            setForm(initialForm);
            setSentTo(null);
          }}
          className={buttonStyles("ghost", "justify-self-start px-0")}
        >
          Register another company
        </button>
      </div></Localized>
    );
  }

  return (
    <Localized><form noValidate onSubmit={handleSubmit} className="grid gap-5">
      <p className="text-sm text-muted">Fields marked * are required.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="partner-company" className="field-label">
            Company name *
          </label>
          <Input
            id="partner-company"
            autoComplete="organization"
            value={form.company}
            onChange={(event) => update("company", event.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
          />
          {errorText("company")}
        </div>
        <div className="grid gap-2">
          <label htmlFor="partner-type" className="field-label">
            You are a
          </label>
          <Select id="partner-type" value={form.type} onChange={(event) => update("type", event.target.value as PartnerType)}>
            <option value="broker">Broker</option>
            <option value="auctioneer">Licensed auctioneer</option>
            <option value="disposal-firm">Disposal firm</option>
            <option value="administrator">Insolvency administrator</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="partner-country" className="field-label">
            Country *
          </label>
          <Input
            id="partner-country"
            autoComplete="country-name"
            value={form.country}
            onChange={(event) => update("country", event.target.value)}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={describedBy("country")}
          />
          {errorText("country")}
        </div>
        <div className="grid gap-2">
          <label htmlFor="partner-website" className="field-label">
            Website
          </label>
          <Input
            id="partner-website"
            type="url"
            autoComplete="url"
            placeholder="https://"
            value={form.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="partner-contactName" className="field-label">
            Contact person *
          </label>
          <Input
            id="partner-contactName"
            autoComplete="name"
            value={form.contactName}
            onChange={(event) => update("contactName", event.target.value)}
            aria-invalid={Boolean(errors.contactName)}
            aria-describedby={describedBy("contactName")}
          />
          {errorText("contactName")}
        </div>
        <div className="grid gap-2">
          <label htmlFor="partner-email" className="field-label">
            Email *
          </label>
          <Input
            id="partner-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
          />
          {errorText("email")}
        </div>
        <div className="grid gap-2">
          <label htmlFor="partner-phone" className="field-label">
            Phone
          </label>
          <Input
            id="partner-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="partner-volume" className="field-label">
            How many assets do you want to list?
          </label>
          <Select
            id="partner-volume"
            value={form.volume}
            onChange={(event) => update("volume", event.target.value as PartnerApplication["volume"])}
          >
            <option value="1">One asset</option>
            <option value="2-10">2 to 10 assets</option>
            <option value="10+">More than 10 assets</option>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="partner-message" className="field-label">
          Anything we should know?
        </label>
        <Textarea
          id="partner-message"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="Type of assets, markets you'd like to reach, timing…"
        />
      </div>
      <Button type="submit" variant="accent" disabled={isSending} className="justify-self-start">
        {isSending ? "Sending…" : "Register and get a quote"}
      </Button>
    </form></Localized>
  );
}
