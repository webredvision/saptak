"use client";

import { Pie, PieChart } from "recharts";

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

export const description = "A pie chart with a legend";

const chartConfig = {
  invested: {
    label: "Invested",
    color: "var(--rv-chart-invested, var(--rv-primary))",
  },
  return: {
    label: "Return",
    color: "var(--rv-chart-return, var(--rv-primary-dark))",
  },
};

export function SippieChart({
  piedata,
  title,
  customLabels,
  className,
  containerClassName,
  showLabels = false,
}) {
  const chartData = [
    {
      browser: "invested",
      visitors: piedata?.totalInvestment,
      fill: "var(--rv-chart-invested, var(--rv-primary))",
    },
    {
      browser: "return",
      visitors: piedata?.futureValue,
      fill: "var(--rv-chart-return, var(--rv-primary-dark))",
    },
  ];

  const labels = customLabels || {
    invested: chartConfig.invested.label,
    return: chartConfig.return.label,
  };

  const formatValue = (value) => {
    const num = Number(value);
    if (Number.isFinite(num)) return num.toLocaleString("en-IN");
    return value ?? "";
  };

  return (
    <Card
      className={`border border-[var(--rv-primary)]  flex bg-[var(--rv-bg-surface)] flex-col  rounded-3xl overflow-hidden ${className || ""}`}
    >
      <CardHeader className="items-center pb-0 text-[var(--rv-text)]">
        <CardTitle>{title || "Data"} - Pie Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className={`mx-auto w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground ${containerClassName || ""}`}
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              innerRadius={55}
              outerRadius={100}
              paddingAngle={3}
              labelLine={false}
              label={
                showLabels
                  ? ({ payload, ...props }) => (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="var(--rv-text)"
                      fontSize={11}
                    >
                      {`${labels[payload.browser]} (${formatValue(payload.visitors)})`}
                    </text>
                  )
                  : undefined
              }
              nameKey="browser"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
