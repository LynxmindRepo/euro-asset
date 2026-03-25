import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-white">
      <div className="shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="institutional-kicker text-white/58">Institutional marketplace</p>
            <h3 className="section-title mt-4 max-w-3xl text-white">
              Visual prototype for European special situations and industrial asset sales.
            </h3>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Navigate</p>
            <div className="mt-4 grid gap-3 text-sm text-white/80">
              <Link href="/" className="no-underline transition hover:text-white">
                Overview
              </Link>
              <Link href="/auctions" className="no-underline transition hover:text-white">
                Processes
              </Link>
              <Link href="/cart" className="no-underline transition hover:text-white">
                Dossier
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Note</p>
            <p className="support-copy mt-4 max-w-md text-white/80">
              This environment uses mock data, local session state, and an English-only interface for demo purposes in the current phase.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
