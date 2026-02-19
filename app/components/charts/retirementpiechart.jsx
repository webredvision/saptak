"use client";

import { Pie, PieChart, Cell } from "recharts";
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

const chartConfig = {
  current: {
    label: "Current",
    color: "var(--rv-primary)",
  },
  future: {
    label: "Future",
    color: "var(--rv-secondary-dark)",
  },
};

export function RetirementChart({ piedata, title, customLabels }) {
  const chartData = [
    {
      name: "Current",
      value: piedata.CurrentMonthlyExpenses,
      fill: "var(--rv-primary)",
    },
    {
      name: "Future",
      value: piedata.FutureMonthlyExpenses,
      fill: "var(--rv-gray)",
    },
  ];

  return (
    <Card className="flex flex-col border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] text-[var(--rv-text)] shadow-md">
      <CardHeader className="items-center pb-0 text-[var(--rv-text)]">
        <CardTitle>{title || "Monthly Expenses Breakup"}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
