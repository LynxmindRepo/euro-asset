import { categories } from "@/data/categories";
import { Auction } from "@/types";

export function getCategoryLabel(categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.label ?? "Uncategorized";
}

export function getCountryLabel(country: string) {
  switch (country) {
    case "Espanha":
      return "Spain";
    case "Italia":
      return "Italy";
    case "Franca":
      return "France";
    default:
      return country;
  }
}

export function getSaleProcedureLabel(value: Auction["saleProcedure"]) {
  switch (value) {
    case "insolvencia":
      return "Insolvency";
    case "liquidacao":
      return "Liquidation";
    case "reestruturacao":
      return "Restructuring";
    case "venda-judicial":
      return "Judicial sale";
    default:
      return "Private sale";
  }
}

export function getDocumentAvailabilityLabel(value: "disponivel" | "sob-pedido") {
  return value === "disponivel" ? "Available" : "On request";
}

export function getDocumentTypeLabel(value: Auction["documents"][number]["type"]) {
  switch (value) {
    case "caderno-encargos":
      return "Process memorandum";
    case "avaliacao":
      return "Valuation";
    case "legal":
      return "Legal";
    case "nda":
      return "NDA";
    case "financeiro":
      return "Financial";
    default:
      return "Teaser";
  }
}

export function getFeaturedAuctions(auctions: Auction[]) {
  return [...auctions]
    .sort((left, right) => right.currentBid - left.currentBid)
    .slice(0, 3);
}

export function getRecentAuctions(auctions: Auction[]) {
  return [...auctions]
    .sort(
      (left, right) =>
        new Date(right.startDate).getTime() - new Date(left.startDate).getTime()
    )
    .slice(0, 6);
}
