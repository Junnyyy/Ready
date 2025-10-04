"use client";

import { Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryState, parseAsInteger } from "nuqs";
import { PowerUsageChart } from "@/components/power-usage-chart";
import { EventsTable } from "@/components/events-table";
import { CacheStatusIndicator } from "@/components/cache-status-indicator";
import type { PowerDataPoint, GridEvent } from "@/lib/constants";

interface GridEventsResponse {
  data: GridEvent[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

interface GridEventsMetadata {
  totalCount: number;
  totalPages: number;
  pageSize: number;
}

function HomeContent() {
  const queryClient = useQueryClient();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const pageSize = 5;

  const powerQuery = useQuery<PowerDataPoint[]>({
    queryKey: ["power-usage"],
    queryFn: async () => {
      const response = await fetch("/api/power-usage");
      if (!response.ok) throw new Error("Failed to fetch power usage data");
      return response.json();
    },
    staleTime: 0,
  });

  const metadataQuery = useQuery<GridEventsMetadata>({
    queryKey: ["grid-events-metadata"],
    queryFn: async () => {
      const response = await fetch("/api/grid-events/metadata");
      if (!response.ok) throw new Error("Failed to fetch grid events metadata");
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since it rarely changes
  });

  const eventsQuery = useQuery<GridEventsResponse>({
    queryKey: ["grid-events", page],
    queryFn: async () => {
      const response = await fetch(
        `/api/grid-events?page=${page}&pageSize=${pageSize}`
      );
      if (!response.ok) throw new Error("Failed to fetch grid events");
      return response.json();
    },
    staleTime: 0,
  });

  const handleRefresh = () => {
    powerQuery.refetch();
    metadataQuery.refetch();
    eventsQuery.refetch();
  };

  const handleClearCache = () => {
    queryClient.clear();
    powerQuery.refetch();
    metadataQuery.refetch();
    eventsQuery.refetch();
  };

  return (
    <div className="font-sans min-h-screen p-4 sm:p-8">
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
          data={eventsQuery.data?.data}
          isLoading={eventsQuery.isLoading}
          isError={eventsQuery.isError}
          currentPage={page}
          totalPages={metadataQuery.data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="font-sans min-h-screen p-4 sm:p-8" />}>
      <HomeContent />
    </Suspense>
  );
}
