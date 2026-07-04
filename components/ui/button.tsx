import { cn } from "@/lib/cn";

const buttonVariants = {
  default:
    "bg-accent text-accent-ink shadow-accent hover:bg-accent-strong hover:text-white",
  secondary:
    "bg-control text-foreground hover:bg-line/70 hover:text-foreground",
  outline:
    "border border-line bg-panel text-foreground shadow-soft hover:border-accent/50 hover:bg-accent-soft",
  ghost: "text-foreground hover:bg-control hover:text-foreground",
  danger: "bg-danger text-white shadow-soft hover:bg-danger/90",
} as const;

const buttonSizes = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2.5 px-5 text-sm",
  icon: "h-10 w-10 p-0",
} as const;

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

export function Button({
  className,
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-medium whitespace-nowrap outline-none transition-[background-color,border-color,box-shadow,color,opacity] duration-200 ease-snappy",
        "focus-visible:ring-3 focus-visible:ring-accent/20",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
}
