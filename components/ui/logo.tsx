import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <span className="flex h-11 w-11 items-end justify-center rounded-[1.1rem] bg-primary p-2">
        <span className="flex h-full w-full items-end gap-1">
          <span className="h-4 w-2 rounded-full bg-accent/70" />
          <span className="h-6 w-2 rounded-full bg-accent/85" />
          <span className="h-8 w-2 rounded-full bg-gradient-to-t from-accent to-[#ffb27f]" />
        </span>
      </span>
      <span className="whitespace-nowrap font-display text-xl font-bold tracking-[-0.04em] text-primary">
        Bridgeon Assets
      </span>
    </Link>
  );
}
