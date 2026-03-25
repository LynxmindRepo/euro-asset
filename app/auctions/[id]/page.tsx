import { notFound } from "next/navigation";
import { AuctionDetailClient } from "@/app/auctions/[id]/auction-detail-client";
import { initialAuctions } from "@/data/auctions";

export function generateStaticParams() {
  return initialAuctions.map((auction) => ({ id: auction.id }));
}

export default async function AuctionDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auction = initialAuctions.find((candidate) => candidate.id === id);

  if (!auction) {
    notFound();
  }

  return <AuctionDetailClient auction={auction} />;
}
