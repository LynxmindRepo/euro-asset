/** "user" = buyer, "partner" = Disposal Partner (seller), "admin" = Bridgeon back office. */
export type UserRole = "admin" | "partner" | "user";

export type ListingStatus = "available" | "reserved" | "sold";

/** Where the asset comes from. Bridgeon only lists assets from professional disposals. */
export type ListingOrigin =
  | "insolvency"
  | "liquidation"
  | "restructuring"
  | "judicial-sale"
  | "private-sale";

export type PartnerType = "broker" | "auctioneer" | "disposal-firm" | "administrator";

export type Category = {
  id: string;
  label: string;
  description: string;
};

export type User = {
  id: string;
  name: string;
  company: string;
  role: UserRole;
  avatar: string;
  /** Set for role "partner": the Disposal Partner this user works for. */
  partnerId?: string;
};

/** Fields a Disposal Partner can change on an existing listing. */
export type ListingUpdate = Partial<
  Pick<Listing, "title" | "description" | "price" | "status" | "city" | "region" | "country" | "highlights" | "images">
>;

/** A professional seller (broker, licensed auctioneer, disposal firm or administrator). */
export type DisposalPartner = {
  id: string;
  name: string;
  type: PartnerType;
  city: string;
  country: string;
  website: string;
  email: string;
  phone: string;
  verified: boolean;
  memberSince: string;
  description: string;
};

/** Technical characteristic. Numeric values keep their unit so they can be converted later (kg → lbs, km → miles). */
export type ListingSpec = {
  label: string;
  value: number | string;
  unit?: "kg" | "km" | "m2" | "h" | "kW" | "kWp" | "units" | "year";
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  origin: ListingOrigin;
  status: ListingStatus;
  price: number;
  currency: "EUR";
  city: string;
  region: string;
  country: string;
  images: string[];
  specs: ListingSpec[];
  highlights: string[];
  partnerId: string;
  /** Vehicles and some machinery must be re-registered in the buyer's country. */
  requiresRegistration: boolean;
  publishedAt: string;
  createdBy: string;
};

export type Inquiry = {
  id: string;
  listingId: string;
  partnerId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

/** Registration request from a company that wants to become a Disposal Partner (demo only). */
export type PartnerApplication = {
  id: string;
  company: string;
  type: PartnerType;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  volume: "1" | "2-10" | "10+";
  message: string;
  createdAt: string;
};

export type SessionEvent = {
  id: string;
  type: "listing-created" | "inquiry-sent" | "partner-application";
  listingId?: string;
  createdAt: string;
};

export type NewListingInput = {
  title: string;
  description: string;
  categoryId: string;
  origin: ListingOrigin;
  price: number;
  city: string;
  region: string;
  country: string;
  partnerId: string;
  images: string[];
  highlights: string[];
  requiresRegistration: boolean;
  /** Optional — filled by the listing import tool. */
  specs?: ListingSpec[];
};
