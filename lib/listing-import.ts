import { assetCities, buyerCountries } from "@/data/cost-rates";
import { eurRates } from "@/data/currencies";
import { getCategoryLabel } from "@/lib/listing-helpers";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ListingOrigin, ListingSpec } from "@/types";

// Rule-based "AI" import: turns a pasted listing (from the partner's own website or catalogue) into
// structured fields. No network, no model — deterministic keyword and pattern matching.

export type ImportedListing = {
  title: string;
  description: string;
  categoryId: string;
  origin: ListingOrigin;
  price: number;
  /** Price as written in the source, e.g. "495 000 SEK". */
  sourcePrice: string | null;
  city: string;
  country: string;
  specs: ListingSpec[];
  highlights: string[];
  requiresRegistration: boolean;
};

export type ImportResult = {
  listing: ImportedListing;
  /** Fields the parser could not find — the partner should fill them in. */
  missing: Array<"price" | "location" | "category">;
  /** Steps shown by the AI-style animation. */
  steps: string[];
};

const extraCities: Record<string, string> = {
  Hamburg: "Germany",
  Munich: "Germany",
  Berlin: "Germany",
  Stockholm: "Sweden",
  Malmö: "Sweden",
  Oslo: "Norway",
  Copenhagen: "Denmark",
  Warsaw: "Poland",
  Madrid: "Spain",
  Barcelona: "Spain",
  Paris: "France",
  Lyon: "France",
  Rome: "Italy",
  Turin: "Italy",
  Porto: "Portugal",
  Braga: "Portugal",
  Antwerp: "Belgium",
  Brussels: "Belgium",
  Amsterdam: "Netherlands",
  Vienna: "Austria",
  Dublin: "Ireland",
  London: "United Kingdom",
  Prague: "Czechia",
  Zurich: "Switzerland",
  Lisbon: "Portugal",
  Valencia: "Spain",
  Milan: "Italy",
  Marseille: "France",
  Gothenburg: "Sweden",
  Cologne: "Germany",
  Rotterdam: "Netherlands"
};

/** Local city names → the English name used across the site. */
const cityAliases: Record<string, string> = {
  Göteborg: "Gothenburg",
  Köln: "Cologne",
  München: "Munich",
  Lisboa: "Lisbon",
  Milano: "Milan",
  Wien: "Vienna",
  Praha: "Prague",
  Warszawa: "Warsaw",
  København: "Copenhagen",
  Bruxelles: "Brussels",
  Antwerpen: "Antwerp",
  Zürich: "Zurich"
};

const countryAliases: Record<string, string> = {
  sverige: "Sweden",
  deutschland: "Germany",
  españa: "Spain",
  espana: "Spain",
  italia: "Italy",
  polska: "Poland",
  danmark: "Denmark",
  norge: "Norway",
  nederland: "Netherlands",
  österreich: "Austria",
  schweiz: "Switzerland",
  uk: "United Kingdom"
};

const categoryKeywords: Record<string, string[]> = {
  vehicles: ["truck", "lorry", "lkw", "van", "trailer", "tractor unit", "sattelzug", "lastbil", "bus", "semi-trailer", "auflieger", "car "],
  machinery: ["excavator", "bagger", "grävmaskin", "forklift", "gaffeltruck", "stapler", "cnc", "lathe", "crane", "loader", "machine", "maschine", "maskin", "compressor"],
  "real-estate": ["warehouse", "office building", "building", "property", "plot", "land", "halle", "fastighet", "industrial site"],
  inventory: ["stock", "inventory", "pallets", "pallet", "clothing", "textiles", "goods", "lot of"],
  "it-office": ["server", "laptop", "computer", "desk", "chairs", "furniture", "monitor", "it equipment"],
  energy: ["solar", "photovoltaic", " pv ", "generator", "turbine", "battery storage", "wind"]
};

const originKeywords: Array<[ListingOrigin, string[]]> = [
  ["insolvency", ["insolvency", "insolvent", "bankrupt", "konkurs", "insolvenz", "faillite"]],
  ["liquidation", ["liquidation", "liquidación", "liquidazione", "likvidation"]],
  ["restructuring", ["restructur", "omstrukturering", "sanierung"]],
  ["judicial-sale", ["court", "judicial", "tribunal", "gericht", "zwangsversteigerung"]]
];

const currencySymbols: Record<string, string> = { "€": "EUR", "£": "GBP", $: "USD", kr: "SEK", "kr.": "SEK", ":-": "SEK", zł: "PLN", kč: "CZK" };

