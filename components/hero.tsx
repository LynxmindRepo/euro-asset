import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="section-space">
      <div className="shell grid gap-8 lg:grid-cols-[1.22fr_0.78fr] lg:items-end">
        <div className="display-frame relative overflow-hidden px-8 py-10 sm:px-12 sm:py-14">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent)]" />
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <p className="institutional-kicker text-white/65">European special situations platform</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
            Review, assess, and submit proposals across insolvency, restructuring, and judicial sale mandates.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/78">
            A premium cross-border experience for insolvency, liquidation, restructuring, and
            court-led transactions, designed for industrial buyers and global traders.
          </p>
          <div className="mt-7 grid gap-3 text-sm text-white/75 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">EUR-only mandate for the current phase</div>
            <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">Portugal, Spain, Italy, and France</div>
            <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">Structured proposal dossier workflow</div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auctions" className={buttonStyles("primary", "no-underline")}>
              Explore processes
            </Link>
            <Link href="/cart" className={buttonStyles("gold", "no-underline")}>
              Review dossier
            </Link>
          </div>
        </div>
        <div className="grid gap-4 lg:pb-3">
          <div className="rounded-[2rem] bg-surface-lowest px-6 py-8 shadow-panel tonal-rule">
            <p className="institutional-kicker">European curation</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">
              Legal, documentary, and operating context visible from the first screen.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Built for distressed assets, industrial acquirers, and cross-border traders who require clarity before engagement.
            </p>
          </div>
          <div className="rounded-[2rem] bg-surface-legal px-6 py-8 tonal-rule">
            <p className="institutional-kicker">Institutional reading</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              The visual structure follows `design.md`: tonal surfaces, midnight blue gradients,
              and champagne accents at decision and validation moments.
            </p>
          </div>
          <div className="rounded-[2rem] bg-surface-tint px-6 py-7 tonal-rule">
            <p className="institutional-kicker">Signal priorities</p>
            <div className="mt-4 grid gap-3 text-sm text-ink">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">Process origin</span>
                <span className="font-semibold">Visible upfront</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">Documentation visibility</span>
                <span className="font-semibold">Structured access</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">Proposal path</span>
                <span className="font-semibold">Controlled flow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
