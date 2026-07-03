"use client";

type SegmentedControlProps<T extends string> = {
  ariaLabel: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<readonly [T, string]>;
  variant?: "default" | "sidebar";
};

export function SegmentedControl<T extends string>({
  ariaLabel,
  value,
  onChange,
  options,
  variant = "default",
}: SegmentedControlProps<T>) {
  const isSidebar = variant === "sidebar";

  return (
    <fieldset
      aria-label={ariaLabel}
      className={`grid grid-flow-col auto-cols-fr rounded-lg p-0.5 border transition-all duration-200 ${
        isSidebar
          ? "bg-sidebar-soft/50 border-sidebar-soft"
          : "bg-control/60 border-line/60"
      }`}
    >
      {options.map(([optionValue, label]) => (
        <SegmentedControlOption
          key={optionValue}
          isActive={value === optionValue}
          isSidebar={isSidebar}
          label={label}
          onClick={() => onChange(optionValue)}
        />
      ))}
    </fieldset>
  );
}

function SegmentedControlOption({
  isActive,
  isSidebar,
  label,
  onClick,
}: {
  isActive: boolean;
  isSidebar: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`min-h-11 rounded-md px-3 text-[0.72rem] font-bold tracking-tight transition-all duration-200 ease-snappy active:scale-[0.97] cursor-pointer ${controlColor(
        isActive,
        isSidebar,
      )}`}
    >
      {label}
    </button>
  );
}

function controlColor(isActive: boolean, isSidebar: boolean) {
  if (isActive) {
    return isSidebar
      ? "bg-sidebar-hover text-sidebar-ink shadow-soft border border-sidebar-soft"
      : "bg-panel text-ink shadow-soft border border-line/40";
  }

  return isSidebar
    ? "text-sidebar-muted/80 hover:text-sidebar-ink hover:bg-sidebar-hover/30 border border-transparent"
    : "text-muted hover:text-ink hover:bg-control/40 border border-transparent";
}
