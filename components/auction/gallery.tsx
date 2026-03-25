"use client";

import { useState } from "react";
import { getAssetPath } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  title,
  compact = false,
  hero = false
}: {
  images: string[];
  title: string;
  compact?: boolean;
  hero?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-4">
      <div
        className={cn(
          "overflow-hidden rounded-[2rem] bg-surface-low p-3",
          compact && "p-2.5",
          hero && "bg-transparent p-0"
        )}
      >
        <img
          src={getAssetPath(images[active])}
          alt={title}
          className={cn(
            "w-full rounded-[1.3rem] object-cover",
            hero && "rounded-none",
            compact ? "h-[320px] md:h-[360px]" : "h-[420px]"
          )}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "overflow-hidden rounded-2xl bg-surface-low p-2 transition",
              hero && "bg-surface-lowest/80 p-1.5",
              index === active && "ghost-outline bg-surface-lowest"
            )}
          >
            <img
              src={getAssetPath(image)}
              alt={`${title} ${index + 1}`}
              className={cn(
                "w-full rounded-xl object-cover",
                compact ? "h-20" : "h-24",
                hero && "h-24 md:h-28"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
