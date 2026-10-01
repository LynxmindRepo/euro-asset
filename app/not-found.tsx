"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { buttonStyles } from "@/components/ui/button";

// Exported as out/404.html — GitHub Pages serves it for any unknown URL.
export default function NotFound() {
  return (
    <PageShell>
      <section className="section-space">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Page not found</p>
          <h1 className="page-title mt-3 text-[clamp(2.2rem,4vw,3.2rem)]">We couldn&apos;t find that page.</h1>
          <p className="body-copy mt-4">
            The link may be old, or the listing was created in another demo session (those only exist in the browser
            where they were made).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/listings" className={buttonStyles("accent", "no-underline")}>
              Browse listings
            </Link>
            <Link href="/" className={buttonStyles("secondary", "no-underline")}>
              Go to the homepage
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
