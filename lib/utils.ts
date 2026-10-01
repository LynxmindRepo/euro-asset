import { ListingSpec } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const formatLocales = { en: "en-GB", fr: "fr-FR", sv: "sv-SE" } as const;
let formatLocale: string = formatLocales.en;

/**
 * Numbers, prices and dates follow the site language ("72,000" / "72 000"). Set by `LanguageProvider` while it
 * renders, so every formatter below uses the current language without needing it as a parameter.
 */
export function setFormatLanguage(language: keyof typeof formatLocales) {
  formatLocale = formatLocales[language];
}

export function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat(formatLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(formatLocale).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(formatLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

/** Exchange rates keep up to 4 decimals ("0.8546" / "0,8546"). */
export function formatRate(value: number) {
  return new Intl.NumberFormat(formatLocale, { maximumFractionDigits: 4 }).format(value);
}

/** Day and month only ("27 Sept" / "27 sept."), for chart axes. */
export function formatDayMonth(value: Date) {
  return new Intl.DateTimeFormat(formatLocale, { day: "numeric", month: "short" }).format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(formatLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

/** "Today", "Yesterday", "5 days ago", or the date for older items. */
export function formatPublished(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatDate(value);
}

const unitLabels: Record<NonNullable<ListingSpec["unit"]>, string> = {
  kg: "kg",
  km: "km",
  m2: "m²",
  h: "h",
  kW: "kW",
  kWp: "kWp",
  units: "",
  year: ""
};

export type UnitSystem = "metric" | "imperial";

/** Metric → imperial factors. Specs are always stored in metric units. */
const imperial: Partial<Record<NonNullable<ListingSpec["unit"]>, { factor: number; label: string }>> = {
  kg: { factor: 2.20462, label: "lb" },
  km: { factor: 0.621371, label: "mi" },
  m2: { factor: 10.7639, label: "sq ft" }
};

/** Convert a metric measurement for display; units without an imperial equivalent (h, kW, years…) are unchanged. */
export function convertMeasure(value: number, unit: NonNullable<ListingSpec["unit"]>, system: UnitSystem = "metric") {
  const target = system === "imperial" ? imperial[unit] : undefined;
  return target ? { value: Math.round(value * target.factor), label: target.label } : { value, label: unitLabels[unit] };
}

/** e.g. formatMeasure(612000, "km", "imperial") → "380,279 mi". */
export function formatMeasure(value: number, unit: NonNullable<ListingSpec["unit"]>, system: UnitSystem = "metric") {
  const converted = convertMeasure(value, unit, system);
  return converted.label ? `${formatNumber(converted.value)} ${converted.label}` : formatNumber(converted.value);
}

export function formatSpecValue(spec: ListingSpec, system: UnitSystem = "metric") {
  if (typeof spec.value === "string") return spec.value;
  if (spec.unit === "year") return String(spec.value);
  if (!spec.unit) return formatNumber(spec.value);

  return formatMeasure(spec.value, spec.unit, system);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Short form for chips: counts keep their label ("46 pallets"), measures keep their unit ("7,800 kg"). */
export function formatSpecShort(spec: ListingSpec, system: UnitSystem = "metric") {
  if (spec.unit === "units" && typeof spec.value === "number") {
    return `${formatNumber(spec.value)} ${spec.label.toLowerCase()}`;
  }

  return formatSpecValue(spec, system);
}
