import { cn } from "@/lib/utils";

type PageTitleProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
};

export function PageTitle({
  title,
  description,
  eyebrow,
  className,
}: PageTitleProps) {
  return (
    <div className={cn("space-y-2 animate-in-slide-up", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
