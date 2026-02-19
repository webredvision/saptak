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
import { Button } from "@/app/components/ui/button";
import { FaFilePdf } from "react-icons/fa6";

export const description = "An area chart with gradient fill";

const chartConfig = {
    amount: {
        label: "Remaining Invested Amount",
        color: "var(--rv-primary-dark)",
    },
    currentvalue: {
        label: "Remaining Fund Value",
        color: "var(--rv-secondary-light-light)",
    },
};

// Function to filter data based on the given range
const filterDataByRange = (sipData) => {
    // Check if sipData is valid
    if (!sipData || !Array.isArray(sipData)) return [];


    return sipData.map((item) => ({
        date: item.navDate || new Date().toISOString(), // Use current date if navDate is not defined
        amount: item.netAmount || 0, // Default to 0 if amount is undefined
        currentvalue: item.currentValue || 0, // Default to 0 if currentValue is undefined
    }));
};

export function StpPerformanceChart({ piedata, startDate, endDate, title, withdrawal }) {
    const [chartData, setChartData] = React.useState([]);

    // Effect to update chart data whenever piedata changes
    React.useEffect(() => {
        setChartData(filterDataByRange(piedata?.withdrawlingScheme?.resData));
    }, [piedata]);

    return (
        <Card className="bg-[var(--rv-bg-white)] text-[var(--rv-black)] shadow-md border-[var(--rv-primary)]">
            <CardHeader>
                <CardTitle className="text-[var(--rv-primary)]">{title}</CardTitle>
                <CardDescription className="text-[var(--rv-text-muted)]">
                    {startDate} to {endDate} (Current Value As on {endDate})
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-56 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="date" // Use the correct key for date
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: "var(--rv-text)" }}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={7}
                            tick={{ fill: "var(--rv-text)" }}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-[var(--rv-bg-surface)] text-[var(--rv-text)] border-[var(--rv-border)]" />} />
                        <defs>
                            <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--rv-primary)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--rv-primary)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillCurrentvalue" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--rv-secondary-light)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--rv-secondary-light)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="amount"
                            type="natural"
                            fill="url(#fillAmount)"
                            fillOpacity={0.7}
                            stroke="var(--rv-primary)"
                            stackId="a"
                        />
                        <Area
                            dataKey="currentvalue"
                            type="natural"
                            fill="url(#fillCurrentvalue)"
                            fillOpacity={0.7}
                            stroke="var(--rv-secondary-light)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by {piedata?.xirrRate}%<TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-[var(--rv-text-muted)]">
                            {startDate} - {endDate}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
