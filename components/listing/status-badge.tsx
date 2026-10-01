import { ListingStatus } from "@/types";
import { getStatusLabel } from "@/lib/listing-helpers";
import { cn } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";

export function StatusBadge({ status, className }: { status: ListingStatus; className?: string }) {
  return (
    <Localized><span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        status === "available" && "bg-success text-success-ink",
        status === "reserved" && "bg-accent text-primary",
        status === "sold" && "bg-primary text-white",
        className
      )}
    >
      {getStatusLabel(status)}
    </span></Localized>
  );
}
