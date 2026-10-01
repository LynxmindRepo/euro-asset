import { AuctionStatus } from "@/types";
import { cn, getStatusLabel } from "@/lib/utils";

export function StatusBadge({
  status,
  className
}: {
  status: AuctionStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        status === "a-encerrar" && "bg-accent text-primary",
        status === "aberto" && "bg-primary text-white",
        status === "agendado" && "bg-surface-legal text-primary",
        status === "encerrado" && "bg-surface-high text-muted",
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
