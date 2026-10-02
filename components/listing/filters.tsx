"use client";

import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ListingFilters as Filters } from "@/features/listings/use-listing-filters";
import { Localized } from "@/components/ui/localized";
import { useState } from "react";
import { cn } from "@/lib/utils";

const fieldClass = "grid gap-2";

export function ListingFilters({ filters, countries, currency }: { filters: Filters; countries: string[]; currency: string }) {
  const [moreOpen, setMoreOpen] = useState(false);
  // Active filters inside the folded panel (everything except the search box).
  const hiddenActive = filters.activeCount - (filters.query.trim() ? 1 : 0);

  return (
    <Localized><section aria-labelledby="filters-title" className="rounded-[2rem] bg-surface-low px-5 py-5 shadow-ambient tonal-rule">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <h2 id="filters-title" className="eyebrow">
          Search and filter
        </h2>
        {filters.activeCount > 0 ? (
          <button
            type="button"
            onClick={filters.clearFilters}
            className="rounded-xl bg-surface-high px-4 py-2 text-sm font-medium text-primary tonal-rule transition hover:bg-surface-tint"
          >
            Clear filters ({filters.activeCount})
          </button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))]">
        <div className={fieldClass}>
          <label htmlFor="filter-query" className="field-label">
            Search
          </label>
          <Input
            id="filter-query"
            type="search"
            value={filters.query}
            onChange={(event) => filters.setQuery(event.target.value)}
            placeholder="Asset, city, country or seller"
          />
        </div>
        {/* Phones: the search box stays visible, the other filters fold away so results show on the first screen. */}
        <button
          type="button"
          aria-expanded={moreOpen}
          aria-controls="more-filters"
          onClick={() => setMoreOpen((value) => !value)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-surface-lowest px-4 text-sm font-semibold text-primary tonal-rule md:hidden"
        >
          {hiddenActive > 0 ? `${moreOpen ? "Fewer filters" : "More filters"} (${hiddenActive})` : moreOpen ? "Fewer filters" : "More filters"}
          <span aria-hidden="true">{moreOpen ? "▴" : "▾"}</span>
        </button>
        <div id="more-filters" className={cn(moreOpen ? "grid gap-4" : "hidden", "md:contents")}>
          <div className={fieldClass}>
            <label htmlFor="filter-category" className="field-label">
              Category
            </label>
            <Select id="filter-category" value={filters.categoryId} onChange={(event) => filters.setCategoryId(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </Select>
          </div>
          <div className={fieldClass}>
            <label htmlFor="filter-country" className="field-label">
              Country
            </label>
            <Select id="filter-country" value={filters.country} onChange={(event) => filters.setCountry(event.target.value)}>
              <option value="all">All countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </div>
          <div className={fieldClass}>
            <label htmlFor="filter-status" className="field-label">
              Availability
            </label>
            <Select id="filter-status" value={filters.status} onChange={(event) => filters.setStatus(event.target.value)}>
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </Select>
          </div>
          <div className={fieldClass}>
            <label htmlFor="filter-origin" className="field-label">
              Origin
            </label>
            <Select id="filter-origin" value={filters.origin} onChange={(event) => filters.setOrigin(event.target.value)}>
              <option value="all">Any origin</option>
              <option value="insolvency">Insolvency</option>
              <option value="liquidation">Liquidation</option>
              <option value="restructuring">Restructuring</option>
              <option value="judicial-sale">Judicial sale</option>
              <option value="private-sale">Private sale</option>
            </Select>
          </div>
          <fieldset className="grid gap-2 md:col-span-1 xl:col-span-2">
            <legend className="field-label mb-2">{`Price (${currency})`}</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="filter-min-price" className="sr-only">
                  {`Minimum price in ${currency}`}
                </label>
                <Input
                  id="filter-min-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(event) => filters.setMinPrice(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="filter-max-price" className="sr-only">
                  {`Maximum price in ${currency}`}
                </label>
                <Input
                  id="filter-max-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(event) => filters.setMaxPrice(event.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </section></Localized>
  );
}
