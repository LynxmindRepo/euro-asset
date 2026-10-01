import {
  assetCities,
  buyerCountries,
  customsClearance,
  domesticTransferShare,
  energyTransferRate,
  fxSpread,
  languageCountry,
  transportRates
} from "@/data/cost-rates";
import { eurRates } from "@/data/currencies";
import { formatCurrency, formatMeasure, UnitSystem } from "@/lib/utils";
import { Listing } from "@/types";

export type CostLine = {
  id: "asset" | "transport" | "ferry" | "registration" | "customs" | "transfer" | "fx";
  label: string;
  detail: string;
  amountEur: number;
};

export type CostEstimate = {
  lines: CostLine[];
  totalEur: number;
  extrasEur: number;
  currency: string;
  units: UnitSystem;
  rate: number;
  distanceKm: number | null;
  /** "Thinking" steps shown by the AI-style animation. */
  steps: string[];
  summary: string;
  followUps: { question: string; answer: string }[];
};

const immovableCategories = new Set(["real-estate", "energy"]);

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function specNumber(listing: Listing, match: (label: string) => boolean) {
  const spec = listing.specs.find((item) => match(item.label.toLowerCase()) && typeof item.value === "number");
  return spec ? (spec.value as number) : null;
}

/** Number of separate items in a lot (vehicles, units…), used for transport and registration. */
function itemCount(listing: Listing) {
  return specNumber(listing, (label) => label === "vehicles" || label === "units") ?? 1;
}

function totalWeightKg(listing: Listing) {
  const weight = specNumber(listing, (label) => label.includes("weight"));
  if (weight) return weight;
  const defaults: Record<string, number> = { vehicles: 3500, machinery: 6000, inventory: 8000, "it-office": 2000 };
  return defaults[listing.categoryId] ?? 5000;
}

export function guessBuyerCountry(language: string | undefined, fallback: string) {
  if (!language) return fallback;
  const byFull = languageCountry[language];
  const byShort = languageCountry[language.split("-")[0]];
  return byFull ?? byShort ?? fallback;
}

