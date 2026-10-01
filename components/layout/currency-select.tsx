"use client";

import { currencyList } from "@/data/currencies";
import { useCurrency } from "@/features/preferences/currency-context";

/** Rendered twice in the header (desktop and mobile positions); only one is visible at a time, so ids must differ. */
export function CurrencySelect({ id = "site-currency", className }: { id?: string; className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        Show prices in
      </label>
      <select
        id={id}
        value={currency}
        onChange={(event) => setCurrency(event.target.value)}
        className="h-10 cursor-pointer rounded-full border-0 bg-surface-low pl-4 pr-8 text-sm font-semibold text-primary shadow-[inset_0_0_0_1px_rgba(0,24,62,0.12)] outline-none focus-visible:shadow-[inset_0_0_0_2px_rgb(var(--primary))]"
      >
        {currencyList.map((item) => (
          // Code only, so the control stays narrow on phones; the full name is the option's accessible label.
          <option key={item.code} value={item.code} aria-label={item.label} title={item.label}>
            {item.code}
          </option>
        ))}
      </select>
    </div>
  );
}
