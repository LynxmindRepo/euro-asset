"use client";

import { useState } from "react";
import { getAssetPath } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-[1.75rem] bg-surface-low">
        <img
          src={getAssetPath(images[active])}
          alt={images.length > 1 ? `${title} — image ${active + 1} of ${images.length}` : title}
          className="h-[300px] w-full object-cover md:h-[460px]"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === active}
              className={cn(
                "overflow-hidden rounded-2xl bg-surface-low p-1 transition",
                index === active ? "shadow-[inset_0_0_0_3px_rgb(var(--primary))]" : "opacity-80 hover:opacity-100"
              )}
            >
              <img src={getAssetPath(image)} alt="" className="h-20 w-full rounded-xl object-cover md:h-24" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
