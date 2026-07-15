import { Priority } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

interface Props {
  priority: Priority;
}

export default function TaskPriorityBadge({
  priority,
}: Props) {
  switch (priority) {
    case "LOW":
      return <Badge variant="secondary">Low</Badge>;

    case "MEDIUM":
      return <Badge>Medium</Badge>;

    case "HIGH":
      return (
        <Badge variant="destructive">
          High
        </Badge>
      );

    case "URGENT":
      return (
        <Badge className="bg-red-700 hover:bg-red-700/80">
          Urgent
        </Badge>
      );

    default:
      return <Badge>{priority}</Badge>;
  }
}
