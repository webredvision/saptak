"use client";
import React, { useState, useEffect } from "react";
import CalculatorReturnChart from "./calculatorReturnChart";

export default function SIPCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [expectedRate, setExpectedRate] = useState(12);
    const [tenure, setTenure] = useState(10);
    const [result, setResult] = useState({
        investedAmount: 0,
        estimatedReturns: 0,
        totalValue: 0,
        chartData: [],
        chartLabels: [],
    });

    const calculateSIP = () => {
        const P = monthlyInvestment;
        const r = expectedRate / 12 / 100;
        const n = tenure * 12;

        const investedAmount = P * n;
        const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const estimatedReturns = totalValue - investedAmount;

        // Generate chart data
        const chartData = [];
        const chartLabels = [];
        for (let i = 1; i <= tenure; i++) {
            const months = i * 12;
            const value = P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
            chartData.push(Math.round(value));
            chartLabels.push(`Year ${i}`);
        }

        setResult({
            investedAmount: Math.round(investedAmount),
            estimatedReturns: Math.round(estimatedReturns),
            totalValue: Math.round(totalValue),
            chartData,
            chartLabels,
        });
    };

    useEffect(() => {
        calculateSIP();
    }, [monthlyInvestment, expectedRate, tenure]);

    return (
        <div className="w-full bg-[var(--rv-bg-surface)] border border-[var(--rv-border)] rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-[var(--rv-text)] font-medium">Monthly Investment</label>
                            <div className="text-[var(--rv-primary)] font-bold">&#8377; {monthlyInvestment.toLocaleString("en-IN")}</div>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            className="w-full h-2 bg-[var(--rv-bg-surface)] rounded-lg appearance-none cursor-pointer accent-[var(--rv-primary)]"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-[var(--rv-text)] font-medium">Expected Return Rate (p.a)</label>
                            <div className="text-[var(--rv-primary)] font-bold">{expectedRate} %</div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.5"
                            value={expectedRate}
                            onChange={(e) => setExpectedRate(Number(e.target.value))}
                            className="w-full h-2 bg-[var(--rv-bg-surface)] rounded-lg appearance-none cursor-pointer accent-[var(--rv-primary)]"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-[var(--rv-text)] font-medium">Time Period (Years)</label>
                            <div className="text-[var(--rv-primary)] font-bold">{tenure} Yr</div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-[var(--rv-bg-surface)] rounded-lg appearance-none cursor-pointer accent-[var(--rv-primary)]"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="bg-[var(--rv-bg-secondary-light)] rounded-2xl p-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-[var(--rv-white-light)]">
                            <span className="text-[var(--rv-text)] text-sm">Invested Amount</span>
                            <span className="text-[var(--rv-text)] font-semibold">&#8377; {result.investedAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-[var(--rv-white-light)]">
                            <span className="text-[var(--rv-text)] text-sm">Est. Returns</span>
                            <span className="text-[var(--rv-text)] font-semibold">&#8377; {result.estimatedReturns.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[var(--rv-text)] font-bold">Total Value</span>
                            <span className="text-[var(--rv-primary)] text-xl font-black">&#8377; {result.totalValue.toLocaleString("en-IN")}</span>
                        </div>
                    </div>

                    <div className="mt-8 h-40 rounded-xl border border-[var(--rv-border)] bg-[var(--rv-bg-surface)] p-2">
                        <CalculatorReturnChart
                            data={result.chartData}
                            labels={result.chartLabels}
                            title="SIP Growth"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

