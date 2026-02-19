"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  investedAmount: {
    label: "Invested Amount",
    color: "var(--rv-chart-invested, var(--rv-primary))",
  },
  growth: {
    label: "Growth",
    color: "var(--rv-chart-growth, var(--rv-primary-dark))",
  },
};

export function CalculatorReturnChart({ data, title }) {
  return (
    <Card className="border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] text-[var(--rv-text)] shadow-md rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle>{title} Projected Value</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={data} height={200}>
            <CartesianGrid vertical={false} stroke="var(--rv-border)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              minTickGap={30}
              tick={{
                fill: "var(--rv-text)",
                stroke: "var(--rv-text)",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
            <YAxis
              tick={{
                fill: "var(--rv-text)",
                stroke: "var(--rv-text)",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="investedAmount"
              stackId="a"
              fill="var(--rv-chart-invested, var(--rv-primary))"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="growth"
              stackId="a"
              fill="var(--rv-chart-growth, var(--rv-primary-dark))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
