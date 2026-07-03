"use client";

import type { ReactNode } from "react";

export function IconButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 place-items-center rounded-lg border border-line bg-panel text-muted/80 shadow-soft transition-all duration-200 hover:text-ink hover:border-muted/80 hover:bg-control/20 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none disabled:bg-panel disabled:border-line/60 active:scale-[0.94] cursor-pointer"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
