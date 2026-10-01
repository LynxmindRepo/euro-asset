import { notFound } from "next/navigation";
import { ListingDetailClient } from "@/app/listings/[id]/listing-detail-client";
import { initialListings } from "@/data/listings";

export function generateStaticParams() {
  return initialListings.map((listing) => ({ id: listing.id }));
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = initialListings.find((candidate) => candidate.id === id);

  if (!listing) {
    notFound();
  }

  return <ListingDetailClient listing={listing} />;
}
