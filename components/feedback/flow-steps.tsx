import { cn } from "@/lib/utils";

const steps = [
  { id: "detail", label: "Process" },
  { id: "dossier", label: "Dossier" },
  { id: "checkout", label: "Submission" },
  { id: "success", label: "Confirmation" }
];

export function FlowSteps({
  current
}: {
  current: "detail" | "dossier" | "checkout" | "success";
}) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <div className="rounded-[1.5rem] bg-surface-low px-4 py-4 tonal-rule">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm transition",
              index < currentIndex && "bg-primary text-white",
              index === currentIndex && "bg-tertiary text-tertiary-ink",
              index > currentIndex && "bg-surface-lowest text-muted"
            )}
          >
            {index + 1}. {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
