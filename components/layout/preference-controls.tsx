"use client";

import { currencyList } from "@/data/currencies";
import { useCurrency } from "@/features/preferences/currency-context";
import { useUnits } from "@/features/preferences/units-context";
import { Language, useLanguage } from "@/features/preferences/language-context";
import { cn, UnitSystem } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";

const selectClass =
  "h-10 cursor-pointer rounded-full border-0 bg-surface-low pl-4 pr-8 text-sm font-semibold text-primary shadow-[inset_0_0_0_1px_rgba(0,24,62,0.12)] outline-none focus-visible:shadow-[inset_0_0_0_2px_rgb(var(--primary))]";

/**
 * Currency + unit preferences. Rendered twice in the header (desktop and mobile positions);
 * only one is visible at a time, so ids must differ.
 */
export function PreferenceControls({ id = "site-currency", className }: { id?: string; className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const { units, setUnits } = useUnits();
  const { language, setLanguage } = useLanguage();

  return (
    <Localized><div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="sr-only">
        Show prices in
      </label>
      <select id={id} value={currency} onChange={(event) => setCurrency(event.target.value)} className={selectClass}>
        {currencyList.map((item) => (
          // Code only, so the control stays narrow on phones; the full name is the option's accessible label.
          <option key={item.code} value={item.code} aria-label={item.label} title={item.label}>
            {item.code}
          </option>
        ))}
      </select>
      <label htmlFor={`${id}-units`} className="sr-only">
        Units
      </label>
      <select
        id={`${id}-units`}
        value={units}
        onChange={(event) => setUnits(event.target.value as UnitSystem)}
        className={selectClass}
      >
        <option value="metric" aria-label="Metric (kilometres, kilograms)">
          km · kg
        </option>
        <option value="imperial" aria-label="Imperial (miles, pounds)">
          mi · lb
        </option>
      </select>
      <label htmlFor={`${id}-language`} className="sr-only">
        Site language
      </label>
      <select
        id={`${id}-language`}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        aria-label="Site language"
        className={selectClass}
      >
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="sv">SV</option>
      </select>
    </div></Localized>
  );
}
