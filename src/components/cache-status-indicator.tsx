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
  const isLoading = powerQuery.isLoading || eventsQuery.isLoading;

  let status: "error" | "updating" | "fresh" | "cached";
  let label: string;
  let dotColor: string;

  if (hasError) {
    status = "error";
    label = "Error";
    dotColor = "bg-gray-400";
  } else if (hasData && isFetching) {
    status = "updating";
    label = "Updating";
    dotColor = "bg-orange-500";
  } else if (hasData && !isFetching) {
    status = "fresh";
    label = "Fresh";
    dotColor = "bg-green-500";
  } else {
    status = "cached";
    label = "Loading";
    dotColor = "bg-red-500";
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span>{label}</span>
    </div>
  );
}
