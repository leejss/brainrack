"use client";

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Array<readonly [T, string]>;
  variant?: "default" | "sidebar";
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  variant = "default",
}: SegmentedControlProps<T>) {
  const isSidebar = variant === "sidebar";

  return (
    <div
      className={`grid grid-cols-2 rounded-md p-1 ${
        isSidebar ? "bg-sidebar-soft" : "bg-control"
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
    </div>
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
      onClick={onClick}
      className={`min-h-9 rounded-[0.375rem] px-2 text-xs font-semibold transition-colors duration-150 ease-snappy ${controlColor(
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
      ? "bg-sidebar-hover text-sidebar-ink shadow-soft"
      : "bg-panel text-ink shadow-soft";
  }

  return isSidebar ? "text-sidebar-muted hover:text-sidebar-ink" : "text-muted hover:text-ink";
}
