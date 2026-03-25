import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";

export default function Loading() {
  return (
    <div className="shell section-space grid gap-6">
      <LoadingSkeleton className="h-20 w-56" />
      <LoadingSkeleton className="h-80 w-full" />
      <div className="grid gap-4 lg:grid-cols-3">
        <LoadingSkeleton className="h-72 w-full" />
        <LoadingSkeleton className="h-72 w-full" />
        <LoadingSkeleton className="h-72 w-full" />
      </div>
    </div>
  );
}
