"use client";

import { Card } from "@/components/ui/card";
import { Localized } from "@/components/ui/localized";
import { useFavourites } from "@/features/favourites/favourites-context";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getListingCountries } from "@/lib/listing-helpers";
import { buildPartnerStats } from "@/lib/partner-stats";
import { formatDayMonth, formatNumber } from "@/lib/utils";
import { DisposalPartner } from "@/types";

/** "How your listings perform": simulated views, saves, messages and buyer markets for the signed-in partner. */
export function PartnerStats({ partner }: { partner: DisposalPartner }) {
  const { listings, inquiries } = useMarketplace();
  const { ids: favouriteIds } = useFavourites();
  const mine = listings.filter((listing) => listing.partnerId === partner.id);
  const stats = buildPartnerStats(
    partner.country,
    mine,
    inquiries.filter((inquiry) => inquiry.partnerId === partner.id),
    favouriteIds,
    getListingCountries(listings)
  );
  const peak = Math.max(1, ...stats.daily.map((day) => day.views));
  const kpis = [
    { label: "Listing views", value: formatNumber(stats.totals.views) },
    { label: "Saved by buyers", value: formatNumber(stats.totals.saves) },
    { label: "Views from other countries", value: `${stats.abroadShare}%` }
  ];

  if (mine.length === 0) return null;

  return (
    <Localized>
      <section aria-labelledby="stats-title" className="grid gap-6">
        <div>
          <h2 id="stats-title" className="subsection-title text-2xl">
            How your listings perform
          </h2>
          <p className="support-copy mt-2 max-w-3xl">
            Last 30 days. Simulated figures for the demo — in the live product they come from real visits and messages.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <Card key={kpi.label} variant="metric">
              <dt className="text-sm text-muted">{kpi.label}</dt>
              <dd className="metric-figure mt-2 text-primary">{kpi.value}</dd>
            </Card>
          ))}
        </dl>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <figure className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
            <figcaption className="font-display text-lg font-semibold text-ink">Daily views, last 14 days</figcaption>
            {/* Visual chart; the same data is available to screen readers as the table below. */}
            <div aria-hidden="true" className="mt-5">
              <div className="flex h-56 items-end gap-1 border-b border-surface-high sm:gap-1.5">
                {stats.daily.map((day, index) => (
                  <div
                    key={day.date.toISOString()}
                    title={`${formatDayMonth(day.date)}: ${formatNumber(day.views)}`}
                    className={index === stats.daily.length - 1 ? "flex-1 rounded-t-md bg-accent-ink" : "flex-1 rounded-t-md bg-primary"}
                    style={{ height: `${Math.max(4, (day.views / peak) * 100)}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>{formatDayMonth(stats.daily[0].date)}</span>
                <span>{formatDayMonth(stats.daily[stats.daily.length - 1].date)}</span>
              </div>
            </div>
            <table className="sr-only">
              <caption>Daily views, last 14 days</caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.daily.map((day) => (
                  <tr key={day.date.toISOString()}>
                    <th scope="row">{formatDayMonth(day.date)}</th>
                    <td>{formatNumber(day.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>

          <div className="rounded-[1.75rem] bg-surface-lowest p-6 shadow-panel tonal-rule">
            <h3 className="font-display text-lg font-semibold text-ink">Where your viewers are</h3>
            <ul className="mt-4 grid gap-3">
              {stats.markets.map((market) => (
                <li key={market.country} className="grid gap-1">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-ink">
                      {market.country}
                      {market.country === partner.country ? <span className="text-muted"> · your market</span> : null}
                    </span>
                    <span className="font-semibold text-primary">{`${market.share}%`}</span>
                  </div>
                  <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface-high">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${market.share}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-surface-lowest shadow-panel tonal-rule">
          <h3 id="per-listing-title" className="px-5 pt-5 font-display text-lg font-semibold text-ink sm:px-6">
            Per listing
          </h3>
          {/* Phones: one small card per listing (a 4-column table would break words). */}
          <ul aria-labelledby="per-listing-title" className="grid gap-3 p-5 sm:hidden">
            {stats.perListing.map((item) => (
              <li key={item.listing.id} className="rounded-2xl bg-surface-low p-4 tonal-rule">
                <p className="font-medium text-ink">{item.listing.title}</p>
                <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-muted">Views</dt>
                    <dd className="font-semibold text-ink">{formatNumber(item.views)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Favourites</dt>
                    <dd className="font-semibold text-ink">{formatNumber(item.saves)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Messages</dt>
                    <dd className="font-semibold text-primary">{formatNumber(item.messages)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <table aria-labelledby="per-listing-title" className="hidden w-full text-left text-sm sm:table">
            <thead className="text-muted">
              <tr className="border-b border-surface-high">
                <th scope="col" className="px-6 py-3 font-medium">
                  Listing
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Views
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Favourites
                </th>
                <th scope="col" className="px-6 py-3 text-right font-medium">
                  Messages
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.perListing.map((item) => (
                <tr key={item.listing.id} className="border-b border-surface-high last:border-b-0">
                  <th scope="row" className="px-6 py-3 font-medium text-ink">
                    {item.listing.title}
                  </th>
                  <td className="px-4 py-3 text-right text-ink">{formatNumber(item.views)}</td>
                  <td className="px-4 py-3 text-right text-ink">{formatNumber(item.saves)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-primary">{formatNumber(item.messages)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Localized>
  );
}
