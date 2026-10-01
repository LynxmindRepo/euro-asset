"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { FormField } from "@/components/admin/form-field";
import { useToast } from "@/components/feedback/toast-provider";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PhotoUploader } from "@/components/ui/photo-uploader";
import { Select } from "@/components/ui/select";
import { categories } from "@/data/categories";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getCategoryPlaceholder } from "@/lib/listing-helpers";
import { getAssetPath } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";
import { ListingOrigin } from "@/types";


const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function NewListingPage() {
  const router = useRouter();
  const { currentUser } = useMockSession();
  const { createListing, partners } = useMarketplace();
  const { pushToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "Mercedes-Benz Actros 1845 tractor unit, 2020",
    description:
      "Tractor unit from a haulage company's insolvency, with full service history. Available for viewing in Braga.",
    categoryId: "vehicles",
    origin: "insolvency" as ListingOrigin,
    price: "52000",
    city: "Braga",
    region: "Norte",
    country: "Portugal",
    partnerId: partners[0]?.id ?? "",
    highlights: "Full service history, Recent tyres, Ready for export",
    requiresRegistration: true
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const [photos, setPhotos] = useState<string[]>([]);
  const previewImage = photos[0] ?? getCategoryPlaceholder(form.categoryId);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <PageShell>
        <div className="shell section-space">
          <div className="panel-xl bg-surface-low">
            <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">Sign in with the admin profile to publish listings.</h1>
            <div className="mt-6">
              <Button onClick={() => window.dispatchEvent(new Event("open-mock-login"))}>Open login</Button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const created = createListing(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        origin: form.origin,
        price: Number(form.price) || 0,
        city: form.city.trim(),
        region: form.region.trim(),
        country: form.country.trim(),
        partnerId: form.partnerId,
        images: photos.length > 0 ? photos : [previewImage],
        highlights: splitList(form.highlights),
        requiresRegistration: form.requiresRegistration
      },
      currentUser!.id
    );

    pushToast({ tone: "success", text: `"${created.title}" is now live in this session.` });
    router.push("/admin");
  }

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-8 xl:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div>
            <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">New listing</h1>
            <p className="support-copy mt-2 max-w-2xl">
              The same information you already prepared for your local sale: category, location, photos and a
              description. The listing is created in memory for this demo session. Already have the listing written
              somewhere?{" "}
              <Link href="/admin/import" className="font-semibold text-primary">
                Import it automatically
              </Link>
              .
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <form onSubmit={handleSubmit} className="grid gap-5 rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
                <FormField label="Title">
                  <Input required value={form.title} onChange={(event) => update("title", event.target.value)} />
                </FormField>
                <FormField label="Description">
                  <Textarea required value={form.description} onChange={(event) => update("description", event.target.value)} />
                </FormField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Category">
                    <Select value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)}>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Origin">
                    <Select value={form.origin} onChange={(event) => update("origin", event.target.value as ListingOrigin)}>
                      <option value="insolvency">Insolvency</option>
                      <option value="liquidation">Liquidation</option>
                      <option value="restructuring">Restructuring</option>
                      <option value="judicial-sale">Judicial sale</option>
                      <option value="private-sale">Private sale</option>
                    </Select>
                  </FormField>
                  <FormField label="Asking price (EUR)">
                    <Input
                      required
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={form.price}
                      onChange={(event) => update("price", event.target.value)}
                    />
                  </FormField>
                  <FormField label="Disposal Partner">
                    <Select value={form.partnerId} onChange={(event) => update("partnerId", event.target.value)}>
                      {partners.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="City">
                    <Input required value={form.city} onChange={(event) => update("city", event.target.value)} />
                  </FormField>
                  <FormField label="Region">
                    <Input value={form.region} onChange={(event) => update("region", event.target.value)} />
                  </FormField>
                  <FormField label="Country">
                    <Input required value={form.country} onChange={(event) => update("country", event.target.value)} />
                  </FormField>
                </div>
                <PhotoUploader photos={photos} onChange={setPhotos} label="Photos (optional — a category illustration is used if empty)" />
                <FormField label="Highlights" hint="Comma separated.">
                  <Input value={form.highlights} onChange={(event) => update("highlights", event.target.value)} />
                </FormField>
                <label className="flex items-center gap-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={form.requiresRegistration}
                    onChange={(event) => update("requiresRegistration", event.target.checked)}
                    className="h-5 w-5 accent-[rgb(var(--primary))]"
                  />
                  Requires re-registration in the buyer&apos;s country (vehicles, some machinery)
                </label>
                <Button type="submit" variant="accent" disabled={isSaving}>
                  {isSaving ? "Publishing…" : "Publish listing"}
                </Button>
              </form>

              <aside aria-label="Preview" className="h-fit overflow-hidden rounded-[1.75rem] bg-surface-lowest shadow-panel tonal-rule">
                <img src={getAssetPath(previewImage)} alt="" className="h-48 w-full object-cover" />
                <div className="p-5">
                  <p className="eyebrow">Preview</p>
                  <p className="mt-2 font-display text-xl font-semibold text-ink">{form.title || "Untitled listing"}</p>
                  <p className="mt-1 text-sm text-muted">
                    {form.city}, {form.country}
                  </p>
                  <p className="mt-3 font-display text-2xl font-semibold text-primary">
                    {formatCurrency(Number(form.price) || 0)}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
