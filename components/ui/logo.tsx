import Link from "next/link";
import { getAssetPath } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      {/* Decorative: the accessible name comes from the wordmark text. */}
      <img
        src={getAssetPath("/brand/bridgeon-mark.png")}
        alt=""
        width={80}
        height={44}
        className="h-11 w-auto rounded-xl"
      />
      {/* "Assets" uses the brand orange as in the logo (logotypes are exempt from WCAG 1.4.3). */}
      <span className="whitespace-nowrap font-brand text-[1.55rem] font-semibold leading-none tracking-[0.05em] text-primary">
        Bridgeon <span className="text-accent">Assets</span>
      </span>
    </Link>
  );
}
