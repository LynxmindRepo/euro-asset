export function PageHero({
  eyebrow,
  title,
  intro,
  children
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="pb-16 pt-6 sm:pt-10">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-midnight-gradient px-6 py-12 text-white shadow-panel sm:px-12 lg:py-16">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-sm font-semibold text-accent">{eyebrow}</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              {title}
            </h1>
            <div className="mt-5 text-lg leading-8 text-white/80">{intro}</div>
            {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
