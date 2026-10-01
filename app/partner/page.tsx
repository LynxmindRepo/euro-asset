"use client";

import Link from "next/link";
import { useToast } from "@/components/feedback/toast-provider";
import { StatusBadge } from "@/components/listing/status-badge";
import { PartnerShell } from "@/components/partner/partner-shell";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getListingCountries } from "@/lib/listing-helpers";
import { getAssetPath, hasStaticListingDetail } from "@/lib/site";
import { formatCurrency, formatDateTime, formatPublished } from "@/lib/utils";
import { Listing } from "@/types";

export default function PartnerDashboardPage() {
  const { listings, inquiries, updateListing } = useMarketplace();
  const { pushToast } = useToast();
  const markets = getListingCountries(listings).length;

  function setStatus(listing: Listing, status: Listing["status"]) {
    updateListing(listing.id, { status });
    pushToast({
      tone: "success",
      text: status === "sold" ? `"${listing.title}" marked as sold.` : `"${listing.title}" is available again.`
    });
  }

  return (
    <PartnerShell
      title="Your listings"
      intro="Edit listings, mark items as sold and see buyer inquiries — everything in one place."
    >
      {(partner) => {
        const mine = listings.filter((listing) => listing.partnerId === partner.id);
        const messages = inquiries.filter((inquiry) => inquiry.partnerId === partner.id);
        const metrics = [
          { label: "Live listings", value: mine.filter((listing) => listing.status !== "sold").length },
          { label: "Sold", value: mine.filter((listing) => listing.status === "sold").length },
          { label: "Buyer messages", value: messages.length },
          { label: "Markets reached", value: markets }
        ];

        return (
          <div className="grid gap-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <dl className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                  <Card key={metric.label} variant="metric">
                    <dt className="text-sm text-muted">{metric.label}</dt>
                    <dd className="metric-figure mt-2 text-primary">{metric.value}</dd>
                  </Card>
                ))}
              </dl>
            </div>

            <section aria-labelledby="mine-title">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="mine-title" className="subsection-title text-2xl">
                  {`Listings (${mine.length})`}
                </h2>
                <Link href="/partner/import" className={buttonStyles("accent", "no-underline")}>
                  Import a listing
                </Link>
              </div>
              {mine.length === 0 ? (
                <p className="support-copy mt-3">No listings yet — import your first one in seconds.</p>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {mine.map((listing) => (
                    <li
                      key={listing.id}
                      className="grid gap-4 rounded-2xl bg-surface-lowest p-4 shadow-ambient tonal-rule sm:grid-cols-[96px_1fr_auto] sm:items-center"
                    >
                      <img src={getAssetPath(listing.images[0])} alt="" className="h-20 w-full rounded-xl object-cover sm:w-24" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={listing.status} />
                          <span className="text-xs text-muted">Published {formatPublished(listing.publishedAt).toLowerCase()}</span>
                        </div>
                        <p className="mt-1 font-semibold text-ink">
                          {hasStaticListingDetail(listing.id) ? (
                            <Link href={`/listings/${listing.id}`} className="text-ink">
                              {listing.title}
                            </Link>
                          ) : (
                            listing.title
                          )}
                        </p>
                        <p className="text-sm text-muted">
                          {[listing.city, listing.country].filter(Boolean).join(", ")} ·{" "}
                          <span className="font-semibold text-primary">{formatCurrency(listing.price)}</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Link
                          href={`/partner/edit?id=${encodeURIComponent(listing.id)}`}
                          className={buttonStyles("secondary", "px-4 py-2 no-underline")}
                          aria-label={`Edit ${listing.title}`}
                        >
                          Edit
                        </Link>
                        {listing.status === "sold" ? (
                          <button
                            type="button"
                            onClick={() => setStatus(listing, "available")}
                            className={buttonStyles("ghost", "px-4 py-2")}
                            aria-label={`Relist ${listing.title}`}
                          >
                            Relist
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setStatus(listing, "sold")}
                            className={buttonStyles("primary", "px-4 py-2")}
                            aria-label={`Mark ${listing.title} as sold`}
                          >
                            Mark as sold
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="messages-title">
              <h2 id="messages-title" className="subsection-title text-2xl">
                {`Buyer messages (${messages.length})`}
              </h2>
              {messages.length === 0 ? (
                <p className="support-copy mt-3">
                  No messages yet. Buyers contact you from your listing pages — try it from{" "}
                  {mine[0] && hasStaticListingDetail(mine[0].id) ? (
                    <Link href={`/listings/${mine[0].id}`} className="font-semibold text-primary">
                      one of your listings
                    </Link>
                  ) : (
                    "one of your listings"
                  )}
                  .
                </p>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {messages.map((inquiry) => {
                    const listing = listings.find((candidate) => candidate.id === inquiry.listingId);

                    return (
                      <li key={inquiry.id} className="rounded-2xl bg-surface-lowest p-5 shadow-ambient tonal-rule">
                        <p className="font-semibold text-ink">{listing?.title}</p>
                        <p className="mt-1 text-sm text-muted">
                          From {inquiry.name} ·{" "}
                          <a href={`mailto:${inquiry.email}`} className="text-primary">
                            {inquiry.email}
                          </a>{" "}
                          · {formatDateTime(inquiry.createdAt)}
                        </p>
                        <p className="mt-2 text-sm text-ink">{inquiry.message}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        );
      }}
    </PartnerShell>
  );
}
