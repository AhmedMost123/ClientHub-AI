import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageTitle } from "@/components/shared/PageTitle";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  eyebrow?: string;
};

export function PlaceholderPage({
  title,
  description,
  icon,
  eyebrow,
}: PlaceholderPageProps) {
  return (
    <PageContainer>
      <div className="space-y-8">
        <PageTitle title={title} description={description} eyebrow={eyebrow} />
        <EmptyState
          icon={icon}
          title="Coming soon"
          description={`The ${title.toLowerCase()} module is being built. Check back as we expand ClientHub AI.`}
        />
      </div>
    </PageContainer>
  );
}