/** "540 000", "79.500", "18,000", "1.234,50" → number. */
function parseAmount(raw: string) {
  const cleaned = raw.replace(/[\s'’]/g, "");
  const lastSep = Math.max(cleaned.lastIndexOf("."), cleaned.lastIndexOf(","));
  if (lastSep === -1) return Number(cleaned);
  const decimals = cleaned.length - lastSep - 1;
  // A separator followed by exactly 3 digits is a thousands separator; otherwise it's the decimal mark.
  if (decimals === 3) return Number(cleaned.replace(/[.,]/g, ""));
  return Number(cleaned.slice(0, lastSep).replace(/[.,]/g, "") + "." + cleaned.slice(lastSep + 1));
}

// Either a number with thousands separators ("495 000", "79.500", "18,000") or a plain/decimal number.
// Separators never span line breaks or ", ", so "2016, 9.850" is read as two numbers.
const NUM = String.raw`(\d{1,3}(?:[ .,'’]\d{3})+(?:[.,]\d{1,2})?(?!\d)|\d+(?:[.,]\d+)?)`;

function findPrice(text: string) {
  const codes = Object.keys(eurRates).join("|");
  const before = new RegExp(String.raw`(€|£|\$|\b(?:${codes})\b)\s?${NUM}`, "i");
  const after = new RegExp(String.raw`${NUM}\s?(€|£|\b(?:${codes})\b|kr\.?|:-|zł|kč)`, "i");
  // Prefer a line that talks about the price.
  const lines = text.split(/\n/);
  const priceLine = lines.find((line) => /price|pris|preis|prix|prezzo|asking|€|£|\b(eur|sek|gbp|usd)\b/i.test(line)) ?? text;

  for (const candidate of [priceLine, text]) {
    const b = candidate.match(before);
    const a = candidate.match(after);
    const match = b ? { symbol: b[1], amount: b[2], source: b[0] } : a ? { symbol: a[2], amount: a[1], source: a[0] } : null;
    if (match) {
      const symbol = match.symbol.toLowerCase();
      const currency = currencySymbols[match.symbol] ?? currencySymbols[symbol] ?? match.symbol.toUpperCase();
      const amount = parseAmount(match.amount);
      if (amount > 0 && eurRates[currency]) {
        return { eur: Math.round(amount / eurRates[currency]), source: match.source.trim(), currency };
      }
    }
  }
  return null;
}

function findMeasure(text: string, unitPattern: string) {
  const match = text.match(new RegExp(String.raw`${NUM} ?(${unitPattern})(?![\p{L}])`, "iu"));
  return match ? { value: parseAmount(match[1]), unit: match[2].toLowerCase() } : null;
}

function findLocation(text: string) {
  const known = { ...extraCities };
  for (const city of Object.keys(assetCities)) known[city] ??= "";
  for (const country of buyerCountries) known[country.city] ??= country.name;

  // Unicode-aware word boundaries (\b doesn't treat "ö" as a letter, so "Malmö" would never match).
  const word = (value: string) => new RegExp(String.raw`(?<![\p{L}])${value}(?![\p{L}])`, "iu");
  const city =
    Object.keys(known).find((name) => word(name).test(text)) ??
    Object.entries(cityAliases).find(([alias]) => word(alias).test(text))?.[1];
  const lower = text.toLowerCase();
  const country =
    buyerCountries.find((item) => lower.includes(item.name.toLowerCase()))?.name ??
    Object.entries(countryAliases).find(([alias]) => word(alias).test(text))?.[1] ??
    (city ? known[city] : "");

  return { city: city ?? "", country: country || (city ? known[city] : "") };
}

function scoreCategory(text: string) {
  const lower = ` ${text.toLowerCase()} `;
  const scores = Object.entries(categoryKeywords).map(([id, words]) => [id, words.filter((word) => lower.includes(word)).length] as const);
  const best = scores.sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : null;
}

export function parseListingText(input: string): ImportResult {
  const text = input.replace(/\r/g, "").trim();
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const title = (lines[0] ?? "").replace(/^[#*\-•\s]+/, "").slice(0, 120);
  const bulletLines = lines.slice(1).filter((line) => /^[-•*–]\s?/.test(line));
  const highlights = bulletLines.map((line) => line.replace(/^[-•*–]\s?/, "")).slice(0, 5);

  const price = findPrice(text);
  const location = findLocation(text);
  const categoryId = scoreCategory(text);
  const origin = originKeywords.find(([, words]) => words.some((word) => text.toLowerCase().includes(word)))?.[0] ?? "private-sale";

  const specs: ListingSpec[] = [];
  const distance = findMeasure(text, "km(?!/h)|miles|mi");
  if (distance) {
    specs.push({ label: "Mileage", value: Math.round(distance.unit === "km" ? distance.value : distance.value / 0.621371), unit: "km" });
  }
  const hours = findMeasure(text, "betriebsstunden|operating hours|hours|hrs|timmar|heures|ore|h");
  if (hours && hours.value < 200000) specs.push({ label: "Operating hours", value: Math.round(hours.value), unit: "h" });
  const weight = findMeasure(text, "kg|tonnes|tonne|tons|ton|tonnen|t");
  if (weight) specs.push({ label: "Weight", value: Math.round(weight.unit === "kg" ? weight.value : weight.value * 1000), unit: "kg" });
  const area = findMeasure(text, "m²|m2|sqm|sq m");
  if (area) specs.push({ label: "Floor area", value: Math.round(area.value), unit: "m2" });
  const year =
    text.match(/(?:year|built|model|baujahr|årsmodell|année|anno)\D{0,15}((?:19|20)\d{2})/i)?.[1] ??
    title.match(/\b((?:19[89]|20[0-2])\d)\b/)?.[1];
  if (year) specs.push({ label: "Year", value: Number(year), unit: "year" });

  const description = lines
    .slice(1)
    .filter((line) => !bulletLines.includes(line) && !/^(price|pris|preis|asking|location|standort|plats)\b/i.test(line))
    .join(" ")
    .slice(0, 600);

  const finalCategory = categoryId ?? "inventory";
  const requiresRegistration =
    finalCategory === "vehicles" || (finalCategory === "machinery" && /excavator|bagger|loader|crane|grävmaskin/i.test(text));

  const missing: ImportResult["missing"] = [];
  if (!price) missing.push("price");
  if (!location.city && !location.country) missing.push("location");
  if (!categoryId) missing.push("category");

  const steps = [
    "Reading your listing",
    categoryId ? `Detecting the category: ${getCategoryLabel(categoryId)}` : "Category unclear — please choose one",
    price
      ? `Finding the price: ${price.source}${price.currency !== "EUR" ? ` → ${formatCurrency(price.eur)}` : ""}`
      : "No price found — please add it",
    location.city || location.country
      ? `Locating the asset: ${[location.city, location.country].filter(Boolean).join(", ")}`
      : "No location found — please add it",
    `Extracting specifications (${specs.length} found${specs.length ? `: ${specs.map((spec) => spec.label.toLowerCase()).join(", ")}` : ""})`,
    highlights.length ? `Picking ${formatNumber(highlights.length)} highlight${highlights.length > 1 ? "s" : ""}` : "Writing the listing summary",
    "Preparing your listing for every market"
  ];

  return {
    listing: {
      title,
      description,
      categoryId: finalCategory,
      origin,
      price: price?.eur ?? 0,
      sourcePrice: price?.source ?? null,
      city: location.city,
      country: location.country,
      specs,
      highlights,
      requiresRegistration
    },
    missing,
    steps
  };
}

export const importExamples: Array<{ label: string; text: string }> = [
  {
    label: "Truck from a Swedish broker",
    text: `Scania R450 tractor unit 2018
Price: 495 000 SEK excl. VAT
Location: Malmö, Sweden
Mileage 698 000 km, weight 7 600 kg
Sold on behalf of the bankruptcy estate of a haulage company. Retarder, two beds and full service history.
- Euro 6
- New tyres 2025
- Can be inspected in Malmö`
  },
  {
    label: "German machinery listing",
    text: `Liebherr R 926 Raupenbagger / crawler excavator
Baujahr 2016, 9.850 Betriebsstunden
Einsatzgewicht 26 t
Preis: 79.500 € netto
Standort: Hamburg, Deutschland
Verkauf aus Insolvenz. Machine in working order, bucket and quick coupler included.
• Air conditioning
• Hydraulic quick coupler`
  },
  {
    label: "Office closure in Ireland",
    text: `Office closure: 120 desks, 140 chairs and 90 monitors
Asking price £18,000
Collection from Dublin, Ireland
Liquidation of a software company. Everything in good condition, sold as one lot.
- 120 height-adjustable desks
- 90 x 27" monitors`
  }
];
