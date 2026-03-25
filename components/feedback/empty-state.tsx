import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  href,
  cta
}: {
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="panel-xl bg-surface-low text-center">
      <p className="institutional-kicker">Empty state</p>
      <h3 className="subsection-title mt-3">{title}</h3>
      <p className="support-copy mx-auto mt-3 max-w-xl">{description}</p>
      {href && cta ? (
        <div className="mt-6">
          <Link href={href} className={buttonStyles("primary", "no-underline")}>
            {cta}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
