import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "elevated" | "muted" | "editorial" | "metric";
};

export function cardStyles(
  variant: CardProps["variant"] = "elevated",
  className?: string
) {
  return cn(
    "rounded-[1.75rem]",
    variant === "elevated" && "bg-surface-lowest shadow-panel tonal-rule",
    variant === "muted" && "bg-surface-low tonal-rule",
    variant === "editorial" && "bg-surface-low px-6 py-6 tonal-rule",
    variant === "metric" && "bg-surface-lowest px-6 py-6 shadow-panel tonal-rule",
    className
  );
}

export function Card({ children, className, variant = "elevated" }: CardProps) {
  return <div className={cardStyles(variant, className)}>{children}</div>;
}
