"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "default" | "accent" | "outline" | "subtle";
export type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseStyles =
  "inline-flex items-center justify-center font-bold border-2 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 rounded-lg text-sm",
  md: "px-5 py-3 rounded-xl text-base",
  icon: "p-3 rounded-full", // For Settings button
};

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "border-brand bg-brand-soft text-brand-foreground hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-brand-muted)] disabled:hover:shadow-[4px_4px_0px_var(--color-brand-muted)]",
  accent:
    "border-brand bg-brand text-brand-foreground shadow-[3px_3px_0px_var(--color-brand-muted)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-brand-muted)]",
  outline:
    "border-border bg-surface text-foreground shadow-[3px_3px_0px_var(--color-shadow)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-shadow)]",
  subtle:
    "border-brand-foreground/30 bg-surface text-foreground shadow-[3px_3px_0px_var(--color-brand-muted)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-brand-muted)]",
};

export function Button({
  variant = "default",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    />
  );
}
