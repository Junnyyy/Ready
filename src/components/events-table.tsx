"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { GridEvent, EventSeverity } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EventsTableProps {
  data: GridEvent[] | undefined;
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const severityColors: Record<EventSeverity, string> = {
  low: "text-blue-600 dark:text-blue-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  high: "text-orange-600 dark:text-orange-400",
  critical: "text-red-600 dark:text-red-400",
};

const severityBgColors: Record<EventSeverity, string> = {
  low: "bg-blue-50 dark:bg-blue-950/30",
  medium: "bg-yellow-50 dark:bg-yellow-950/30",
  high: "bg-orange-50 dark:bg-orange-950/30",
  critical: "bg-red-50 dark:bg-red-950/30",
};

export function EventsTable({
  data,
  isLoading,
  isError,
  currentPage,
  totalPages,
  onPageChange,
}: EventsTableProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5; // Max page numbers to show at once

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader>
        <CardTitle>Grid Events</CardTitle>
        <CardDescription>
          Recent power grid events and incidents — July through September 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center py-12">
            <div className="text-destructive">Failed to load grid events</div>
          </div>
        )}
        {data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[140px]">Type</TableHead>
                <TableHead className="w-[100px]">Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px]">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((event) => {
                const date = new Date(event.timestamp);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const formattedTime = date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">
                      <div>{formattedDate}</div>
                      <div className="text-muted-foreground">
                        {formattedTime}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{event.type}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                          severityBgColors[event.severity],
                          severityColors[event.severity]
                        )}
                      >
                        {event.severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>{event.description}</div>
                      {event.location && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.location}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold">
                      {event.impact}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {data && totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) onPageChange(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                    className={cn(
                      currentPage === 1 &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <span className="flex size-9 items-center justify-center">
                        …
                      </span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        onPageChange(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={cn(
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
