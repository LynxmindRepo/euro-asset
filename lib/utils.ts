import { Auction, AuctionStatus } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
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

export function getTimeRemaining(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();

  if (diff <= 0) {
    return "Closed";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }

  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${hours}h ${minutes}m remaining`;
}

export function getStatusLabel(status: AuctionStatus) {
  switch (status) {
    case "a-encerrar":
      return "Closing soon";
    case "agendado":
      return "Scheduled";
    case "encerrado":
      return "Closed";
    default:
      return "Open";
  }
}

export function getAuctionMinimumBid(auction: Auction) {
  return auction.currentBid + 25000;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
