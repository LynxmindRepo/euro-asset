"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonStyles } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/features/marketplace/marketplace-store";
import { getListingCountries } from "@/lib/listing-helpers";

const popularSearches = ["Truck", "Excavator", "Forklift", "Warehouse", "Servers"];

const fieldClass =
  "h-12 w-full rounded-xl border-0 bg-white px-4 text-base text-ink outline-none shadow-[inset_0_0_0_1px_rgba(0,24,62,0.12)] focus:shadow-[inset_0_0_0_2px_rgb(var(--primary))]";

export function Hero() {
  const router = useRouter();
  const { listings, partners } = useMarketplace();
  const countries = getListingCountries(listings);
  const activeCount = listings.filter((listing) => listing.status !== "sold").length;
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [country, setCountry] = useState("all");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (categoryId !== "all") params.set("category", categoryId);
    if (country !== "all") params.set("country", country);
    const search = params.toString();
    router.push(search ? `/listings?${search}` : "/listings");
  }

  return (
    <section className="pb-16 pt-6 sm:pt-10">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-midnight-gradient px-5 py-12 text-white shadow-panel sm:px-12 lg:py-16">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-semibold text-accent">Insolvency assets across Europe</p>
            <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              Exclusive assets from across Europe. Search, compare, and connect with trusted sellers.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Whether you&apos;re buying for yourself or your business, find insolvency assets from across Europe in
              one place.
            </p>

            <form
              role="search"
              aria-label="Search listings"
              onSubmit={handleSearch}
              className="mt-8 grid gap-3 rounded-[1.5rem] bg-white/10 p-3 backdrop-blur-md md:grid-cols-[1.6fr_1fr_1fr_auto]"
            >
              <div>
                <label htmlFor="hero-query" className="sr-only">
                  What are you looking for?
                </label>
                <input
                  id="hero-query"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="What are you looking for?"
                  className={`${fieldClass} placeholder:text-muted`}
                />
              </div>
              <div>
                <label htmlFor="hero-category" className="sr-only">
                  Category
                </label>
                <select
                  id="hero-category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className={`${fieldClass} cursor-pointer`}
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hero-country" className="sr-only">
                  Country
                </label>
                <select
                  id="hero-country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className={`${fieldClass} cursor-pointer`}
                >
                  <option value="all">All countries</option>
                  {countries.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={buttonStyles("accent", "h-12 px-8 text-base")}>
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/75">Popular:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/listings?q=${encodeURIComponent(term.toLowerCase())}`}
                  className="rounded-full bg-white/10 px-3 py-1 text-white no-underline transition hover:bg-white/20"
                >
                  {term}
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-6 border-t border-white/15 pt-8 lg:flex-row lg:items-center lg:justify-between">
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {[
                  { label: "Active listings", value: activeCount },
                  { label: "Countries", value: countries.length },
                  { label: "Verified Disposal Partners", value: partners.filter((partner) => partner.verified).length }
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt className="text-sm text-white/75">{stat.label}</dt>
                    <dd className="font-display text-3xl font-semibold">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3">
                <Link href="/listings" className={buttonStyles("outline-light", "no-underline")}>
                  Browse listings
                </Link>
                <Link href="/sell" className={buttonStyles("outline-light", "no-underline")}>
                  List your assets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
