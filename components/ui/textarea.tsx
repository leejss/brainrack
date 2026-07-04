import { cn } from "@/lib/cn";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-40 w-full min-w-0 resize-y rounded-md border border-line bg-panel px-3 py-2 text-sm shadow-soft outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-snappy",
        "placeholder:text-muted/70 selection:bg-accent/20",
        "focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20",
        "disabled:cursor-not-allowed disabled:bg-control disabled:text-muted disabled:opacity-70",
        "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20",
        className,
      )}
      {...props}
    />
  );
}
