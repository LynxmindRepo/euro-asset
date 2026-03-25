import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <span className="flex h-11 w-11 items-end justify-center rounded-[1.1rem] bg-primary p-2">
        <span className="flex h-full w-full items-end gap-1">
          <span className="h-4 w-2 rounded-full bg-tertiary/80" />
          <span className="h-6 w-2 rounded-full bg-tertiary/90" />
          <span className="h-8 w-2 rounded-full bg-gradient-to-t from-tertiary to-white/80" />
        </span>
      </span>
      <span className="font-display text-xl font-bold tracking-[-0.04em] text-primary">
        EuroAssets
      </span>
    </Link>
  );
}
