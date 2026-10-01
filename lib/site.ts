import { initialListings } from "@/data/listings";

export const repoBasePath = process.env.NODE_ENV === "production" ? "/euro-asset" : "";

const staticListingIds = new Set(initialListings.map((listing) => listing.id));

export function getAssetPath(path: string) {
  if (!path.startsWith("/")) {
    return path;
  }

  if (repoBasePath && path.startsWith(`${repoBasePath}/`)) {
    return path;
  }

  return `${repoBasePath}${path}`;
}

/** Only the initial listings get a statically exported detail page; listings created in-session do not. */
export function hasStaticListingDetail(listingId: string) {
  return staticListingIds.has(listingId);
}
