"use client";

import { PartnerShell } from "@/components/partner/partner-shell";
import { ListingImport } from "@/components/partner/listing-import";

export default function PartnerImportPage() {
  return (
    <PartnerShell
      title="Import a listing"
      intro="List in minutes, not hours: paste the listing you already prepared for your local sale and we convert it automatically."
    >
      {(partner) => <ListingImport fixedPartnerId={partner.id} redirectTo="/partner" />}
    </PartnerShell>
  );
}
