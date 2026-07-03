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
      className="grid size-10 place-items-center rounded-md bg-panel text-muted shadow-soft transition-transform duration-150 ease-snappy hover:text-ink disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.96]"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
