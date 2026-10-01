"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormField } from "@/components/admin/form-field";
import { useToast } from "@/components/feedback/toast-provider";
import { PartnerShell } from "@/components/partner/partner-shell";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PhotoUploader } from "@/components/ui/photo-uploader";
import { Select } from "@/components/ui/select";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getCategoryPlaceholder } from "@/lib/listing-helpers";
import { Listing, ListingStatus } from "@/types";

// Static export: the listing id comes from the query string (?id=…), so this one page can edit any listing,
// including listings created during the session.
export default function EditListingPage() {
  const id = useSearchParams().get("id") ?? "";
  const { listings } = useMarketplace();
  const listing = listings.find((candidate) => candidate.id === id);

  return (
    <PartnerShell title="Edit listing">
      {(partner) =>
        !listing || listing.partnerId !== partner.id ? (
          <div className="panel-lg bg-surface-low">
            <p className="text-ink">This listing doesn&apos;t exist or belongs to another Disposal Partner.</p>
            <Link href="/partner" className={buttonStyles("secondary", "mt-4 no-underline")}>
              Back to your listings
            </Link>
          </div>
        ) : (
          <EditForm key={listing.id} listing={listing} />
        )
      }
    </PartnerShell>
  );
}

function EditForm({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { updateListing } = useMarketplace();
  const { pushToast } = useToast();
  const [form, setForm] = useState({
    title: listing.title,
    description: listing.description,
    price: String(listing.price),
    status: listing.status,
    city: listing.city,
    region: listing.region,
    country: listing.country,
    highlights: listing.highlights.join(", ")
  });
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<string[]>(listing.images);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!(Number(form.price) > 0)) {
      setError("Enter an asking price above 0.");
      document.getElementById("edit-price")?.focus();
      return;
    }

    updateListing(listing.id, {
      title: form.title.trim() || listing.title,
      description: form.description.trim(),
      price: Math.round(Number(form.price)),
      status: form.status,
      city: form.city.trim(),
      region: form.region.trim(),
      country: form.country.trim(),
      images: photos.length > 0 ? photos : [getCategoryPlaceholder(listing.categoryId)],
      highlights: form.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    });
    pushToast({ tone: "success", text: "Changes saved and live in every market." });
    router.push("/partner");
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-3xl gap-5 rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
      <FormField label="Title">
        <Input required value={form.title} onChange={(event) => update("title", event.target.value)} />
      </FormField>
      <FormField label="Description">
        <Textarea value={form.description} onChange={(event) => update("description", event.target.value)} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="edit-price" className="field-label">
            Asking price (EUR)
          </label>
          <Input
            id="edit-price"
            type="number"
            min={0}
            inputMode="numeric"
            value={form.price}
            onChange={(event) => update("price", event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "edit-price-error" : undefined}
          />
          {error ? (
            <p id="edit-price-error" className="text-sm text-danger-ink">
              {error}
            </p>
          ) : null}
        </div>
        <FormField label="Status">
          <Select value={form.status} onChange={(event) => update("status", event.target.value as ListingStatus)}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </Select>
        </FormField>
        <FormField label="City">
          <Input value={form.city} onChange={(event) => update("city", event.target.value)} />
        </FormField>
        <FormField label="Region">
          <Input value={form.region} onChange={(event) => update("region", event.target.value)} />
        </FormField>
        <FormField label="Country">
          <Input value={form.country} onChange={(event) => update("country", event.target.value)} />
        </FormField>
      </div>
      <PhotoUploader photos={photos} onChange={setPhotos} label="Photos" />
      <FormField label="Highlights" hint="Comma separated.">
        <Input value={form.highlights} onChange={(event) => update("highlights", event.target.value)} />
      </FormField>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="accent">
          Save changes
        </Button>
        <Link href="/partner" className={buttonStyles("secondary", "no-underline")}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
