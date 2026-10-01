"use client";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { ListingCard } from "@/components/listing/listing-card";
import { useFavourites } from "@/features/favourites/favourites-context";
import { useMarketplace } from "@/features/marketplace/marketplace-store";

export default function FavouritesPage() {
  const { ids } = useFavourites();
  const { listings } = useMarketplace();
  // Keep the order in which they were saved; listings created in an earlier session no longer exist.
  const favourites = ids.map((id) => listings.find((listing) => listing.id === id)).filter((listing) => listing !== undefined);

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell">
          <h1 className="page-title text-[clamp(2.2rem,4vw,3.2rem)]">Your favourites</h1>
          <p className="body-copy mt-3 max-w-2xl">
            Listings you saved with the heart, to compare and come back to later. Saved in this browser only (demo).
          </p>

          <div className="mt-10">
            {favourites.length === 0 ? (
              <EmptyState
                title="No favourites yet"
                description="Tap the heart on any listing to keep it here."
                href="/listings"
                cta="Browse listings"
              />
            ) : (
              <>
                <p className="text-sm text-muted" role="status">
                  {`${favourites.length} listing${favourites.length === 1 ? "" : "s"}`}
                </p>
                <ul className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {favourites.map((listing) => (
                    <li key={listing.id}>
                      <ListingCard listing={listing} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
