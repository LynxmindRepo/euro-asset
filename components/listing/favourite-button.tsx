"use client";

import { useToast } from "@/components/feedback/toast-provider";
import { Localized } from "@/components/ui/localized";
import { useFavourites } from "@/features/favourites/favourites-context";
import { cn } from "@/lib/utils";
import { Listing } from "@/types";

export function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20.5s-7.5-4.4-9.2-9.3C1.6 7.6 4 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3.3 0 5.7 3.1 4.5 6.7-1.7 4.9-9.2 9.3-9.2 9.3Z" />
    </svg>
  );
}

/**
 * Toggle button (aria-pressed) that adds a listing to the visitor's favourites.
 * "icon": round button over a card image (sits above the card's stretched link with z-10).
 * "full": labelled button for the listing page.
 */
export function FavouriteButton({ listing, variant = "icon", className }: { listing: Listing; variant?: "icon" | "full"; className?: string }) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const { pushToast } = useToast();
  const active = isFavourite(listing.id);

  function toggle() {
    const added = toggleFavourite(listing.id);
    pushToast({ tone: "success", text: added ? "Added to your favourites." : "Removed from your favourites." });
  }

  if (variant === "full") {
    return (
      <Localized>
        <button
          type="button"
          aria-pressed={active}
          onClick={toggle}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
            active ? "bg-accent-soft text-accent-ink" : "bg-surface-low text-primary tonal-rule hover:bg-surface-tint",
            className
          )}
        >
          <HeartIcon filled={active} className="h-5 w-5" />
          {active ? "Saved to favourites" : "Save to favourites"}
        </button>
      </Localized>
    );
  }

  return (
    <Localized>
      <button
        type="button"
        aria-pressed={active}
        aria-label={`Save to favourites: ${listing.title}`}
        onClick={toggle}
        className={cn(
          "z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface-lowest/95 shadow-ambient transition hover:scale-105",
          active ? "text-accent-ink" : "text-primary",
          // Callers position it (e.g. absolute over a card image); relative keeps z-10 working otherwise.
          className ?? "relative"
        )}
      >
        <HeartIcon filled={active} className="h-5 w-5" />
      </button>
    </Localized>
  );
}
