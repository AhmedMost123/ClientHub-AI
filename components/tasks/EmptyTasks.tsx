import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  canEdit: boolean;
  onAdd: () => void;
}

export default function EmptyTasks({ canEdit, onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center bg-card">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <CheckSquare className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Break down your project into manageable tasks to track progress.
      </p>
      {canEdit && (
        <Button onClick={onAdd} className="mt-6">
          Add your first task
        </Button>
      )}
    </div>
  );
}
