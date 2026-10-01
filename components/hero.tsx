import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="section-space">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-midnight-gradient px-6 py-14 text-white shadow-panel sm:px-12 lg:py-20">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <p className="institutional-kicker text-white/75">Insolvency assets across Europe</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            Exclusive assets from across Europe. Search, compare, and connect with trusted sellers — all in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Whether you&apos;re buying for yourself or your business, find insolvency assets from across Europe in one
            place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/listings" className={buttonStyles("accent", "no-underline")}>
              Browse listings
            </Link>
            <Link href="#how-it-works" className={buttonStyles("outline-light", "no-underline")}>
              How it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
