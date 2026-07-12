import Link from "next/link";

export function SiteMark() {
  return (
    <Link
      className="group inline-flex items-center gap-3 no-underline"
      href="/"
    >
      <span
        className="size-2 rounded-full bg-accent transition-transform group-hover:scale-125"
        aria-hidden="true"
      />
      <span className="font-mono text-xs font-semibold tracking-wider">
        BRAINRACK
      </span>
    </Link>
  );
}
