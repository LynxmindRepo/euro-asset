"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useMockSession } from "@/features/auth/mock-session";
import { getPartner } from "@/lib/listing-helpers";
import { cn } from "@/lib/utils";
import { DisposalPartner } from "@/types";
import { Localized } from "@/components/ui/localized";

const items = [
  { href: "/partner", label: "Dashboard" },
  { href: "/partner/import", label: "Import listing" }
];

/** Layout + access guard for the Disposal Partner area ("Stay in control"). */
export function PartnerShell({
  title,
  intro,
  children
}: {
  title: string;
  intro?: React.ReactNode;
  children: (partner: DisposalPartner) => React.ReactNode;
}) {
  const { currentUser } = useMockSession();
  const pathname = usePathname();
  const partner = currentUser?.role === "partner" && currentUser.partnerId ? getPartner(currentUser.partnerId) : undefined;

  if (!partner) {
    return (
      <PageShell>
        <Localized><div className="shell section-space">
          <div className="panel-xl bg-surface-low">
            <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">Sign in as a Disposal Partner</h1>
            <p className="support-copy mt-4 max-w-2xl">
              This is the seller area: manage your listings, mark items as sold and read buyer inquiries. For the demo,
              sign in with the <strong className="font-semibold text-ink">Disposal Partner</strong> profile (Inês
              Carvalho, Tagus Recovery Partners).
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => window.dispatchEvent(new Event("open-mock-login"))}>Open login</Button>
            </div>
          </div>
        </div></Localized>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Localized><section className="section-space">
        <div className="shell grid gap-8 xl:grid-cols-[260px_1fr]">
          <aside aria-label="Disposal Partner area" className="h-fit rounded-[2rem] bg-surface-low p-4 tonal-rule">
            <p className="px-3 pt-2 text-sm font-semibold text-accent-ink">Disposal Partner</p>
            <p className="px-3 pt-1 font-display text-lg font-semibold text-ink">{partner.name}</p>
            <p className="px-3 text-sm text-muted">
              {partner.city}, {partner.country}
            </p>
            <nav aria-label="Partner" className="mt-4 grid gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href || pathname === `${item.href}/` ? "page" : undefined}
                  className={cn(
                    "rounded-[1.1rem] px-4 py-3 text-sm no-underline transition",
                    pathname === item.href || pathname === `${item.href}/`
                      ? "bg-midnight-gradient text-white shadow-ambient"
                      : "text-muted hover:bg-surface-high hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div>
            <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">{title}</h1>
            {intro ? <div className="support-copy mt-2 max-w-2xl">{intro}</div> : null}
            <div className="mt-8">{children(partner)}</div>
          </div>
        </div>
      </section></Localized>
    </PageShell>
  );
}
