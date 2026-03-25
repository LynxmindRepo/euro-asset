"use client";

import { cn } from "@/lib/utils";

export function Banner({
  tone = "info",
  children
}: {
  tone?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-3 text-sm leading-6 tonal-rule",
        tone === "info" && "bg-surface-high text-ink",
        tone === "success" && "bg-success text-success-ink",
        tone === "error" && "bg-danger text-danger-ink"
      )}
    >
      {children}
    </div>
  );
}
