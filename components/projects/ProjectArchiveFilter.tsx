"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  defaultArchived: boolean;
}

export function ProjectArchiveFilter({ defaultArchived }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (checked) {
      params.set("archived", "true");
    } else {
      params.delete("archived");
    }
    
    // We replace so we don't build up a huge history of toggle states
    router.replace(`/projects?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="show-archived" 
        checked={defaultArchived} 
        onCheckedChange={handleToggle} 
      />
      <Label htmlFor="show-archived" className="text-sm font-medium cursor-pointer">
        Show Archived
      </Label>
    </div>
  );
}
