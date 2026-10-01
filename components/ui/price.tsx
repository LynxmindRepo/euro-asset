"use client";

import { useCurrency } from "@/features/preferences/currency-context";
import { cn, formatCurrency } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";

/**
 * Shows an EUR price in the visitor's currency, like airline fares: the converted amount first,
 * the seller's original EUR price underneath when they differ.
 */
export function Price({
  eur,
  className,
  originalClassName,
  sold = false,
  showOriginal = true
}: {
  eur: number;
  className?: string;
  originalClassName?: string;
  sold?: boolean;
  showOriginal?: boolean;
}) {
  const { currency, format } = useCurrency();
  const converted = currency !== "EUR";

  return (
    <Localized><span className="block">
      {/* A sold price is struck through and muted, whatever colour the caller asked for. */}
      <span className={cn(sold ? className?.replace(/\btext-primary\b/g, "") : className, sold && "text-muted line-through")}>
        {converted ? <span aria-hidden="true">≈ </span> : null}
        {converted ? <span className="sr-only">approximately </span> : null}
        {format(eur)}
      </span>
      {converted && showOriginal ? (
        <span className={cn("mt-0.5 block text-xs font-normal text-muted", originalClassName)}>
          Seller&apos;s price {formatCurrency(eur)}
        </span>
      ) : null}
    </span></Localized>
  );
}
