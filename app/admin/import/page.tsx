"use client";

import Link from "next/link";
import { AdminSidebar } from "@/components/admin/sidebar";
import { PageShell } from "@/components/layout/page-shell";
import { ListingImport } from "@/components/partner/listing-import";
import { Button } from "@/components/ui/button";
import { useMockSession } from "@/features/auth/mock-session";

export default function ImportListingPage() {
  const { currentUser } = useMockSession();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <PageShell>
        <div className="shell section-space">
          <div className="panel-xl bg-surface-low">
            <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">Sign in with the admin profile to import listings.</h1>
            <div className="mt-6">
              <Button onClick={() => window.dispatchEvent(new Event("open-mock-login"))}>Open login</Button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="section-space">
        <div className="shell grid gap-8 xl:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div>
            <h1 className="page-title text-[clamp(2rem,4vw,3rem)]">Import a listing</h1>
            <p className="support-copy mt-2 max-w-2xl">
              List in minutes, not hours: paste the listing you already prepared for your local sale and we convert it
              automatically. Prefer to type it yourself?{" "}
              <Link href="/admin/new" className="font-semibold text-primary">
                Create a listing manually
              </Link>
              .
            </p>
            <div className="mt-8">
              <ListingImport />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
