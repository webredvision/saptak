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
  principal: {
    label: "Principal Amount",
    color: "var(--rv-primary)",
  },
  interest: {
    label: "Interest Amount",
    color: "var(--rv-secondary-dark)",
  },
};

export function EmipieChart({ piedata, title }) {
  const chartData = [
    {
      name: "Principal Amount",
      value: piedata?.principalamount || 0,
      fill: "var(--rv-primary)",
    },
    {
      name: "Interest Amount",
      value: piedata?.intrestamount || 0,
      fill: "var(--rv-gray)",
    },
  ];

  return (
    <Card className="flex flex-col border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] text-[var(--rv-text)] shadow-md">
      <CardHeader className="items-center pb-0 text-[var(--rv-text)]">
        <CardTitle>{title || "EMI Breakdown"}</CardTitle>
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
