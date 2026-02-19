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

export const description = "An area chart with gradient fill for scheme and Sensex data";

const chartConfig = {
    amount: {
        label: "Scheme Amount",
        color: "var(--rv-primary-dark)",
    },
    sensexAmount: {
        label: "Sensex Amount",
        color: "var(--rv-secondary-light)",
    },
};

const filterDataByRange = (sipData, sensexData) => {
    if (!sipData || !Array.isArray(sipData)) return [];
    const filteredData = sipData.map((item, index) => {
        const dataPoint = {
            date: item.date || new Date().toISOString(),
            amount: item.currentValue || 0,
        };
        if (sensexData && Array.isArray(sensexData) && sensexData[index]) {
            dataPoint.sensexAmount = sensexData[index].currentValue || 0;
        }
        return dataPoint;
    });
    return filteredData;
};

export function SchemePerformanceChart({ data, startDate, endDate, title }) {
    const [chartData, setChartData] = React.useState([]);
    const [valuation, setValuation] = React.useState({});

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

    React.useEffect(() => {
        if (data && data.graphData) {
            const filteredData = filterDataByRange(data.graphData, data.sensexGraphData);
            setChartData(filteredData);
            setValuation(data);
        }
    }, [data]);

    const hasValidData = chartData.length > 0 && chartData.some((item) => item.amount > 0);

    if (!hasValidData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-[var(--rv-bg-white)] text-[var(--rv-black)] shadow-md border-[var(--rv-primary)]">
            <CardHeader>
                <CardTitle className="text-[var(--rv-primary)]">{title}</CardTitle>
                <CardDescription className="text-[var(--rv-text-muted)]">
                    {startDate} to {endDate} (Current Value As on {endDate})
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-60 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 10, right: 12, left: 12, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="date"
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
                        {/* <YAxis
                            domain={[getMinValue(), getMaxValue()]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={2}
                            tick={{ fill: "#D1D5DB" }}
                            tickFormatter={(value) => Math.round(value).toLocaleString()}
                        /> */}
                        <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-[var(--rv-bg-surface)] text-[var(--rv-text)] border-[var(--rv-border)]" />} />
                        <defs>
                            <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--rv-primary-dark)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--rv-primary-dark)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillSensexAmount" x1="0" y1="0" x2="0" y2="1">
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
                            fillOpacity={1}
                            stroke="var(--rv-primary-dark)"
                            stackId="a"
                        />
                        <Area
                            dataKey="sensexAmount"
                            type="natural"
                            fill="url(#fillSensexAmount)"
                            fillOpacity={1}
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
                            Trending up by {valuation?.absoluteReturns || 0}%<TrendingUp className="h-4 w-4" />
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
