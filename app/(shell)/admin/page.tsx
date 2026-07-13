import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { requireAdmin } from "@/lib/auth/authorization";
import { getPageConfig } from "@/lib/pages";

const config = getPageConfig("admin")!;

export default async function Page() {
  await requireAdmin();

  return (
    <PlaceholderPage
      title={config.title}
      description={config.description}
      icon={config.icon}
      eyebrow={config.eyebrow}
    />
  );
}
