"use client";

import { useFormContext } from "react-hook-form";
import { ProjectStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "PLANNING", label: "Planning" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "REVIEW", label: "Review" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function ProjectStatusSelect() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium text-foreground">
            Status
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus:ring-2 focus:ring-ring/50">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-xl border shadow-xl">
              {STATUS_OPTIONS.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className="rounded-lg cursor-pointer"
                >
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
