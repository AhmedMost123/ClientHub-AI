"use client";

import Link from "next/link";
import { CalendarDays, DollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { formatBudget, formatProjectDate } from "@/lib/project-utils";

import { ProjectCardData } from "@/types/project";

interface Props {
  project: ProjectCardData;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="rounded-2xl p-6 transition hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{project.title}</h3>

          <Badge>{project.status.replace("_", " ")}</Badge>
        </div>

        <p className="text-muted-foreground mt-2">{project.customerName}</p>

        <div className="mt-6 flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />

            {formatBudget(project.budget)}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4" />

            {formatProjectDate(project.dueDate)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
