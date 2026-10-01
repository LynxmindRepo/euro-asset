"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "accent";
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
    variant === "accent" && "bg-accent text-primary shadow-ambient hover:-translate-y-0.5 hover:brightness-105",
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
