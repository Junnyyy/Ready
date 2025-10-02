"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { PowerDataPoint } from "@/lib/constants";

interface PowerUsageChartProps {
  data: PowerDataPoint[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const description = "Power usage: predicted vs actual";

const chartConfig = {
  predicted: {
    label: "Predicted",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Actual",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function PowerUsageChart({ data, isLoading, isError }: PowerUsageChartProps) {
  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader>
        <CardTitle>Power Grid</CardTitle>
        <CardDescription>
          Predicted vs actual power consumption (GW) — July through September
          2024
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {isLoading && (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-muted-foreground">
              Loading power usage data…
            </div>
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-destructive">
              Failed to load power usage data
            </div>
          </div>
        )}
        {data && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart accessibilityLayer data={data}>
              <defs>
                <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-predicted)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-predicted)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-actual)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-actual)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={80}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                    formatter={(value) => `${value} GW`}
                  />
                }
              />
              <Area
                dataKey="predicted"
                type="natural"
                fill="url(#fillPredicted)"
                stroke="var(--color-predicted)"
                stackId="a"
              />
              <Area
                dataKey="actual"
                type="natural"
                fill="url(#fillActual)"
                stroke="var(--color-actual)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
