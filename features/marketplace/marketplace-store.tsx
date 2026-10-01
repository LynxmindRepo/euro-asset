"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { initialListings } from "@/data/listings";
import { partners } from "@/data/partners";
import { DisposalPartner, Inquiry, Listing, NewListingInput, PartnerApplication, SessionEvent } from "@/types";
import { slugify } from "@/lib/utils";

type InquiryInput = Pick<Inquiry, "listingId" | "name" | "email" | "message">;
type ApplicationInput = Omit<PartnerApplication, "id" | "createdAt">;

type MarketplaceContextValue = {
  listings: Listing[];
  partners: DisposalPartner[];
  inquiries: Inquiry[];
  applications: PartnerApplication[];
  sessionEvents: SessionEvent[];
  /** Simulates sending a message to the Disposal Partner (no backend). */
  sendInquiry: (input: InquiryInput) => Promise<Inquiry>;
  createListing: (input: NewListingInput, createdBy: string) => Listing;
  /** Simulates a Disposal Partner registration request (no backend). */
  submitApplication: (input: ApplicationInput) => Promise<PartnerApplication>;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function buildListingFromInput(input: NewListingInput, createdBy: string): Listing {
  return {
    id: `${slugify(input.title)}-${Date.now().toString(36)}`,
    title: input.title,
    description: input.description,
    categoryId: input.categoryId,
    origin: input.origin,
    status: "available",
    price: input.price,
    currency: "EUR",
    city: input.city,
    region: input.region,
    country: input.country,
    images: input.images,
    specs: [],
    highlights: input.highlights,
    partnerId: input.partnerId,
    requiresRegistration: input.requiresRegistration,
    publishedAt: new Date().toISOString(),
    createdBy
  };
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      listings,
      partners,
      inquiries,
      applications,
      sessionEvents,
      sendInquiry: async (input) => {
        const listing = listings.find((candidate) => candidate.id === input.listingId);
        const inquiry: Inquiry = {
          ...input,
          id: `inq-${Date.now()}`,
          partnerId: listing?.partnerId ?? "",
          createdAt: new Date().toISOString()
        };

        await new Promise((resolve) => setTimeout(resolve, 900));

        setInquiries((current) => [inquiry, ...current]);
        setSessionEvents((current) => [
          { id: `event-${Date.now()}`, type: "inquiry-sent", listingId: input.listingId, createdAt: inquiry.createdAt },
          ...current
        ]);
        return inquiry;
      },
      createListing: (input, createdBy) => {
        const created = buildListingFromInput(input, createdBy);
        setListings((current) => [created, ...current]);
        setSessionEvents((current) => [
          { id: `event-${Date.now()}`, type: "listing-created", listingId: created.id, createdAt: created.publishedAt },
          ...current
        ]);
        return created;
      },
      submitApplication: async (input) => {
        const application: PartnerApplication = { ...input, id: `app-${Date.now()}`, createdAt: new Date().toISOString() };

        await new Promise((resolve) => setTimeout(resolve, 900));

        setApplications((current) => [application, ...current]);
        setSessionEvents((current) => [
          { id: `event-${Date.now()}`, type: "partner-application", createdAt: application.createdAt },
          ...current
        ]);
        return application;
      }
    }),
    [listings, inquiries, applications, sessionEvents]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);

  if (!context) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }

  return context;
}
