import StatCard from "./StatCard";
import { stats } from "@/lib/mock-data";

export default function StatsOverview() {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Statistics overview"
    >
      {stats.map((item, index) => (
        <StatCard key={item.title} {...item} index={index} />
      ))}
    </section>
  );
}
