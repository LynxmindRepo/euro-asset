export type Benefit = { title: string; text: string };

/** Numbered benefits, as in the client's "Why list with us" / "Why buyers choose us" copy. */
export function BenefitGrid({ id, title, benefits }: { id: string; title: string; benefits: Benefit[] }) {
  return (
    <section aria-labelledby={id} className="pb-20">
      <div className="shell">
        <h2 id={id} className="section-title text-[clamp(1.8rem,3vw,2.5rem)]">
          {title}
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit, index) => (
            <li key={benefit.title} className="rounded-[1.5rem] bg-surface-lowest p-6 shadow-ambient tonal-rule">
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-lg font-semibold text-primary"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">{benefit.title}</h3>
              <p className="mt-2 text-base leading-7 text-muted">{benefit.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ClosingStatement({ children, tagline }: { children: React.ReactNode; tagline: string }) {
  return (
    <section className="pb-20">
      <div className="shell">
        <figure className="rounded-[2rem] bg-surface-low px-6 py-10 tonal-rule sm:px-12">
          <blockquote className="max-w-4xl font-display text-[clamp(1.3rem,2.4vw,1.8rem)] leading-snug text-ink">
            {children}
          </blockquote>
          <figcaption className="mt-5 font-display text-2xl font-semibold text-primary">{tagline}</figcaption>
        </figure>
      </div>
    </section>
  );
}
