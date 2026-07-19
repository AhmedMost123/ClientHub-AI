import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-8xl px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6 xl:px-12 xl:py-6",
        "animate-in-fade",
        className
      )}
    >
      {children}
    </div>
  );
}
