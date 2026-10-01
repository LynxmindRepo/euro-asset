"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/feedback/toast-provider";
import { Banner } from "@/components/feedback/banner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PhotoUploader } from "@/components/ui/photo-uploader";
import { Price } from "@/components/ui/price";
import { Select } from "@/components/ui/select";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import { categories } from "@/data/categories";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { useUnits } from "@/features/preferences/units-context";
import { getCategoryPlaceholder } from "@/lib/listing-helpers";
import { ImportResult, importExamples, parseListingText } from "@/lib/listing-import";
import { getAssetPath } from "@/lib/site";
import { formatSpecShort } from "@/lib/utils";
import { ListingOrigin, ListingSpec } from "@/types";
import { Localized } from "@/components/ui/localized";

type Phase = "input" | "analysing" | "review";
type Field = "title" | "price" | "country";

const STEP_MS = 600;

function AutoHint({ filled }: { filled: boolean }) {
  return filled ? (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <SparkleIcon className="h-3 w-3 text-accent-ink" /> Filled automatically — check it
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-ink">
      Not found in your text — please add
    </span>
  );
}

/**
 * Used by the admin (chooses the Disposal Partner) and by a signed-in partner (`fixedPartnerId`:
 * listings are always published under their own company).
 */
export function ListingImport({ fixedPartnerId, redirectTo = "/admin" }: { fixedPartnerId?: string; redirectTo?: string }) {
  const router = useRouter();
  const { currentUser } = useMockSession();
  const { partners, createListing } = useMarketplace();
  const { units } = useUnits();
  const { pushToast } = useToast();
  const [text, setText] = useState("");
  const [partnerId, setPartnerId] = useState(fixedPartnerId ?? partners[0]?.id ?? "");
  const [phase, setPhase] = useState<Phase>("input");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [form, setForm] = useState<ImportResult["listing"] | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [announcement, setAnnouncement] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const reviewHeading = useRef<HTMLHeadingElement>(null);

  function convert() {
    if (text.trim().length < 20) {
      setErrors({ title: "Paste a listing of at least a couple of lines." });
      document.getElementById("import-text")?.focus();
      return;
    }
    const parsed = parseListingText(text);
    setErrors({});
    setResult(parsed);
    setForm(parsed.listing);
    setStep(0);
    setAnnouncement("Converting your listing…");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reduce ? "review" : "analysing");
  }

  // Reveal the "AI" steps one by one, then show the review form.
  useEffect(() => {
    if (phase !== "analysing" || !result) return;
    const timer = window.setTimeout(() => {
      if (step + 1 < result.steps.length) setStep(step + 1);
      else setPhase("review");
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [phase, step, result]);

  useEffect(() => {
    if (phase !== "review" || !result) return;
    const filledCount = 7 - result.missing.length;
    setAnnouncement(
      `Done. ${filledCount} fields filled automatically${
        result.missing.length ? `, ${result.missing.length} need your attention: ${result.missing.join(", ")}` : ""
      }.`
    );
    reviewHeading.current?.focus();
  }, [phase, result]);

  function update<K extends keyof ImportResult["listing"]>(key: K, value: ImportResult["listing"][K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function removeSpec(spec: ListingSpec) {
    setForm((current) => (current ? { ...current, specs: current.specs.filter((item) => item !== spec) } : current));
  }

  function publish() {
    if (!form) return;
    const nextErrors: Partial<Record<Field, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Add a title.";
    if (!(form.price > 0)) nextErrors.price = "Add the asking price in EUR.";
    if (!form.country.trim()) nextErrors.country = "Add the country where the asset is.";
    setErrors(nextErrors);
    const first = (["title", "price", "country"] as const).find((field) => nextErrors[field]);
    if (first) {
      document.getElementById(`import-${first}`)?.focus();
      return;
    }

    const created = createListing(
      {
        title: form.title.trim(),
        description: form.description.trim() || form.title.trim(),
        categoryId: form.categoryId,
        origin: form.origin,
        price: Math.round(form.price),
        city: form.city.trim(),
        region: "",
        country: form.country.trim(),
        partnerId,
        images: photos.length > 0 ? photos : [getCategoryPlaceholder(form.categoryId)],
        highlights: form.highlights,
        requiresRegistration: form.requiresRegistration,
        specs: form.specs
      },
      currentUser?.id ?? "import"
    );
    pushToast({ tone: "success", text: `"${created.title}" is now live in every market (demo session).` });
    router.push(redirectTo);
  }

  const missing = (key: "price" | "location" | "category") => result?.missing.includes(key) ?? false;
  const fieldError = (field: Field) =>
    errors[field] ? (
      <p id={`import-${field}-error`} className="text-sm text-danger-ink">
        {errors[field]}
      </p>
    ) : null;

  return (
    <Localized><div className="grid gap-6">
      <p role="status" className="sr-only">
        {announcement}
      </p>

      {phase === "input" ? (
        <section aria-labelledby="paste-title" className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
          <h2 id="paste-title" className="font-display text-xl font-semibold text-ink">
            1. Paste the listing you already have
          </h2>
          <p className="support-copy mt-1 max-w-2xl">
            Copy the text from your own website, catalogue or local sale — any language, any currency. We turn it into a
            Bridgeon listing for every market.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Try an example:</span>
            {importExamples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => setText(example.text)}
                className="rounded-full bg-surface-high px-3 py-1.5 text-sm font-medium text-primary tonal-rule transition hover:bg-surface-tint"
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-2">
            <label htmlFor="import-text" className="field-label">
              Listing text
            </label>
            <Textarea
              id="import-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-56 font-mono text-[13px]"
              placeholder={"Scania R450 tractor unit 2018\nPrice: 495 000 SEK\nLocation: Malmö, Sweden\n…"}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "import-title-error" : undefined}
            />
            {phase === "input" ? fieldError("title") : null}
          </div>

          {fixedPartnerId ? null : (
            <div className="mt-4 grid gap-2 sm:max-w-sm">
              <label htmlFor="import-partner" className="field-label">
                Publish as Disposal Partner
              </label>
              <Select id="import-partner" value={partnerId} onChange={(event) => setPartnerId(event.target.value)}>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <button
            type="button"
            onClick={convert}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary shadow-ambient transition hover:brightness-105"
          >
            <SparkleIcon className="h-4 w-4" />
            Convert with AI
          </button>
        </section>
      ) : null}

      {phase === "analysing" && result ? (
        <section
          aria-labelledby="analysing-title"
          className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule"
        >
          <h2 id="analysing-title" className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary">
              <SparkleIcon className="h-4 w-4" />
            </span>
            Converting your listing…
          </h2>
          <ul aria-hidden="true" className="mt-4 grid gap-2 text-sm">
            {result.steps.slice(0, step + 1).map((item, index) => (
              <li key={item} className="flex items-center gap-2 text-muted">
                {index < step ? (
                  <span className="text-success-ink">✓</span>
                ) : (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase === "review" && form && result ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
          <section aria-labelledby="review-title" className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
            <h2 id="review-title" ref={reviewHeading} tabIndex={-1} className="font-display text-xl font-semibold text-ink">
              2. Check the details and publish
            </h2>
            {result.missing.length > 0 ? (
              <div className="mt-3">
                <Banner tone="info">
                  We filled in everything we could. {result.missing.length === 1 ? "One field needs" : "A few fields need"} your
                  input — they are marked below.
                </Banner>
              </div>
            ) : (
              <div className="mt-3">
                <Banner tone="success">Everything was filled in automatically. Give it a quick check and publish.</Banner>
              </div>
            )}

            <div className="mt-5 grid gap-5">
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="import-title" className="field-label">
                    Title
                  </label>
                  <AutoHint filled={Boolean(result.listing.title)} />
                </div>
                <Input
                  id="import-title"
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "import-title-error" : undefined}
                />
                {fieldError("title")}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="import-category" className="field-label">
                      Category
                    </label>
                    <AutoHint filled={!missing("category")} />
                  </div>
                  <Select id="import-category" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="import-origin" className="field-label">
                      Origin
                    </label>
                    <AutoHint filled />
                  </div>
                  <Select
                    id="import-origin"
                    value={form.origin}
                    onChange={(event) => update("origin", event.target.value as ListingOrigin)}
                  >
                    <option value="insolvency">Insolvency</option>
                    <option value="liquidation">Liquidation</option>
                    <option value="restructuring">Restructuring</option>
                    <option value="judicial-sale">Judicial sale</option>
                    <option value="private-sale">Private sale</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="import-price" className="field-label">
                      Asking price (EUR)
                    </label>
                    <AutoHint filled={!missing("price")} />
                  </div>
                  <Input
                    id="import-price"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={form.price || ""}
                    onChange={(event) => update("price", Number(event.target.value))}
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={
                      [errors.price ? "import-price-error" : "", result.listing.sourcePrice ? "import-price-source" : ""]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                  />
                  {result.listing.sourcePrice ? (
                    <p id="import-price-source" className="field-hint">
                      Converted from “{result.listing.sourcePrice}” at indicative rates.
                    </p>
                  ) : null}
                  {fieldError("price")}
                </div>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                  <div className="grid gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label htmlFor="import-city" className="field-label">
                        City
                      </label>
                    </div>
                    <Input id="import-city" value={form.city} onChange={(event) => update("city", event.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="import-country" className="field-label">
                      Country
                    </label>
                    <Input
                      id="import-country"
                      value={form.country}
                      onChange={(event) => update("country", event.target.value)}
                      aria-invalid={Boolean(errors.country)}
                      aria-describedby={errors.country ? "import-country-error" : undefined}
                    />
                    {fieldError("country")}
                  </div>
                  <div className="sm:col-span-2">
                    <AutoHint filled={!missing("location")} />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="import-description" className="field-label">
                  Description
                </label>
                <Textarea
                  id="import-description"
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                />
              </div>

              <PhotoUploader photos={photos} onChange={setPhotos} label="Photos" />

              <fieldset className="grid gap-2">
                <legend className="field-label mb-2">Specifications found</legend>
                {form.specs.length === 0 ? (
                  <p className="text-sm text-muted">No measurable specifications found (mileage, hours, weight, area, year).</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {form.specs.map((spec) => (
                      <li key={spec.label} className="inline-flex items-center gap-1 rounded-full bg-surface-low py-1 pl-3 pr-1 text-sm text-ink tonal-rule">
                        <span className="text-muted">{spec.label}:</span> {formatSpecShort(spec, units)}
                        <button
                          type="button"
                          onClick={() => removeSpec(spec)}
                          aria-label={`Remove ${spec.label}`}
                          className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-muted transition hover:bg-surface-high hover:text-ink"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>

              <div className="grid gap-2">
                <label htmlFor="import-highlights" className="field-label">
                  Highlights
                </label>
                <Input
                  id="import-highlights"
                  value={form.highlights.join(", ")}
                  onChange={(event) =>
                    update(
                      "highlights",
                      event.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                    )
                  }
                  aria-describedby="import-highlights-hint"
                />
                <p id="import-highlights-hint" className="field-hint">
                  Comma separated.
                </p>
              </div>

              <label className="flex items-center gap-3 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.requiresRegistration}
                  onChange={(event) => update("requiresRegistration", event.target.checked)}
                  className="h-5 w-5 accent-[rgb(var(--primary))]"
                />
                Requires re-registration in the buyer&apos;s country
              </label>

              <div className="flex flex-wrap gap-3">
                <Button variant="accent" onClick={publish}>
                  Publish to every market
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPhase("input");
                    setResult(null);
                    setPhotos([]);
                    setErrors({});
                  }}
                >
                  Start over
                </Button>
              </div>
            </div>
          </section>

          <aside aria-label="Preview" className="overflow-hidden rounded-[1.75rem] bg-surface-lowest shadow-panel tonal-rule lg:sticky lg:top-28">
            <img src={getAssetPath(photos[0] ?? getCategoryPlaceholder(form.categoryId))} alt="" className="h-48 w-full object-cover" />
            <div className="p-5">
              <p className="eyebrow">Preview</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink">{form.title || "Untitled listing"}</p>
              <p className="mt-1 text-sm text-muted">{[form.city, form.country].filter(Boolean).join(", ") || "Location missing"}</p>
              <div className="mt-3">
                <Price eur={form.price || 0} className="font-display text-2xl font-semibold text-primary" />
              </div>
              {form.specs.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {form.specs.slice(0, 3).map((spec) => (
                    <li key={spec.label} className="rounded-full bg-surface-low px-3 py-1 text-xs text-ink">
                      {formatSpecShort(spec, units)}
                    </li>
                  ))}
                </ul>
              ) : null}
              {photos.length === 0 ? (
                <p className="mt-4 text-xs text-muted">No photos yet — a category illustration is used until you add some.</p>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </div></Localized>
  );
}
