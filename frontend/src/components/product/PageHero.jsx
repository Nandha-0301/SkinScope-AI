function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="card-base card-strong relative overflow-hidden rounded-[2rem] p-8 sm:p-10 lg:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(99,230,172,0.1),transparent_24%),radial-gradient(circle_at_84%_24%,rgba(56,189,248,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)] sm:inset-5" />

      <div className="relative max-w-3xl space-y-6">
        {eyebrow ? <p className="eyebrow-text text-mint-300/80">{eyebrow}</p> : null}
        <h1 className="heading-1">{title}</h1>
        {subtitle ? <p className="body-base max-w-2xl sm:text-lg">{subtitle}</p> : null}
        {children}
      </div>
    </section>
  );
}

export default PageHero;
