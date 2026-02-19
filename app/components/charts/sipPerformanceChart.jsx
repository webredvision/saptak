"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
export const description = "An area chart with gradient fill";

const chartConfig = {
  amount: {
    label: "Amount Invested",
    color: "var(--rv-primary-dark)",
  },
  currentvalue: {
    label: "Current Value",
    color: "var(--rv-secondary-light)",
  },
};

// Function to filter data based on the given range
const filterDataByRange = (sipData) => {
  if (!sipData || !Array.isArray(sipData)) return [];
  return sipData.map((item) => ({
    date: item.navDate || new Date().toISOString(), // Use current date if navDate is not defined
    amount: item.amount || 0, // Default to 0 if amount is undefined
    currentvalue: item.currentValue || 0, // Default to 0 if currentValue is undefined
  }));
};

export function SipPerformanceChart({ piedata, startDate, endDate, title }) {
  const [chartData, setChartData] = React.useState([]);
  const [valuation, setValuation] = React.useState([]);

  const getMinValue = () => {
    const values = chartData
      .flatMap((item) => [item.amount, item.sensexAmount])
      .filter((v) => v !== undefined && !isNaN(v) && v !== null);
    return values.length > 0 ? Math.min(...values) * 0.95 : 0;
  };

  const getMaxValue = () => {
    const values = chartData
      .flatMap((item) => [item.amount, item.sensexAmount])
      .filter((v) => v !== undefined && !isNaN(v) && v !== null);
    return values.length > 0 ? Math.max(...values) * 1.05 : 100;
  };

  // Effect to update chart data whenever piedata changes
  React.useEffect(() => {
    setChartData(filterDataByRange(piedata?.sipData));
    setValuation(piedata?.valuation);
  }, [piedata]);

  return (
    <Card className="bg-[var(--rv-bg-white)] text-[var(--rv-black)] shadow-md border-[var(--rv-primary)]">
      <CardHeader>
        <CardTitle className="text-[var(--rv-primary)]">{title}</CardTitle>
        <CardDescription className="text-[var(--rv-text-muted)]">
          {startDate} to {endDate} (Current Value As on {endDate})
        </CardDescription>
      </CardHeader>
      <CardContent className="chartData">
        <ChartContainer config={chartConfig} className="h-60 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
            style={{ color: "var(--rv-black)" }} // <-- this won't affect SVG text fill
          >
            <CartesianGrid vertical={false} stroke="var(--rv-primary-light)" />{" "}
            {/* Optional grid line color */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--rv-text)" }} // black tick labels
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              }
            // If you want to add axis label, set fill here too
            // label={{ value: 'Date', position: 'insideBottom', fill: '#ffffff' }}
            />
            <YAxis
              domain={[getMinValue(), getMaxValue()]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={8}
              tick={{ fill: "var(--rv-text)" }} // black tick labels
            // label={{ value: 'Value', angle: -90, position: 'insideLeft', fill: '#ffffff' }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-[var(--rv-bg-surface)] text-[var(--rv-text)] border-[var(--rv-border)]" />} />
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amount)"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.6}
                />
              </linearGradient>
              <linearGradient id="fillCurrentvalue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-currentvalue)"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-currentvalue)"
                  stopOpacity={0.6}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              fillOpacity={0.7}
              stroke="var(--color-amount)"
              stackId="a"
            />
            <Area
              dataKey="currentvalue"
              type="natural"
              fill="url(#fillCurrentvalue)"
              fillOpacity={0.7}
              stroke="var(--color-currentvalue)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by {valuation?.absoluteReturns}%
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-[var(--rv-text-muted)]">
              {startDate} to {endDate}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
