interface Props {
  description?: string | null;
}

export default function ProjectDescription({ description }: Props) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Description</h2>

      {description ? (
        <p className="leading-7 text-muted-foreground whitespace-pre-wrap">
          {description}
        </p>
      ) : (
        <p className="text-muted-foreground">No description yet.</p>
      )}
    </section>
  );
}
