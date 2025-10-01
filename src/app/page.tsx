import { PowerUsageChart } from "@/components/power-usage-chart";
import { EventsTable } from "@/components/events-table";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8">
      <div className="flex flex-col gap-8">
        <PowerUsageChart />
        <EventsTable />
      </div>
    </div>
  );
}
