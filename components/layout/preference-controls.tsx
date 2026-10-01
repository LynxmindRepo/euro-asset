"use client";

import { useEffect, useId, useRef, useState } from "react";
import { currencyList } from "@/data/currencies";
import { translateText } from "@/data/translations";
import { useCurrency } from "@/features/preferences/currency-context";
import { useUnits } from "@/features/preferences/units-context";
import { Language, useLanguage } from "@/features/preferences/language-context";
import { Select } from "@/components/ui/select";
import { cn, UnitSystem } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";

/** Language names are always shown in their own language (with a matching `lang`), as is customary. */
const languages: { value: Language; name: string; short: string }[] = [
  { value: "en", name: "English", short: "EN" },
  { value: "fr", name: "Français", short: "FR" },
  { value: "sv", name: "Svenska", short: "SV" }
];

const unitOptions: { value: UnitSystem; label: string; detail: string; short: string }[] = [
  { value: "metric", label: "Metric", detail: "km · kg · m²", short: "km" },
  { value: "imperial", label: "Imperial", detail: "mi · lb · sq ft", short: "mi" }
];

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

/** Radio styled as a selectable tile. The real input stays in the accessibility tree; the tile shows its state and focus. */
function ChoiceTile({
  name,
  checked,
  onChange,
  children,
  lang
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  lang?: string;
}) {
  return (
    <label className="relative block cursor-pointer" lang={lang}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "flex min-h-11 items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm transition",
          "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink",
          checked ? "bg-primary font-semibold text-white" : "bg-surface-low text-ink tonal-rule hover:bg-surface-tint"
        )}
      >
        <span className="grid gap-0.5">{children}</span>
        {/* Checkmark so the choice isn't shown by colour alone. */}
        {checked ? <span aria-hidden="true">✓</span> : null}
      </span>
    </label>
  );
}

/**
 * "Language and region" menu in the header: one button showing the current choices (e.g. "EN · EUR · km")
 * that opens a panel with language, currency and units. Changes apply immediately.
 */
export function PreferenceControls({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const { units, setUnits } = useUnits();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  /** On phones the panel is fixed full-width under the trigger, so it never runs off-screen. */
  const [phoneTop, setPhoneTop] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;

  const currentLanguage = languages.find((item) => item.value === language) ?? languages[0];
  const currentUnits = unitOptions.find((item) => item.value === units) ?? unitOptions[0];
  const currencyInfo = currencyList.find((item) => item.code === currency);

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    setPhoneTop(window.innerWidth < 640 && rect ? rect.bottom + 8 : null);
    // Start on the selected language so keyboard users land on a meaningful control.
    panelRef.current?.querySelector<HTMLInputElement>("input[type=radio]:checked")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <Localized>
      <div
        ref={rootRef}
        className={cn("relative", className)}
        onBlur={(event) => {
          // Close when keyboard focus moves outside the menu (Tab past the last control). A null target
          // (e.g. Safari doesn't focus clicked buttons) is left to the outside-click handler.
          const next = event.relatedTarget as Node | null;
          if (open && next && !rootRef.current?.contains(next)) setOpen(false);
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-surface-low px-3.5 text-sm font-semibold text-primary shadow-[inset_0_0_0_1px_rgba(0,24,62,0.12)] transition hover:bg-surface-tint"
        >
          <GlobeIcon className="h-[18px] w-[18px]" />
          <span aria-hidden="true">
            {currentLanguage.short} · {currency}
            <span className="hidden sm:inline"> · {currentUnits.short}</span>
          </span>
          <span className="sr-only">
            Language and region:{" "}
            <span lang={currentLanguage.value}>{currentLanguage.name}</span>, {currencyInfo?.label ?? currency},{" "}
            {currentUnits.label}
          </span>
        </button>

        {open ? (
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={titleId}
            style={phoneTop !== null ? { position: "fixed", top: phoneTop, left: 16, right: 16, width: "auto", marginTop: 0 } : undefined}
            className="absolute right-0 top-full z-50 mt-2 max-h-[calc(100vh-7rem)] w-[22rem] overflow-y-auto rounded-[1.5rem] bg-surface-lowest p-5 shadow-[0_24px_60px_rgba(7,25,50,0.18)] tonal-rule"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id={titleId} className="font-display text-lg font-semibold text-ink">
                Language and region
              </h2>
              <button
                type="button"
                onClick={() => close(true)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-primary hover:bg-surface-low"
              >
                Done
              </button>
            </div>

            <fieldset className="mt-4">
              <legend className="field-label mb-2">Language</legend>
              <div className="grid gap-2">
                {languages.map((item) => (
                  <ChoiceTile
                    key={item.value}
                    name={`${id}-language`}
                    checked={language === item.value}
                    onChange={() => setLanguage(item.value)}
                    lang={item.value}
                  >
                    {item.name}
                  </ChoiceTile>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-2">
              <label htmlFor={`${id}-currency`} className="field-label">
                Currency
              </label>
              <Select id={`${id}-currency`} value={currency} onChange={(event) => setCurrency(event.target.value)}>
                {currencyList.map((item) => (
                  <option key={item.code} value={item.code}>
                    {`${translateText(item.label, language)} — ${item.code}`}
                  </option>
                ))}
              </Select>
              <p className="field-hint">Sellers set prices in EUR. Other currencies are indicative.</p>
            </div>

            <fieldset className="mt-5">
              <legend className="field-label mb-2">Units</legend>
              <div className="grid grid-cols-2 gap-2">
                {unitOptions.map((item) => (
                  <ChoiceTile
                    key={item.value}
                    name={`${id}-units`}
                    checked={units === item.value}
                    onChange={() => setUnits(item.value)}
                  >
                    <span>{item.label}</span>
                    <span className={cn("text-xs font-normal", units === item.value ? "text-white/80" : "text-muted")}>
                      {item.detail}
                    </span>
                  </ChoiceTile>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}
      </div>
    </Localized>
  );
}