export function estimateTotalCost(
  listing: Listing,
  buyerCountryName: string,
  currency: string,
  units: UnitSystem = "metric"
): CostEstimate {
  const buyer = buyerCountries.find((country) => country.name === buyerCountryName) ?? buyerCountries[0];
  const assetCountry = buyerCountries.find((country) => country.name === listing.country);
  const origin = assetCities[listing.city] ?? assetCountry ?? buyer;
  const rate = eurRates[currency] ?? 1;
  const money = (eur: number) => formatCurrency(eur * rate, currency);
  const km = (value: number) => formatMeasure(value, "km", units);
  const kg = (value: number) => formatMeasure(value, "kg", units);
  const sameCountry = buyer.name === listing.country;
  const crossesBorder = !sameCountry;
  const outsideEu = crossesBorder && (!buyer.eu || (assetCountry ? !assetCountry.eu : false));

  const lines: CostLine[] = [
    { id: "asset", label: "Asking price", detail: `Set by the Disposal Partner`, amountEur: listing.price }
  ];
  const steps = ["Reading the listing and its specifications"];
  const followUps: CostEstimate["followUps"] = [];
  let distanceKm: number | null = null;

  if (immovableCategories.has(listing.categoryId)) {
    const isProperty = listing.categoryId === "real-estate";
    const transferRate = isProperty ? (assetCountry?.propertyTransferRate ?? 0.07) : energyTransferRate;
    const amount = Math.round(listing.price * transferRate);
    steps.push(`Checking transfer costs for assets located in ${listing.country}`);
    lines.push({
      id: "transfer",
      label: isProperty ? "Transfer taxes and notary" : "Legal and transfer costs",
      detail: `≈${(transferRate * 100).toFixed(1).replace(".0", "")}% in ${listing.country}`,
      amountEur: amount
    });
    followUps.push({
      question: "Why is there no transport cost?",
      answer: `This is an immovable asset in ${listing.city}, so nothing has to be shipped. Instead, the buyer usually pays ${
        isProperty ? "property transfer taxes and notary fees" : "legal and contract-transfer costs"
      } — around ${(transferRate * 100).toFixed(1).replace(".0", "")}% of the price in ${listing.country}, which is about ${money(amount)} here.`
    });
  } else {
    const roadKm = Math.max(50, Math.round(haversineKm(origin, buyer) * transportRates.roadFactor));
    distanceKm = roadKm;
    steps.push(`Calculating the road route ${listing.city} → ${buyer.city} (≈${km(roadKm)})`);

    const count = itemCount(listing);
    const weight = totalWeightKg(listing);
    let transport: number;
    let mode: string;
    /** Same choice phrased for the follow-up answer (without repeating the weight). */
    let modeSentence: string;

    if (listing.categoryId === "vehicles") {
      transport = count * (transportRates.vehicle.handling + roadKm * transportRates.vehicle.perKm);
      mode = count > 1 ? `${count} vehicles, driven or on a car transporter` : "Driven or on a car transporter";
      modeSentence = count > 1 ? `the ${count} vehicles are driven or carried on a car transporter` : "it is driven or carried on a car transporter";
    } else if (listing.categoryId === "machinery" && weight / count >= transportRates.lowLoader.heavyFromKg) {
      transport = count * (transportRates.lowLoader.handling + roadKm * transportRates.lowLoader.perKm);
      mode = `Low-loader for ${kg(weight)}`;
      modeSentence = "it needs a low-loader for heavy machinery";
    } else {
      const trucks = Math.max(1, Math.ceil(weight / transportRates.truck.capacityKg));
      transport = trucks * (transportRates.truck.handling + roadKm * transportRates.truck.perKm);
      mode = `${trucks} truck${trucks > 1 ? "s" : ""} for ${kg(weight)}`;
      modeSentence = `it fits on ${trucks === 1 ? "one standard truck" : `${trucks} standard trucks`}`;
    }

    lines.push({ id: "transport", label: "Transport", detail: `${mode} · ≈${km(roadKm)}`, amountEur: Math.round(transport) });

    const ferryNeeded = crossesBorder && (buyer.ferry || Boolean(assetCountry?.ferry));
    if (ferryNeeded) {
      lines.push({ id: "ferry", label: "Ferry crossing", detail: "Sea crossing to or from the islands", amountEur: transportRates.ferry });
    }

    followUps.push({
      question: "Explain the transport estimate",
      answer: `The asset is in ${listing.city}, about ${km(roadKm)} by road from ${buyer.city}. Based on its weight (${kg(weight)}), I assumed ${modeSentence}. That comes to roughly ${money(transport)}${
        ferryNeeded ? `, plus about ${money(transportRates.ferry)} for the ferry` : ""
      }. A transport company can give you an exact quote.`
    });

    if (listing.requiresRegistration) {
      const fee = sameCountry ? Math.round(buyer.registrationFee * domesticTransferShare) : buyer.registrationFee;
      steps.push(`Checking ${sameCountry ? "ownership transfer" : "re-registration"} rules in ${buyer.name}`);
      lines.push({
        id: "registration",
        label: sameCountry ? "Ownership transfer" : `Re-registration in ${buyer.name}`,
        detail:
          count > 1
            ? `${count} × ${money(fee)}`
            : sameCountry
              ? "Change of registered owner"
              : "Plates, inspection and fees",
        amountEur: fee * count
      });
      followUps.push({
        question: "What about registration?",
        answer: sameCountry
          ? `Buyer and asset are both in ${buyer.name}, so only an ownership transfer is needed — about ${money(fee)} per item.`
          : `Vehicles and some machinery must be re-registered in the buyer's country. In ${buyer.name} that typically means new plates, a technical inspection and fees — about ${money(
              fee
            )} per item${count > 1 ? `, so ${money(fee * count)} for this lot of ${count}` : ""}.`
      });
    }
  }

  if (outsideEu) {
    steps.push("Checking customs formalities outside the EU");
    lines.push({
      id: "customs",
      label: "Customs clearance",
      detail: `Import VAT and duties in ${buyer.name} not included`,
      amountEur: customsClearance
    });
  }

  if (currency !== "EUR") {
    const fx = Math.round(listing.price * fxSpread);
    steps.push(`Converting to ${currency} at an indicative rate (1 EUR = ${rate} ${currency})`);
    lines.push({
      id: "fx",
      label: "Currency conversion",
      detail: `≈${(fxSpread * 100).toFixed(1)}% bank spread on the price`,
      amountEur: fx
    });
  }

  steps.push("Putting the estimate together");

  const totalEur = lines.reduce((sum, line) => sum + line.amountEur, 0);
  const extrasEur = totalEur - listing.price;
  const biggest = lines.filter((line) => line.id !== "asset").sort((a, b) => b.amountEur - a.amountEur)[0];

  const intro = immovableCategories.has(listing.categoryId)
    ? `For a buyer in ${buyer.name}, "${listing.title}"`
    : `Bringing "${listing.title}" to ${buyer.name}`;
  const summary = `${intro} would cost about ${money(totalEur)} in total: ${money(
    listing.price
  )} for the asset plus roughly ${money(extrasEur)} in extra costs.${
    biggest ? ` The biggest extra is ${biggest.label.toLowerCase()} (${money(biggest.amountEur)}).` : ""
  }`;

  followUps.push({
    question: "Why is this only an estimate?",
    answer:
      "These figures use typical rates for transport, registration and currency exchange, not live quotes. Real costs depend on the carrier, the date, the exact route and local rules — confirm them with the seller and service providers before you buy."
  });

  return { lines, totalEur, extrasEur, currency, units, rate, distanceKm, steps, summary, followUps };
}
