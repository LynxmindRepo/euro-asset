import { ListingSpec } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
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

export function formatSpecValue(spec: ListingSpec) {
  if (typeof spec.value === "string") return spec.value;
  if (spec.unit === "year") return String(spec.value);

  const unit = spec.unit ? unitLabels[spec.unit] : "";
  return unit ? `${formatNumber(spec.value)} ${unit}` : formatNumber(spec.value);
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
export function formatSpecShort(spec: ListingSpec) {
  if (spec.unit === "units" && typeof spec.value === "number") {
    return `${formatNumber(spec.value)} ${spec.label.toLowerCase()}`;
  }

  return formatSpecValue(spec);
}
