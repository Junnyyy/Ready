"use client";

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
}

export function CacheStatusIndicator({
  powerQuery,
  eventsQuery,
}: CacheStatusIndicatorProps) {
  const hasError = powerQuery.isError || eventsQuery.isError;
  const hasData = !!powerQuery.data && !!eventsQuery.data;
  const isFetching = powerQuery.isFetching || eventsQuery.isFetching;

  let label: string;
  let description: string;
  let dotColor: string;

  if (hasError) {
    label = "Error";
    description = "Failed to load data";
    dotColor = "bg-gray-400";
  } else if (hasData && isFetching) {
    label = "Updating";
    description = "Refreshing from server";
    dotColor = "bg-orange-500";
  } else if (hasData && !isFetching) {
    label = "Fresh";
    description = "Loaded from cache";
    dotColor = "bg-green-500";
  } else {
    label = "Loading";
    description = "Fetching from server";
    dotColor = "bg-red-500";
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">- {description}</span>
    </div>
  );
}
