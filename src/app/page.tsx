"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PowerUsageChart } from "@/components/power-usage-chart";
import { EventsTable } from "@/components/events-table";
import { CacheStatusIndicator } from "@/components/cache-status-indicator";
import type { PowerDataPoint, GridEvent } from "@/lib/constants";

export default function Home() {
  const queryClient = useQueryClient();

  const powerQuery = useQuery<PowerDataPoint[]>({
    queryKey: ["power-usage"],
    queryFn: async () => {
      const response = await fetch("/api/power-usage");
      if (!response.ok) throw new Error("Failed to fetch power usage data");
      return response.json();
    },
    staleTime: 0,
  });

  const eventsQuery = useQuery<GridEvent[]>({
    queryKey: ["grid-events"],
    queryFn: async () => {
      const response = await fetch("/api/grid-events");
      if (!response.ok) throw new Error("Failed to fetch grid events");
      return response.json();
    },
    staleTime: 0,
  });

  const handleRefresh = () => {
    powerQuery.refetch();
    eventsQuery.refetch();
  };

  const handleClearCache = () => {
    queryClient.clear();
    powerQuery.refetch();
    eventsQuery.refetch();
  };

  return (
    <div className="font-sans min-h-screen p-8">
      <div className="mb-6 px-2 sm:px-6">
        <CacheStatusIndicator
          powerQuery={powerQuery}
          eventsQuery={eventsQuery}
          onRefresh={handleRefresh}
          onClearCache={handleClearCache}
        />
      </div>
      <div className="flex flex-col gap-8">
        <PowerUsageChart
          data={powerQuery.data}
          isLoading={powerQuery.isLoading}
          isError={powerQuery.isError}
        />
        <EventsTable
          data={eventsQuery.data}
          isLoading={eventsQuery.isLoading}
          isError={eventsQuery.isError}
        />
      </div>
    </div>
  );
}
