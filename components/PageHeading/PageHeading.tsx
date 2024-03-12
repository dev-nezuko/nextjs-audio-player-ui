interface Props {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}

export const PageHeading: React.FC<Props> = ({ eyebrow, title, children }) => (
  <header className="mb-8 space-y-2">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
      {eyebrow}
    </p>
    <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
    {children && <div className="max-w-2xl text-muted">{children}</div>}
  </header>
);
