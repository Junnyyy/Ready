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
import { gridEvents, type EventSeverity } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

export function EventsTable() {
  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader>
        <CardTitle>Grid Events</CardTitle>
        <CardDescription>
          Recent power grid events and incidents — July through September 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
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
            {gridEvents.map((event) => {
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
                    <div className="text-muted-foreground">{formattedTime}</div>
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
      </CardContent>
    </Card>
  );
}
