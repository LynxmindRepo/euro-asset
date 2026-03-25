"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/new", label: "New process" }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[2rem] bg-surface-low p-4 tonal-rule">
      <p className="institutional-kicker px-3 pt-2">Administrative area</p>
      <p className="px-3 pt-3 text-sm leading-6 text-muted">
        Curate mandates, review session activity, and prepare new process records for presentation.
      </p>
      <nav className="mt-4 grid gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-[1.1rem] px-4 py-3 text-sm no-underline transition",
              pathname === item.href
                ? "bg-midnight-gradient text-white shadow-ambient"
                : "bg-transparent text-muted hover:bg-[rgba(0,30,64,0.05)] hover:text-primary"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
