import { categories } from "@/data/categories";
import { partners } from "@/data/partners";
import { DisposalPartner, Listing, ListingOrigin, ListingStatus, PartnerType } from "@/types";

export function getCategoryLabel(categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.label ?? "Other";
}

export function getOriginLabel(origin: ListingOrigin) {
  switch (origin) {
    case "insolvency":
      return "Insolvency";
    case "liquidation":
      return "Liquidation";
    case "restructuring":
      return "Restructuring";
    case "judicial-sale":
      return "Judicial sale";
    default:
      return "Private sale";
  }
}

export function getStatusLabel(status: ListingStatus) {
  switch (status) {
    case "reserved":
      return "Reserved";
    case "sold":
      return "Sold";
    default:
      return "Available";
  }
}

export function getPartnerTypeLabel(type: PartnerType) {
  switch (type) {
    case "broker":
      return "Broker";
    case "auctioneer":
      return "Licensed auctioneer";
    case "disposal-firm":
      return "Disposal firm";
    default:
      return "Insolvency administrator";
  }
}

export function getPartner(partnerId: string): DisposalPartner | undefined {
  return partners.find((partner) => partner.id === partnerId);
}

/** Countries that currently have listings, sorted alphabetically. */
export function getListingCountries(listings: Listing[]) {
  return Array.from(new Set(listings.map((listing) => listing.country))).sort();
}

export function getLatestListings(listings: Listing[], count = 6) {
  return [...listings]
    .filter((listing) => listing.status !== "sold")
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, count);
}

// Placeholder image per category, used when a new listing has no photos yet.
const categoryPlaceholders: Record<string, string> = {
  vehicles: "/listings/truck.svg",
  machinery: "/listings/excavator.svg",
  "real-estate": "/lisbon-terminal-hero.png",
  inventory: "/listings/pallets.svg",
  "it-office": "/listings/office.svg",
  energy: "/valencia-solar-hero.png"
};

export function getCategoryPlaceholder(categoryId: string) {
  return categoryPlaceholders[categoryId] ?? "/listings/pallets.svg";
}
