"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartData } from "@/services/statisticsService";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  create: {
    label: "创建量",
    color: "var(--primary)",
  },
  detection: {
    label: "检测量",
    color: "var(--primary)",
  },
  complete: {
    label: "完成量",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function DataChart({ chartData }: { chartData: chartData[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-create)"
              stopOpacity={1.0}
            />
            <stop
              offset="95%"
              stopColor="var(--color-create)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-complete)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-complete)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />
        <ChartTooltip
          cursor={false}
          defaultIndex={10}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="create"
          type="natural"
          fill="url(#fillMobile)"
          stroke="var(--color-create)"
          stackId="a"
        />
        <Area
          dataKey="complete"
          type="natural"
          fill="url(#fillDesktop)"
          stroke="var(--color-complete)"
          stackId="b"
        />
      </AreaChart>
    </ChartContainer>
  );
}
