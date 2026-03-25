"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { AdminSidebar } from "@/components/admin/sidebar";
import { FormField } from "@/components/admin/form-field";
import { Banner } from "@/components/feedback/banner";
import { useToast } from "@/components/feedback/toast-provider";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { getCountryLabel } from "@/lib/auction-helpers";
import { getAssetPath } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";

const placeholderImages = ["/auction-campus.svg", "/auction-solar.svg", "/auction-sines.svg"];

export default function NewAuctionPage() {
  const router = useRouter();
  const { currentUser } = useMockSession();
  const { createAuction } = useMarketplace();
  const [savedMessage, setSavedMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { pushToast } = useToast();
  const [form, setForm] = useState({
    title: "Premium logistics portfolio in Braga",
    description:
      "Group of industrial assets with covered area, road frontage and consolidation potential for an institutional operator.",
    categoryId: categories[1].id,
    basePrice: "2750000",
    location: "Braga",
    region: "Norte",
    country: "Portugal",
    jurisdiction: "Comarca de Braga",
    saleProcedure: "insolvencia",
    caseReference: "INS-BRG-2026-041",
    administratorName: "Paula Reis",
    administratorEntity: "Reis & Parceiros",
    occupancyStatus: "Partially occupied",
    encumbrancesSummary: "Operating contracts under review and security package to be confirmed",
    startDate: "2026-04-18T09:00",
    endDate: "2026-05-18T18:00",
    images: placeholderImages.join(", "),
    seller: "Braga Industrial Insolvency Estate",
    executiveSummary:
      "Strong regional industrial profile, Insolvency process with competitive tension potential, Core documentation prepared for demo",
    highlights:
      "18,000 sqm operational footprint, Priority road access, Occupancy agreements under review",
    legalNotes:
      "Sale remains subject to formal process validation, Proposing entity must accept the full sale terms",
    submissionRequirements:
      "Identification of the proposing entity, Proof of financial capacity, Acceptance of the sale rules"
  });

  const preview = useMemo(
    () => ({
      title: form.title,
      description: form.description,
      categoryId: form.categoryId,
      basePrice: Number(form.basePrice) || 0,
      location: form.location,
      region: form.region,
      country: form.country,
      jurisdiction: form.jurisdiction,
      saleProcedure: form.saleProcedure,
      caseReference: form.caseReference,
      administratorName: form.administratorName,
      administratorEntity: form.administratorEntity,
      occupancyStatus: form.occupancyStatus,
      encumbrancesSummary: form.encumbrancesSummary,
      startDate: form.startDate,
      endDate: form.endDate,
      seller: form.seller,
      executiveSummary: form.executiveSummary.split(",").map((item) => item.trim()).filter(Boolean),
      images: form.images.split(",").map((item) => item.trim()).filter(Boolean),
      highlights: form.highlights.split(",").map((item) => item.trim()).filter(Boolean),
      legalNotes: form.legalNotes.split(",").map((item) => item.trim()).filter(Boolean),
      submissionRequirements: form.submissionRequirements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }),
    [form]
  );

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <PageShell>
        <div className="shell section-space">
          <EmptyState
            title="Access restricted to administrators"
            description="Sign in from the header with the mock admin profile to create processes."
          />
        </div>
      </PageShell>
    );
  }

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) {
      pushToast({ tone: "error", text: "Sign in with the mock admin profile before creating a process." });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 650));

    createAuction(
      {
        title: preview.title,
        description: preview.description,
        categoryId: preview.categoryId,
        basePrice: preview.basePrice,
        location: preview.location,
        region: preview.region,
        country: preview.country,
        jurisdiction: preview.jurisdiction,
        saleProcedure: preview.saleProcedure as
          | "insolvencia"
          | "liquidacao"
          | "reestruturacao"
          | "venda-judicial"
          | "venda-privada",
        caseReference: preview.caseReference,
        administratorName: preview.administratorName,
        administratorEntity: preview.administratorEntity,
        occupancyStatus: preview.occupancyStatus,
        encumbrancesSummary: preview.encumbrancesSummary,
        startDate: new Date(preview.startDate).toISOString(),
        endDate: new Date(preview.endDate).toISOString(),
        images: preview.images.length > 0 ? preview.images : placeholderImages,
        seller: preview.seller,
        executiveSummary: preview.executiveSummary,
        highlights: preview.highlights,
        legalNotes: preview.legalNotes,
        submissionRequirements: preview.submissionRequirements
      },
      currentUser.id
    );

    setSavedMessage("Process created in local memory and added to the dashboard.");
    pushToast({ tone: "success", text: "New process created in the current review session." });
    setIsSaving(false);
    setTimeout(() => router.push("/admin"), 900);
  }

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-8 xl:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
            <form onSubmit={handleSubmit} className="rounded-[2rem] bg-surface-low p-6 tonal-rule">
              <p className="institutional-kicker">New process</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em]">
                Create a process record with legal and jurisdictional context.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
                Use this workspace to assemble the core commercial, legal, and jurisdictional information
                required to present a process in the current review session.
              </p>
              <div className="mt-8 grid gap-5">
                <FormField label="Title">
                  <Input value={form.title} onChange={(event) => setField("title", event.target.value)} />
                </FormField>
                <FormField label="Description">
                  <Textarea value={form.description} onChange={(event) => setField("description", event.target.value)} />
                </FormField>
                <div className="grid gap-5 lg:grid-cols-2">
                  <FormField label="Category">
                    <Select value={form.categoryId} onChange={(event) => setField("categoryId", event.target.value)}>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Procedure">
                    <Select value={form.saleProcedure} onChange={(event) => setField("saleProcedure", event.target.value)}>
                      <option value="insolvencia">Insolvency</option>
                      <option value="liquidacao">Liquidation</option>
                      <option value="reestruturacao">Restructuring</option>
                      <option value="venda-judicial">Judicial sale</option>
                      <option value="venda-privada">Private sale</option>
                    </Select>
                  </FormField>
                </div>
                <div className="grid gap-5 lg:grid-cols-3">
                  <FormField label="Country">
                    <Select value={form.country} onChange={(event) => setField("country", event.target.value)}>
                      <option value="Portugal">Portugal</option>
                      <option value="Espanha">Spain</option>
                      <option value="Italia">Italy</option>
                      <option value="Franca">France</option>
                    </Select>
                  </FormField>
                  <FormField label="Location">
                    <Input value={form.location} onChange={(event) => setField("location", event.target.value)} />
                  </FormField>
                  <FormField label="Region">
                    <Input value={form.region} onChange={(event) => setField("region", event.target.value)} />
                  </FormField>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  <FormField label="Jurisdiction">
                    <Input value={form.jurisdiction} onChange={(event) => setField("jurisdiction", event.target.value)} />
                  </FormField>
                  <FormField label="Case reference">
                    <Input value={form.caseReference} onChange={(event) => setField("caseReference", event.target.value)} />
                  </FormField>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  <FormField label="Administrator">
                    <Input value={form.administratorName} onChange={(event) => setField("administratorName", event.target.value)} />
                  </FormField>
                  <FormField label="Responsible entity">
                    <Input
                      value={form.administratorEntity}
                      onChange={(event) => setField("administratorEntity", event.target.value)}
                    />
                  </FormField>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  <FormField label="Base price in EUR">
                    <Input value={form.basePrice} onChange={(event) => setField("basePrice", event.target.value)} />
                  </FormField>
                  <FormField label="Occupancy status">
                    <Input value={form.occupancyStatus} onChange={(event) => setField("occupancyStatus", event.target.value)} />
                  </FormField>
                </div>
                <FormField label="Encumbrance summary">
                  <Textarea
                    value={form.encumbrancesSummary}
                    onChange={(event) => setField("encumbrancesSummary", event.target.value)}
                  />
                </FormField>
                <div className="grid gap-5 lg:grid-cols-2">
                  <FormField label="Start date">
                    <Input type="datetime-local" value={form.startDate} onChange={(event) => setField("startDate", event.target.value)} />
                  </FormField>
                  <FormField label="End date">
                    <Input type="datetime-local" value={form.endDate} onChange={(event) => setField("endDate", event.target.value)} />
                  </FormField>
                </div>
                <FormField label="Mock images" hint="Separate with commas. In this phase we use local mock images.">
                  <Input value={form.images} onChange={(event) => setField("images", event.target.value)} />
                </FormField>
                <FormField label="Selling entity">
                  <Input value={form.seller} onChange={(event) => setField("seller", event.target.value)} />
                </FormField>
                <FormField label="Executive summary" hint="Separate with commas to highlight key points at the top of the detail page.">
                  <Textarea
                    value={form.executiveSummary}
                    onChange={(event) => setField("executiveSummary", event.target.value)}
                  />
                </FormField>
                <FormField label="Highlights" hint="Separate with commas.">
                  <Textarea value={form.highlights} onChange={(event) => setField("highlights", event.target.value)} />
                </FormField>
                <FormField label="Legal notes" hint="Separate with commas.">
                  <Textarea value={form.legalNotes} onChange={(event) => setField("legalNotes", event.target.value)} />
                </FormField>
                <FormField label="Submission requirements" hint="Separate with commas.">
                  <Textarea
                    value={form.submissionRequirements}
                    onChange={(event) => setField("submissionRequirements", event.target.value)}
                  />
                </FormField>
                {savedMessage ? <Banner tone="success">{savedMessage}</Banner> : null}
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save process in mock state"}
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => router.push("/admin")} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>

            <aside className="grid gap-6">
              <div className="rounded-[2rem] bg-surface-legal p-6 tonal-rule">
                <p className="institutional-kicker">Record guidance</p>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-surface-lowest px-4 py-4 tonal-rule">
                    Define the process perimeter clearly: jurisdiction, responsible entity, and timing should read cleanly at first glance.
                  </div>
                  <div className="rounded-2xl bg-surface-lowest px-4 py-4 tonal-rule">
                    Keep the executive summary concise and directional. It should explain why the case matters before the user reaches documentation.
                  </div>
                  <div className="rounded-2xl bg-surface-lowest px-4 py-4 tonal-rule">
                    The preview updates live and should be treated as the presentation surface for the record you are assembling.
                  </div>
                </div>
              </div>
              <aside className="rounded-[2rem] bg-surface-lowest p-6 shadow-ambient tonal-rule">
              <p className="institutional-kicker">Preview</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">
                {preview.title}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {getCountryLabel(preview.country)} / {preview.location} / {preview.jurisdiction}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">{preview.description}</p>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-surface-low p-3">
                <img src={getAssetPath(preview.images[0] ?? placeholderImages[0])} alt={preview.title} className="h-64 w-full rounded-[1.1rem] object-cover" />
              </div>
              <div className="mt-6 rounded-[1.5rem] bg-surface-low p-5">
                <p className="institutional-kicker">Opening value in EUR</p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] text-tertiary-ink">
                  {formatCurrency(preview.basePrice)}
                </p>
              </div>
              <div className="mt-6 rounded-[1.5rem] bg-surface-low p-5 text-sm">
                <p className="font-medium text-ink">{preview.caseReference}</p>
                <p className="mt-2 text-muted">{preview.administratorEntity}</p>
              </div>
              <div className="mt-6 grid gap-3">
                {preview.executiveSummary.map((item) => (
                  <div key={item} className="rounded-2xl bg-tertiary/50 px-4 py-4 text-sm text-tertiary-ink">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3">
                {preview.legalNotes.map((note) => (
                  <div key={note} className="rounded-2xl bg-surface-low px-4 py-4 text-sm">
                    {note}
                  </div>
                ))}
              </div>
              </aside>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
