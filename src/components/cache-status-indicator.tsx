"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CacheStatusIndicatorProps {
  powerQuery: {
    data: unknown;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
  };
  eventsQuery: {
    data: unknown;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
  };
  onRefresh: () => void;
  onClearCache: () => void;
}

export function CacheStatusIndicator({
  powerQuery,
  eventsQuery,
  onRefresh,
  onClearCache,
}: CacheStatusIndicatorProps) {
  const [showLegend, setShowLegend] = useState(false);

  const hasError = powerQuery.isError || eventsQuery.isError;
  const hasData = !!powerQuery.data && !!eventsQuery.data;
  const isFetching = powerQuery.isFetching || eventsQuery.isFetching;
  const isLoading = powerQuery.isLoading || eventsQuery.isLoading;

  let label: string;
  let description: string;
  let dotColor: string;

  if (hasError) {
    label = "Error";
    description = "Failed to load data";
    dotColor = "bg-gray-400";
  } else if (isLoading && !hasData) {
    // First visit: No cached data, fetching from server
    label = "Loading";
    description = "Fetching from server";
    dotColor = "bg-red-500";
  } else if (hasData && isFetching) {
    // Subsequent visit: Showing cached data while refetching from server
    label = "Updating";
    description = "Revalidating with server";
    dotColor = "bg-orange-500";
  } else if (hasData && !isFetching) {
    // Data loaded and no background activity
    label = "Fresh";
    description = "Data ready";
    dotColor = "bg-green-500";
  } else {
    label = "Idle";
    description = "";
    dotColor = "bg-gray-400";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className="font-medium text-foreground">{label}</span>
          {description && (
            <span className="text-muted-foreground">- {description}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onRefresh}
            disabled={isFetching}
            size="sm"
            className="h-7 px-2.5 text-xs"
          >
            Refresh
          </Button>

          <Button
            onClick={onClearCache}
            disabled={isFetching}
            variant="destructive"
            size="sm"
            className="h-7 px-2.5 text-xs"
          >
            Clear Cache
          </Button>

          <Button
            onClick={() => setShowLegend(!showLegend)}
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Toggle status legend"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </Button>
        </div>
      </div>

      {showLegend && (
        <div className="text-xs space-y-1 pl-4 border-l-2 border-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Loading:</strong> First visit,
              no cache available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Updating:</strong> Showing
              cached data, revalidating in background
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Fresh:</strong> Data is ready
              and up-to-date
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Error:</strong> Failed to load
              data
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
