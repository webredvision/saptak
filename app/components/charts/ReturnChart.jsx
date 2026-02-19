"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/app/components/ui/button";

const RANGE_PRESETS = [
  { key: "1W", label: "1W", getStart: () => new Date(Date.now() - 7 * 86400000) },
  { key: "1M", label: "1M", getStart: () => new Date(new Date().setMonth(new Date().getMonth() - 1)) },
  { key: "6M", label: "6M", getStart: () => new Date(new Date().setMonth(new Date().getMonth() - 6)) },
  { key: "1Y", label: "1Y", getStart: () => new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
  { key: "3Y", label: "3Y", getStart: () => new Date(new Date().setFullYear(new Date().getFullYear() - 3)) },
  { key: "5Y", label: "5Y", getStart: () => new Date(new Date().setFullYear(new Date().getFullYear() - 5)) },
  { key: "MAX", label: "Max", getStart: () => null },
];

export function ReturnChart({ data, className }) {
  const [activeRange, setActiveRange] = useState("1Y");
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const updateCompact = () => {
      setIsCompact(window.innerWidth < 640);
    };
    updateCompact();
    window.addEventListener("resize", updateCompact);
    return () => window.removeEventListener("resize", updateCompact);
  }, []);

  const chartData = useMemo(() => {
    if (!data || !data.labels || !data.datasets) return [];
    const range = RANGE_PRESETS.find((item) => item.key === activeRange);
    const startDate = range?.getStart?.() || null;

    return data.labels
      .map((label, index) => {
        const parsedDate = new Date(label);
        if (Number.isNaN(parsedDate.getTime())) return null;
        if (startDate && parsedDate < startDate) return null;
        const point = { date: label };
        data.datasets.forEach((dataset) => {
          point[dataset.label] = dataset.data[index];
        });
        return point;
      })
      .filter(Boolean);
  }, [data, activeRange]);

  const tickValues = useMemo(() => {
    if (!chartData.length) return [];
    const targetTicks = isCompact ? 4 : 6;
    const step = Math.ceil(chartData.length / targetTicks);
    return chartData
      .filter((_, index) => index % step === 0 || index === chartData.length - 1)
      .map((point) => point.date);
  }, [chartData, isCompact]);

  const minValue = useMemo(() => {
    if (!chartData.length) return 0;
    const values = chartData.flatMap((point) =>
      Object.keys(point)
        .filter((key) => key !== "date")
        .map((key) => Number(point[key]))
        .filter((value) => Number.isFinite(value)),
    );
    return values.length ? Math.min(...values) : 0;
  }, [chartData]);

  if (!data || !data.labels || !data.datasets)
    return <p className="text-center py-10">No chart data available.</p>;

  return (
    <div
      className={`rounded-2xl border border-[var(--rv-border)] bg-[var(--rv-bg-surface)] p-4 ${className || ""}`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[var(--rv-text)]">
          Performance Chart
        </h3>
        <p className="text-sm text-[var(--rv-text-muted)]">
          Showing NAV trends over time
        </p>
      </div>
      <div className={isCompact ? "h-60 w-full" : "h-72 w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: isCompact ? 36 : 24 }}
          >
            <defs>
              <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--rv-primary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--rv-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--rv-border)"
            />
            <XAxis
              dataKey="date"
              ticks={tickValues}
              interval={0}
              minTickGap={12}
              tick={{ fill: "var(--rv-text)", fontSize: isCompact ? 9 : 11 }}
              axisLine={false}
              tickLine={false}
              angle={isCompact ? -45 : -35}
              textAnchor="end"
              height={isCompact ? 48 : 36}
              tickFormatter={(value) => {
                try {
                  const date = new Date(value);
                  return isCompact
                    ? date.toLocaleDateString("en-US", { month: "short" })
                    : date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "2-digit",
                    });
                } catch (e) {
                  return value;
                }
              }}
            />
            <YAxis
              domain={[minValue, "auto"]}
              tick={{ fill: "var(--rv-text)", fontSize: isCompact ? 9 : 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `  ₹${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--rv-bg-surface)",
                border: "1px solid var(--rv-border)",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "var(--rv-text)", fontSize: "12px" }}
              labelStyle={{
                color: "var(--rv-text)",
                fontSize: "10px",
                marginBottom: "4px",
              }}
            />
            {data.datasets.map((dataset, idx) => (
              <Area
                key={idx}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.borderColor || "var(--rv-primary)"}
                fillOpacity={1}
                fill="url(#colorNav)"
                strokeWidth={2}
                animationDuration={1500}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {RANGE_PRESETS.map((range) => {
          const active = activeRange === range.key;
          return (
            <Button
              key={range.key}
              variant={active ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveRange(range.key)}
              className={
                active
                  ? "text-[var(--rv-white)]"
                  : "border-[var(--rv-border)] text-[var(--rv-text)]"
              }
            >
              {range.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

