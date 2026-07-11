import { ChartCard } from "@/components/dashboard/ChartCard";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { deadlines } from "@/lib/mock-data";

export default function Deadlines() {
  return (
    <ChartCard title="Upcoming Deadlines" description="Next 7 days">
      <div className="divide-y divide-border/60">
        {deadlines.map((deadline) => (
          <DeadlineCard key={deadline.id} deadline={deadline} />
        ))}
      </div>
    </ChartCard>
  );
}
