"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "gold";
};

export function buttonStyles(
  variant: ButtonProps["variant"] = "primary",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" &&
      "bg-midnight-gradient text-white shadow-panel hover:-translate-y-0.5 hover:opacity-95",
    variant === "secondary" &&
      "bg-surface-high text-ink tonal-rule hover:bg-surface-tint hover:text-primary",
    variant === "ghost" && "bg-transparent text-primary hover:bg-[rgba(6,24,51,0.05)]",
    variant === "gold" && "bg-tertiary text-tertiary-ink shadow-ambient hover:brightness-[0.98]",
    className
  );
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, className)}
      {...props}
    />
  );
}
