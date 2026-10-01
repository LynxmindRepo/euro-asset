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
import { translateText } from "@/data/translations";
import type { Language } from "@/features/preferences/language-context";
import { estimatorCopy } from "@/lib/cost-estimator-copy";
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
  /** Inputs the estimate was made for, so the UI knows when to offer a recalculation. */
  buyerCountry: string;
  language: Language;
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
  units: UnitSystem = "metric",
  language: Language = "en"
): CostEstimate {
  const t = estimatorCopy[language];
  const place = (name: string) => translateText(name, language);
  const buyer = buyerCountries.find((country) => country.name === buyerCountryName) ?? buyerCountries[0];
  const assetCountry = buyerCountries.find((country) => country.name === listing.country);
  const origin = assetCities[listing.city] ?? assetCountry ?? buyer;
  const rate = eurRates[currency] ?? 1;
  const money = (eur: number) => formatCurrency(eur * rate, currency);
  const km = (value: number) => formatMeasure(value, "km", units);
  const kg = (value: number) => formatMeasure(value, "kg", units);
  const percent = (share: number, digits = 1) => {
    const text = (share * 100).toFixed(digits).replace(/\.0$/, "");
    return language === "en" ? text : text.replace(".", ",");
  };
  const sameCountry = buyer.name === listing.country;
  const crossesBorder = !sameCountry;
  const outsideEu = crossesBorder && (!buyer.eu || (assetCountry ? !assetCountry.eu : false));
  const buyerCountry = place(buyer.name);
  const assetCountryName = place(listing.country);

  const lines: CostLine[] = [{ id: "asset", label: t.askingPrice, detail: t.setBySeller, amountEur: listing.price }];
  const steps = [t.stepRead];
  const followUps: CostEstimate["followUps"] = [];
  let distanceKm: number | null = null;

  if (immovableCategories.has(listing.categoryId)) {
    const isProperty = listing.categoryId === "real-estate";
    const transferRate = isProperty ? (assetCountry?.propertyTransferRate ?? 0.07) : energyTransferRate;
    const amount = Math.round(listing.price * transferRate);
    steps.push(t.stepTransfer(assetCountryName));
    lines.push({
      id: "transfer",
      label: isProperty ? t.transferProperty : t.transferLegal,
      detail: t.transferDetail(percent(transferRate), assetCountryName),
      amountEur: amount
    });
    followUps.push({
      question: t.qNoTransport,
      answer: t.aNoTransport(place(listing.city), isProperty, percent(transferRate), assetCountryName, money(amount))
    });
  } else {
    const roadKm = Math.max(50, Math.round(haversineKm(origin, buyer) * transportRates.roadFactor));
    distanceKm = roadKm;
    steps.push(t.stepRoute(place(listing.city), place(buyer.city), km(roadKm)));

    const count = itemCount(listing);
    const weight = totalWeightKg(listing);
    let transport: number;
    let mode: string;
    /** Same choice phrased for the follow-up answer (without repeating the weight). */
    let modeSentence: string;

    if (listing.categoryId === "vehicles") {
      transport = count * (transportRates.vehicle.handling + roadKm * transportRates.vehicle.perKm);
      mode = t.modeVehicles(count);
      modeSentence = t.sentenceVehicles(count);
    } else if (listing.categoryId === "machinery" && weight / count >= transportRates.lowLoader.heavyFromKg) {
      transport = count * (transportRates.lowLoader.handling + roadKm * transportRates.lowLoader.perKm);
      mode = t.modeLowLoader(kg(weight));
      modeSentence = t.sentenceLowLoader;
    } else {
      const trucks = Math.max(1, Math.ceil(weight / transportRates.truck.capacityKg));
      transport = trucks * (transportRates.truck.handling + roadKm * transportRates.truck.perKm);
      mode = t.modeTrucks(trucks, kg(weight));
      modeSentence = t.sentenceTrucks(trucks);
    }

    lines.push({ id: "transport", label: t.transport, detail: `${mode} · ≈${km(roadKm)}`, amountEur: Math.round(transport) });

    const ferryNeeded = crossesBorder && (buyer.ferry || Boolean(assetCountry?.ferry));
    if (ferryNeeded) {
      lines.push({ id: "ferry", label: t.ferry, detail: t.ferryDetail, amountEur: transportRates.ferry });
    }

    followUps.push({
      question: t.qTransport,
      answer: t.aTransport(
        place(listing.city),
        km(roadKm),
        place(buyer.city),
        kg(weight),
        modeSentence,
        money(transport),
        ferryNeeded ? money(transportRates.ferry) : null
      )
    });

    if (listing.requiresRegistration) {
      const fee = sameCountry ? Math.round(buyer.registrationFee * domesticTransferShare) : buyer.registrationFee;
      steps.push(t.stepRegistration(sameCountry, buyerCountry));
      lines.push({
        id: "registration",
        label: sameCountry ? t.registrationDomestic : t.registration(buyerCountry),
        detail:
          count > 1
            ? `${count} × ${money(fee)}`
            : sameCountry
              ? t.registrationDetailDomestic
              : t.registrationDetail,
        amountEur: fee * count
      });
      followUps.push({
        question: t.qRegistration,
        answer: sameCountry
          ? t.aRegistrationDomestic(buyerCountry, money(fee))
          : t.aRegistration(buyerCountry, money(fee), count > 1 ? money(fee * count) : null, count)
      });
    }
  }

  if (outsideEu) {
    steps.push(t.stepCustoms);
    lines.push({ id: "customs", label: t.customs, detail: t.customsDetail(buyerCountry), amountEur: customsClearance });
  }

  if (currency !== "EUR") {
    const fx = Math.round(listing.price * fxSpread);
    steps.push(t.stepFx(currency, rate));
    lines.push({ id: "fx", label: t.fx, detail: t.fxDetail(percent(fxSpread)), amountEur: fx });
  }

  steps.push(t.stepTotal);

  const totalEur = lines.reduce((sum, line) => sum + line.amountEur, 0);
  const extrasEur = totalEur - listing.price;
  const biggest = lines.filter((line) => line.id !== "asset").sort((a, b) => b.amountEur - a.amountEur)[0];

  const summary = t.summary(
    immovableCategories.has(listing.categoryId),
    translateText(listing.title, language),
    buyerCountry,
    money(totalEur),
    money(listing.price),
    money(extrasEur),
    biggest ? { label: biggest.label, amount: money(biggest.amountEur) } : null
  );

  followUps.push({ question: t.qEstimate, answer: t.aEstimate });

  return { lines, totalEur, extrasEur, currency, units, buyerCountry: buyer.name, language, rate, distanceKm, steps, summary, followUps };
}
