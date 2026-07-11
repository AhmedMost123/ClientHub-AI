import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { getPageConfig } from "@/lib/pages";

const config = getPageConfig("clients")!;

export default function Page() {
  return (
    <PlaceholderPage
      title={config.title}
      description={config.description}
      icon={config.icon}
      eyebrow={config.eyebrow}
    />
  );
}
