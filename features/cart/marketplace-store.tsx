"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { initialAuctions } from "@/data/auctions";
import { Auction, CartItem, NewAuctionInput, SessionEvent, Submission } from "@/types";
import { slugify } from "@/lib/utils";

type MarketplaceContextValue = {
  auctions: Auction[];
  cartItems: CartItem[];
  lastSubmission: Submission | null;
  sessionEvents: SessionEvent[];
  addBidIntent: (auctionId: string, amount: number, note?: string) => {
    ok: boolean;
    message: string;
  };
  updateCartItem: (itemId: string, amount: number) => void;
  removeCartItem: (itemId: string) => void;
  submitCart: (userId: string) => Promise<Submission>;
  createAuction: (input: NewAuctionInput, createdBy: string) => Auction;
  clearSubmission: () => void;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function buildAuctionFromInput(input: NewAuctionInput, createdBy: string): Auction {
  const id = `auc-${slugify(input.title)}`;

  return {
    id,
    slug: slugify(input.title),
    title: input.title,
    description: input.description,
    executiveSummary: input.executiveSummary,
    categoryId: input.categoryId,
    basePrice: input.basePrice,
    currentBid: input.basePrice,
    reserveMet: false,
    status: "agendado",
    saleProcedure: input.saleProcedure,
    location: input.location,
    region: input.region,
    country: input.country,
    jurisdiction: input.jurisdiction,
    currency: "EUR",
    startDate: input.startDate,
    endDate: input.endDate,
    images: input.images,
    bids: [],
    seller: input.seller,
    lot: `NW-${Math.floor(Math.random() * 900 + 100)}`,
    highlights: input.highlights,
    legalNotes: input.legalNotes,
    submissionRequirements: input.submissionRequirements,
    documents: [
      { id: `${id}-doc-1`, label: "Asset teaser", type: "teaser", availability: "disponivel" },
      {
        id: `${id}-doc-2`,
        label: "Sale conditions",
        type: "caderno-encargos",
        availability: "sob-pedido"
      }
    ],
    caseReference: input.caseReference,
    administratorName: input.administratorName,
    administratorEntity: input.administratorEntity,
    occupancyStatus: input.occupancyStatus,
    encumbrancesSummary: input.encumbrancesSummary,
    createdBy
  };
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      auctions,
      cartItems,
      lastSubmission,
      sessionEvents,
      addBidIntent: (auctionId, amount, note) => {
        const existingItem = cartItems.find((item) => item.auctionId === auctionId);

        if (existingItem) {
          setCartItems((current) =>
            current.map((item) =>
              item.id === existingItem.id ? { ...item, amount, note } : item
            )
          );

          return { ok: true, message: "Proposal updated in the formal dossier." };
        }

        setCartItems((current) => [
          ...current,
          { id: `cart-${Date.now()}`, auctionId, amount, note, createdAt: new Date().toISOString() }
        ]);

        return { ok: true, message: "Proposal added to the formal dossier." };
      },
      updateCartItem: (itemId, amount) => {
        setCartItems((current) =>
          current.map((item) => (item.id === itemId ? { ...item, amount } : item))
        );
      },
      removeCartItem: (itemId) => {
        setCartItems((current) => current.filter((item) => item.id !== itemId));
      },
      submitCart: async (userId) => {
        const submission: Submission = {
          id: `sub-${Date.now()}`,
          userId,
          createdAt: new Date().toISOString(),
          items: cartItems,
          totalAmount: cartItems.reduce((sum, item) => sum + item.amount, 0),
          status: "success"
        };

        await new Promise((resolve) => setTimeout(resolve, 1400));

        setLastSubmission(submission);
        setCartItems([]);
        return submission;
      },
      createAuction: (input, createdBy) => {
        const created = buildAuctionFromInput(input, createdBy);
        setAuctions((current) => [created, ...current]);
        setSessionEvents((current) => [
          { id: `event-${Date.now()}`, type: "auction-created", auctionId: created.id, createdAt: new Date().toISOString() },
          ...current
        ]);
        return created;
      },
      clearSubmission: () => setLastSubmission(null)
    }),
    [auctions, cartItems, lastSubmission, sessionEvents]
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
