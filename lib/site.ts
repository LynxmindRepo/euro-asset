import { initialAuctions } from "@/data/auctions";

export const repoBasePath = process.env.NODE_ENV === "production" ? "/euro-asset" : "";

const staticAuctionIds = new Set(initialAuctions.map((auction) => auction.id));

export function getAssetPath(path: string) {
  if (!path.startsWith("/")) {
    return path;
  }

  if (repoBasePath && path.startsWith(`${repoBasePath}/`)) {
    return path;
  }

  return `${repoBasePath}${path}`;
}

export function hasStaticAuctionDetail(auctionId: string) {
  return staticAuctionIds.has(auctionId);
}
