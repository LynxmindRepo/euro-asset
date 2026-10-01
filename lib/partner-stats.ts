import { Inquiry, Listing } from "@/types";

// Simulated performance figures for the Disposal Partner dashboard. Presentation prototype: nothing is tracked.
// Numbers are derived from the listing id, so they are stable between visits, and they add the visitor's real
// activity in this session (messages sent, favourites) so the demo reacts to what the presenter does.

/** Small deterministic hash → [0, 1). */
function seeded(key: string) {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

export type ListingStats = { listing: Listing; views: number; saves: number; messages: number };

export type PartnerStats = {
  perListing: ListingStats[];
  totals: { views: number; saves: number; messages: number };
  /** Views per day, oldest first (last 14 days). */
  daily: { date: Date; views: number }[];
  /** Share of views per buyer country, largest first; percentages add up to 100. */
  markets: { country: string; share: number }[];
  /** Percentage of views from outside the partner's own country. */
  abroadShare: number;
};

const DAYS = 14;

export function buildPartnerStats(
  partnerCountry: string,
  listings: Listing[],
  inquiries: Inquiry[],
  favouriteIds: string[],
  markets: string[],
  now = new Date()
): PartnerStats {
  const perListing = listings.map((listing) => {
    const base = seeded(listing.id);
    const views = 140 + Math.round(base * 760);
    return {
      listing,
      views,
      saves: Math.round(views * (0.04 + seeded(`${listing.id}-saves`) * 0.05)) + (favouriteIds.includes(listing.id) ? 1 : 0),
      // Real messages only, so the table matches the "Buyer messages" inbox on the same page.
      messages: inquiries.filter((inquiry) => inquiry.listingId === listing.id).length
    };
  });

  const totals = perListing.reduce(
    (sum, item) => ({ views: sum.views + item.views, saves: sum.saves + item.saves, messages: sum.messages + item.messages }),
    { views: 0, saves: 0, messages: 0 }
  );

  // Spread the views over the last 14 days with a gentle upward trend and weekday/weekend rhythm.
  const weights = Array.from({ length: DAYS }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (DAYS - 1 - index));
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    return { date, weight: (0.75 + index * 0.035) * (weekend ? 0.6 : 1) * (0.85 + seeded(`day-${index}`) * 0.3) };
  });
  const weightSum = weights.reduce((sum, day) => sum + day.weight, 0);
  const recentViews = Math.round(totals.views * 0.55);
  const daily = weights.map((day) => ({ date: day.date, views: Math.round((day.weight / weightSum) * recentViews) }));

  // Buyer markets: the partner's own country gets a modest share, the rest comes from abroad.
  const raw = markets.map((country) => ({
    country,
    weight: country === partnerCountry ? 1.6 : 0.6 + seeded(`market-${country}`) * 1.2
  }));
  const rawSum = raw.reduce((sum, item) => sum + item.weight, 0) || 1;
  const shares = raw.map((item) => ({ country: item.country, share: Math.round((item.weight / rawSum) * 100) }));
  // Make the rounded percentages add up to exactly 100.
  const drift = 100 - shares.reduce((sum, item) => sum + item.share, 0);
  if (shares.length > 0) shares.sort((a, b) => b.share - a.share)[0].share += drift;
  const sorted = shares.sort((a, b) => b.share - a.share);
  const domestic = sorted.find((item) => item.country === partnerCountry)?.share ?? 0;

  return {
    perListing: perListing.sort((a, b) => b.views - a.views),
    totals,
    daily,
    markets: sorted,
    abroadShare: 100 - domestic
  };
}
