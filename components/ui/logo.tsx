import Link from "next/link";
import { getAssetPath } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline sm:gap-3">
      {/* Decorative: the accessible name comes from the wordmark text. */}
      <img
        src={getAssetPath("/brand/bridgeon-mark.png")}
        alt=""
        width={80}
        height={44}
        className="h-9 w-auto rounded-lg sm:h-11 sm:rounded-xl"
      />
      {/* "Assets" uses the brand orange as in the logo (logotypes are exempt from WCAG 1.4.3). */}
      <span className="whitespace-nowrap font-brand text-xl font-semibold leading-none tracking-[0.04em] text-primary sm:text-[1.55rem] sm:tracking-[0.05em]">
        Bridgeon <span className="text-accent">Assets</span>
      </span>
    </Link>
  );
}
