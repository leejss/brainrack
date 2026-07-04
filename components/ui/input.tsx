import { cn } from "@/lib/cn";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border border-line bg-panel px-3 py-2 text-sm shadow-soft outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-snappy",
        "placeholder:text-muted/70 selection:bg-accent/20",
        "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20",
        "disabled:cursor-not-allowed disabled:bg-control disabled:text-muted disabled:opacity-70",
        "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20",
        className,
      )}
      {...props}
    />
  );
}
