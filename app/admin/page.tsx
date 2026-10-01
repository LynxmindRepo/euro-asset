"use client";

import Link from "next/link";
import { AdminSidebar } from "@/components/admin/sidebar";
import { PageShell } from "@/components/layout/page-shell";
import { StatusBadge } from "@/components/listing/status-badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getListingCountries, getPartner, getPartnerTypeLabel } from "@/lib/listing-helpers";
import { hasStaticListingDetail } from "@/lib/site";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AdminPage() {
  const { currentUser } = useMockSession();
  const { listings, partners, inquiries, applications } = useMarketplace();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <PageShell>
        <div className="shell section-space">
          <div className="panel-xl bg-surface-low">
            <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">Sign in with the admin profile to open the dashboard.</h1>
            <p className="support-copy mt-4 max-w-2xl">The back office is only available to the demo admin profile.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => window.dispatchEvent(new Event("open-mock-login"))}>Open login</Button>
              <Link href="/listings" className={buttonStyles("secondary", "no-underline")}>
                Back to listings
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const metrics = [
    { label: "Active listings", value: listings.filter((listing) => listing.status !== "sold").length },
    { label: "Disposal Partners", value: partners.length },
    { label: "Countries covered", value: getListingCountries(listings).length },
    { label: "Listings sold", value: listings.filter((listing) => listing.status === "sold").length },
    { label: "Messages this session", value: inquiries.length },
    { label: "Partner registrations", value: applications.length }
  ];

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-8 xl:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div className="grid gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">Dashboard</h1>
              <Link href="/admin/new" className={buttonStyles("accent", "no-underline")}>
                New listing
              </Link>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <Card key={metric.label} variant="metric">
                  <dt className="institutional-kicker">{metric.label}</dt>
                  <dd className="metric-figure mt-3 text-primary">{metric.value}</dd>
                </Card>
              ))}
            </dl>

            <section aria-labelledby="messages-title">
              <h2 id="messages-title" className="subsection-title text-2xl">
                Buyer messages
              </h2>
              {inquiries.length === 0 ? (
                <p className="support-copy mt-3">
                  No messages yet. Send one from any listing page to see it appear here.
                </p>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {inquiries.map((inquiry) => {
                    const listing = listings.find((candidate) => candidate.id === inquiry.listingId);

                    return (
                      <li key={inquiry.id} className="rounded-2xl bg-surface-lowest p-5 shadow-ambient tonal-rule">
                        <p className="font-semibold text-ink">{listing?.title}</p>
                        <p className="mt-1 text-sm text-muted">
                          From {inquiry.name} ({inquiry.email}) to {getPartner(inquiry.partnerId)?.name} ·{" "}
                          {formatDateTime(inquiry.createdAt)}
                        </p>
                        <p className="mt-2 text-sm text-ink">{inquiry.message}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section aria-labelledby="applications-title">
              <h2 id="applications-title" className="subsection-title text-2xl">
                Disposal Partner registrations
              </h2>
              {applications.length === 0 ? (
                <p className="support-copy mt-3">
                  No registrations yet. Submit one from the <Link href="/sell#register" className="text-primary">Sell with us</Link> page.
                </p>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {applications.map((application) => (
                    <li key={application.id} className="rounded-2xl bg-surface-lowest p-5 shadow-ambient tonal-rule">
                      <p className="font-semibold text-ink">
                        {application.company} <span className="font-normal text-muted">· {getPartnerTypeLabel(application.type)}, {application.country}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {application.contactName} ({application.email}) · wants to list {application.volume === "1" ? "one asset" : application.volume === "2-10" ? "2–10 assets" : "10+ assets"} · {formatDateTime(application.createdAt)}
                      </p>
                      {application.message ? <p className="mt-2 text-sm text-ink">{application.message}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="listings-title">
              <h2 id="listings-title" className="subsection-title text-2xl">
                All listings
              </h2>
              <div className="mt-4 overflow-x-auto rounded-2xl bg-surface-lowest shadow-ambient tonal-rule">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-surface-tint">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold text-ink">Listing</th>
                      <th scope="col" className="px-5 py-3 font-semibold text-ink">Disposal Partner</th>
                      <th scope="col" className="px-5 py-3 font-semibold text-ink">Status</th>
                      <th scope="col" className="px-5 py-3 text-right font-semibold text-ink">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-t border-surface-high">
                        <td className="px-5 py-3">
                          {hasStaticListingDetail(listing.id) ? (
                            <Link href={`/listings/${listing.id}`} className="font-medium text-primary">
                              {listing.title}
                            </Link>
                          ) : (
                            <span className="font-medium text-ink">
                              {listing.title} <span className="text-xs text-muted">(session only)</span>
                            </span>
                          )}
                          <span className="block text-xs text-muted">
                            {listing.city}, {listing.country}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-ink">{getPartner(listing.partnerId)?.name}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={listing.status} />
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-primary">
                          {formatCurrency(listing.price, listing.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
