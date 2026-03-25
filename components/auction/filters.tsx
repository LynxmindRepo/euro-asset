"use client";

import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  query: string;
  categoryId: string;
  status: string;
  country: string;
  procedure: string;
  setQuery: (value: string) => void;
  setCategoryId: (value: string) => void;
  setStatus: (value: string) => void;
  setCountry: (value: string) => void;
  setProcedure: (value: string) => void;
};

export function AuctionFilters(props: Props) {
  const activeFilters =
    (props.query ? 1 : 0) +
    (props.categoryId !== "all" ? 1 : 0) +
    (props.status !== "all" ? 1 : 0) +
    (props.country !== "all" ? 1 : 0) +
    (props.procedure !== "all" ? 1 : 0);

  function clearFilters() {
    props.setQuery("");
    props.setCategoryId("all");
    props.setStatus("all");
    props.setCountry("all");
    props.setProcedure("all");
  }

  return (
    <section className="rounded-[2rem] bg-surface-low px-5 py-5 shadow-ambient tonal-rule">
      <div className="flex flex-col gap-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="institutional-kicker">Catalogue filters</p>
        {activeFilters > 0 ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex self-start rounded-xl bg-surface-high px-4 py-2 text-sm font-medium text-primary tonal-rule transition hover:bg-surface-tint"
          >
            Clear filters ({activeFilters})
          </button>
        ) : null}
      </div>
      <div className="mt-2 grid gap-4 xl:grid-cols-[1.65fr_repeat(4,minmax(0,1fr))]">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="field-label">Search</label>
            {props.query ? <span className="text-xs font-medium text-primary">Active</span> : null}
          </div>
          <Input
            value={props.query}
            onChange={(event) => props.setQuery(event.target.value)}
            placeholder="Asset, country, case reference, or entity"
            aria-label="Search processes"
            className={props.query ? "bg-surface-bright" : undefined}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="field-label">Category</label>
            {props.categoryId !== "all" ? <span className="text-xs font-medium text-primary">Active</span> : null}
          </div>
          <Select
            value={props.categoryId}
            onChange={(event) => props.setCategoryId(event.target.value)}
            className={props.categoryId !== "all" ? "bg-surface-bright text-ink" : undefined}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="field-label">Status</label>
            {props.status !== "all" ? <span className="text-xs font-medium text-primary">Active</span> : null}
          </div>
          <Select
            value={props.status}
            onChange={(event) => props.setStatus(event.target.value)}
            className={props.status !== "all" ? "bg-surface-bright text-ink" : undefined}
          >
            <option value="all">All</option>
            <option value="aberto">Open</option>
            <option value="a-encerrar">Closing soon</option>
            <option value="agendado">Scheduled</option>
            <option value="encerrado">Closed</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="field-label">Country</label>
            {props.country !== "all" ? <span className="text-xs font-medium text-primary">Active</span> : null}
          </div>
          <Select
            value={props.country}
            onChange={(event) => props.setCountry(event.target.value)}
            className={props.country !== "all" ? "bg-surface-bright text-ink" : undefined}
          >
            <option value="all">All</option>
            <option value="Portugal">Portugal</option>
            <option value="Espanha">Spain</option>
            <option value="Italia">Italy</option>
            <option value="Franca">France</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="field-label">Procedure</label>
            {props.procedure !== "all" ? <span className="text-xs font-medium text-primary">Active</span> : null}
          </div>
          <Select
            value={props.procedure}
            onChange={(event) => props.setProcedure(event.target.value)}
            className={props.procedure !== "all" ? "bg-surface-bright text-ink" : undefined}
          >
            <option value="all">All</option>
            <option value="insolvencia">Insolvency</option>
            <option value="liquidacao">Liquidation</option>
            <option value="reestruturacao">Restructuring</option>
            <option value="venda-judicial">Judicial sale</option>
            <option value="venda-privada">Private sale</option>
          </Select>
        </div>
      </div>
    </section>
  );
}
