import Link from "next/link";
import { RATES_DATE, RATES_SOURCE } from "@/data/currencies";
import { getAssetPath } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";

export function Footer() {
  return (
    <Localized><footer className="mt-20 bg-primary text-white">
      <div className="shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <img
              src={getAssetPath("/brand/bridgeon-logo-full.png")}
              alt="Bridgeon Assets"
              width={640}
              height={420}
              className="h-auto w-56"
            />
            <p className="section-title mt-4 max-w-3xl text-white">
              Insolvency assets from professional sellers across Europe.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-sm font-semibold text-white/75">Navigate</p>
            <div className="mt-2 grid justify-items-start gap-1 text-sm text-white/80">
              <Link href="/" className="inline-flex min-h-10 items-center no-underline transition hover:text-white">
                Overview
              </Link>
              <Link href="/listings" className="inline-flex min-h-10 items-center no-underline transition hover:text-white">
                Listings
              </Link>
              <Link href="/buyers" className="inline-flex min-h-10 items-center no-underline transition hover:text-white">
                For buyers
              </Link>
              <Link href="/sell" className="inline-flex min-h-10 items-center no-underline transition hover:text-white">
                Sell with us
              </Link>
              <Link href="/resources" className="inline-flex min-h-10 items-center no-underline transition hover:text-white">
                Partners &amp; Resources
              </Link>
            </div>
          </nav>

          <div>
            <p className="text-sm font-semibold text-white/75">About this demo</p>
            <p className="support-copy mt-4 max-w-md text-white/80">
              Presentation prototype: listings, sellers and messages are fictional and nothing is sent or stored.
            </p>
            <p className="support-copy mt-3 max-w-md text-white/80">
              {`Sellers price their assets in EUR. Other currencies are converted at indicative ${RATES_SOURCE} of ${formatDate(RATES_DATE)}.`}
            </p>
          </div>
        </div>
      </div>
    </footer></Localized>
  );
}
