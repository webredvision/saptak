"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function RetrementBarChart({
  years,
  Intrested,
  principalBarAmount,
  balance,
}) {
  // Transform data
  const data =
    years?.map((year, index) => ({
      year,
      Balance: balance[index],
      Expense: principalBarAmount[index],
    })) || [];

  return (
    <Card className="border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] text-[var(--rv-text)] shadow-md">
      <CardHeader>
        <CardTitle>Retirement Corpus Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--rv-border)"
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "var(--rv-text)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                tick={{ fill: "var(--rv-text)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `  ?${(value / 100000).toFixed(1)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--rv-bg-surface)",
                  border: "1px solid var(--rv-border)",
                  borderRadius: "8px",
                  color: "var(--rv-text)",
                }}
              />
              <Legend />
              <Bar
                dataKey="Expense"
                name="Annual Expense"
                fill="var(--rv-chart-invested, var(--rv-primary))"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Line
                type="monotone"
                dataKey="Balance"
                name="Corpus Balance"
                stroke="var(--rv-chart-growth, var(--rv-secondary))"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

