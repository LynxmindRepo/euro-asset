"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Select } from "@/components/ui/select";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import { buyerCountries } from "@/data/cost-rates";
import { currencies } from "@/data/currencies";
import { estimatorLineResources, resourceCategories } from "@/data/resources";
import Link from "next/link";
import { useCurrency } from "@/features/preferences/currency-context";
import { useUnits } from "@/features/preferences/units-context";
import { CostEstimate, estimateTotalCost, guessBuyerCountry } from "@/lib/cost-estimator";
import { cn, formatCurrency } from "@/lib/utils";
import { Listing } from "@/types";
import { Localized } from "@/components/ui/localized";

type Entry = {
  id: number;
  question: string;
  /** Estimate answers show the breakdown table; text answers are plain follow-ups. */
  estimate?: CostEstimate;
  text: string;
  steps: string[];
};

type Animation = { entryId: number; phase: "thinking" | "writing" | "lines" | "done"; step: number; words: number; lines: number };

const TIMING = { step: 650, word: 28, line: 260 };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function CostEstimator({ listing }: { listing: Listing }) {
  const fallbackCountry = listing.country === "Germany" ? "France" : "Germany";
  const [country, setCountry] = useState(fallbackCountry);
  const { currency: siteCurrency } = useCurrency();
  const { units } = useUnits();
  const [currency, setCurrency] = useState(siteCurrency);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [animation, setAnimation] = useState<Animation | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const nextId = useRef(1);
  const reducedMotion = usePrefersReducedMotion();

  // Default the buyer country from the browser language (client-only to avoid hydration mismatches).
  useEffect(() => {
    const guessed = guessBuyerCountry(navigator.language, fallbackCountry);
    setCountry(guessed);
  }, [fallbackCountry]);

  // Follow the site-wide currency chosen in the header (can still be changed here for this estimate).
  useEffect(() => {
    setCurrency(siteCurrency);
  }, [siteCurrency]);

  const isBusy = animation !== null && animation.phase !== "done";
  const lastEstimate = useMemo(() => [...entries].reverse().find((entry) => entry.estimate)?.estimate, [entries]);
  const lastEstimateEntry = [...entries].reverse().find((entry) => entry.estimate);
  const inputsChanged =
    lastEstimateEntry?.estimate &&
    (lastEstimateEntry.estimate.currency !== currency ||
      lastEstimateEntry.estimate.units !== units ||
      !lastEstimateEntry.question.includes(country));

  function ask(question: string, answer: { estimate?: CostEstimate; text: string; steps: string[] }) {
    const id = nextId.current++;
    setEntries((current) => [...current, { id, question, ...answer }]);
    setAnnouncement(answer.estimate ? "Estimating the total cost…" : "Thinking…");
    setAnimation(
      reducedMotion
        ? { entryId: id, phase: "done", step: answer.steps.length, words: Infinity, lines: Infinity }
        : { entryId: id, phase: "thinking", step: 0, words: 0, lines: 0 }
    );
  }

  function askTotalCost() {
    const estimate = estimateTotalCost(listing, country, currency, units);
    ask(`What's the total cost to bring it to ${country}, in ${currency}?`, {
      estimate,
      text: estimate.summary,
      steps: estimate.steps
    });
  }

  // Drive the AI-style animation: thinking steps → streamed text → cost lines.
  useEffect(() => {
    if (!animation || animation.phase === "done") return;
    const entry = entries.find((item) => item.id === animation.entryId);
    if (!entry) return;
    const wordCount = entry.text.split(" ").length;
    const lineCount = entry.estimate?.lines.length ?? 0;

    const timer = window.setTimeout(
      () => {
        setAnimation((current) => {
          if (!current) return current;
          if (current.phase === "thinking") {
            return current.step + 1 < entry.steps.length
              ? { ...current, step: current.step + 1 }
              : { ...current, step: entry.steps.length, phase: "writing" };
          }
          if (current.phase === "writing") {
            return current.words + 1 < wordCount
              ? { ...current, words: current.words + 1 }
              : { ...current, words: wordCount, phase: lineCount > 0 ? "lines" : "done" };
          }
          return current.lines + 1 < lineCount ? { ...current, lines: current.lines + 1 } : { ...current, lines: lineCount, phase: "done" };
        });
      },
      animation.phase === "thinking" ? TIMING.step : animation.phase === "writing" ? TIMING.word : TIMING.line
    );

    return () => window.clearTimeout(timer);
  }, [animation, entries]);

  // Announce the finished answer once (screen readers don't get the word-by-word stream).
  useEffect(() => {
    if (animation?.phase !== "done") return;
    const entry = entries.find((item) => item.id === animation.entryId);
    if (!entry) return;
    setAnnouncement(
      entry.estimate
        ? `Estimate ready. Total about ${formatCurrency(entry.estimate.totalEur * entry.estimate.rate, entry.estimate.currency)}.`
        : entry.text
    );
  }, [animation, entries]);

  if (listing.status === "sold") return null;

  return (
    <Localized><section
      id="cost-estimator"
      aria-labelledby="estimator-title"
      className="scroll-mt-28 overflow-hidden rounded-[1.75rem] bg-surface-lowest shadow-panel tonal-rule"
    >
      <div className="bg-midnight-gradient px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
            <SparkleIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 id="estimator-title" className="font-display text-xl font-semibold">
              AI Cost Estimator
            </h2>
            <p className="text-sm text-white/80">What would it cost to bring this asset to you?</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6">
        <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-2">
            <label htmlFor="estimator-country" className="field-label">
              Your country
            </label>
            <Select
              id="estimator-country"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value);
              }}
            >
              {buyerCountries.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="estimator-currency" className="field-label">
              Show amounts in
            </label>
            <Select id="estimator-currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>
              {currencies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {entries.length > 0 ? (
          <ol aria-label="Conversation with the cost assistant" className="grid gap-4">
            {entries.map((entry) => {
              const live = animation?.entryId === entry.id ? animation : null;
              const done = !live || live.phase === "done";

              return (
                <li key={entry.id} className="grid gap-3">
                  <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-white">
                    <span className="sr-only">You asked: </span>
                    {entry.question}
                  </p>
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary"
                    >
                      <SparkleIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-surface-low px-4 py-3 text-sm text-ink tonal-rule">
                      <span className="sr-only">Assistant: </span>
                      {live && live.phase === "thinking" ? (
                        <ul aria-hidden="true" className="grid gap-1.5">
                          {entry.steps.slice(0, live.step + 1).map((step, index) => (
                            <li key={step} className="flex items-center gap-2 text-muted">
                              {index < live.step ? (
                                <span className="text-success-ink">✓</span>
                              ) : (
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              )}
                              {step}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          {done ? (
                            <p className="leading-6">{entry.text}</p>
                          ) : (
                            <p aria-hidden="true" className="leading-6">
                              {entry.text.split(" ").slice(0, live!.words + 1).join(" ")}
                              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />
                            </p>
                          )}
                          {entry.estimate && (done || live!.phase === "lines") ? (
                            <CostTable estimate={entry.estimate} visibleLines={done ? Infinity : live!.lines + 1} complete={done} />
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {entries.length === 0 || (inputsChanged && !isBusy) ? (
            <button
              type="button"
              onClick={askTotalCost}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary shadow-ambient transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SparkleIcon className="h-4 w-4" />
              {entries.length === 0 ? "What's the total cost?" : `Recalculate for ${country} in ${currency}`}
            </button>
          ) : null}
          {lastEstimate && !inputsChanged && !isBusy
            ? lastEstimate.followUps
                .filter((followUp) => !entries.some((entry) => entry.question === followUp.question))
                .map((followUp) => (
                  <button
                    key={followUp.question}
                    type="button"
                    disabled={isBusy}
                    onClick={() => ask(followUp.question, { text: followUp.answer, steps: ["Thinking"] })}
                    className="rounded-full bg-surface-high px-4 py-2 text-sm font-medium text-primary tonal-rule transition hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {followUp.question}
                  </button>
                ))
            : null}
        </div>

        <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm text-ink">
          <strong className="font-semibold text-accent-ink">Estimate only.</strong> Indicative figures based on typical
          transport, registration and exchange rates — not a quote. Confirm costs with the seller and service providers.
        </p>

        <p role="status" className="sr-only">
          {announcement}
        </p>
      </div>
    </section></Localized>
  );
}

function CostTable({ estimate, visibleLines, complete }: { estimate: CostEstimate; visibleLines: number; complete: boolean }) {
  const amount = (eur: number) => formatCurrency(eur * estimate.rate, estimate.currency);

  return (
    <div className="mt-3 overflow-hidden rounded-xl bg-surface-lowest tonal-rule">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Estimated total cost breakdown in {estimate.currency}</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Cost</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {estimate.lines.slice(0, visibleLines).map((line) => (
            <tr key={line.id} className="border-b border-surface-high last:border-b-0 motion-safe:animate-[fadeIn_0.3s_ease-out]">
              <th scope="row" className="px-4 py-2.5 font-normal">
                <span className="block font-medium text-ink">{line.label}</span>
                <span className="block text-xs text-muted">{line.detail}</span>
              </th>
              <td className="whitespace-nowrap px-4 py-2.5 text-right font-semibold text-ink">{amount(line.amountEur)}</td>
            </tr>
          ))}
        </tbody>
        {complete ? (
          <tfoot className="bg-primary text-white">
            <tr>
              <th scope="row" className="px-4 py-3 font-semibold">
                Estimated total
                {estimate.currency !== "EUR" ? (
                  <span className="block text-xs font-normal text-white/80">≈ {formatCurrency(estimate.totalEur)} · 1 EUR = {estimate.rate} {estimate.currency}</span>
                ) : null}
              </th>
              <td className={cn("whitespace-nowrap px-4 py-3 text-right font-display text-lg font-semibold")}>
                {amount(estimate.totalEur)}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
      {complete ? <QuoteLinks estimate={estimate} /> : null}
    </div>
  );
}

/** "Get real quotes" — links to the Partners & Resources sections relevant to this estimate. */
function QuoteLinks({ estimate }: { estimate: CostEstimate }) {
  const ids = Array.from(new Set(estimate.lines.flatMap((line) => estimatorLineResources[line.id] ?? [])));
  if (!ids.includes("financing")) ids.push("financing");
  const categories = resourceCategories.filter((category) => ids.includes(category.id));

  return (
    <div className="border-t border-surface-high px-4 py-3 text-sm">
      <p className="font-medium text-ink">Get real quotes from our partners:</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/resources#${category.id}`}
              className="inline-flex rounded-full bg-surface-low px-3 py-1 text-xs font-semibold text-primary no-underline tonal-rule transition hover:bg-surface-tint"
            >
              {category.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
