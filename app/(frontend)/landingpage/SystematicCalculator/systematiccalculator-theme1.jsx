"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";

const getRangeBackground = (value, min, max) => {
  const percent = ((value - min) / (max - min)) * 100;
  return `linear-gradient(
    to right,
    var(--rv-primary) 0%,
    var(--rv-primary) ${percent}%,
    rgba(255,255,255,0.25) ${percent}%,
    rgba(255,255,255,0.25) 100%
  )`;
};

const SystematicCalculatorTheme1 = () => {
  const [mode, setMode] = useState("SIP");
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [timePeriod, setTimePeriod] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const [investedAmount, setInvestedAmount] = useState(0);
  const [estimatedReturn, setEstimatedReturn] = useState(0);
  const [finalValue, setFinalValue] = useState(0);

  const calculateSIP = () => {
    const n = timePeriod * 12;
    const r = expectedReturn / 12 / 100;
    const fv =
      investmentAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    const invested = investmentAmount * n;
    setInvestedAmount(invested);
    setEstimatedReturn(fv - invested);
    setFinalValue(fv);
  };

  const calculateLumpsum = () => {
    const fv =
      investmentAmount * Math.pow(1 + expectedReturn / 100, timePeriod);

    setInvestedAmount(investmentAmount);
    setEstimatedReturn(fv - investmentAmount);
    setFinalValue(fv);
  };

  useEffect(() => {
    mode === "SIP" ? calculateSIP() : calculateLumpsum();
  }, [investmentAmount, timePeriod, expectedReturn, mode]);
  const generateLineChartData = () => {
    let data = [];

    if (mode === "SIP") {
      const r = expectedReturn / 12 / 100;

      for (let year = 1; year <= timePeriod; year++) {
        const months = year * 12;
        const invested = investmentAmount * months;
        const value =
          investmentAmount *
          ((Math.pow(1 + r, months) - 1) / r) *
          (1 + r);

        data.push({
          year: `Year ${year}`,
          Invested: Math.round(invested),
          Value: Math.round(value),
        });
      }
    } else {
      for (let year = 1; year <= timePeriod; year++) {
        const value =
          investmentAmount *
          Math.pow(1 + expectedReturn / 100, year);

        data.push({
          year: `Year ${year}`,
          Invested: investmentAmount,
          Value: Math.round(value),
        });
      }
    }

    return data;
  };

  const statsCards = [
    {
      label: "Invested Amount",
      value: investedAmount.toLocaleString("en-IN"),
      prefix: "?",
    },
    {
      label: "Estimated Return",
      value: estimatedReturn.toLocaleString("en-IN"),
      prefix: "?",
    },
    {
      label: "Final Value",
      value: finalValue.toLocaleString("en-IN"),
      prefix: "?",
    },
  ];

  return (
    <motion.section
      className="w-full bg-[var(--rv-bg-secondary)] overflow-hidden text-[var(--rv-white)] px-4 z-10 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[url('/images/footer-vector.png')] before:bg-cover before:bg-center before:brightness-0 before:invert before:opacity-[0.05] before:-z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-6">
        <Heading
          variant="light"
          title="Calculator"
          heading="Calculator Tools"
          description="Want to Know How Much You Need to Invest?"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              label: "Monthly Investment (?)",
              value: investmentAmount,
              min: 1000,
              max: 100000,
              step: 1000,
              onChange: setInvestmentAmount,
            },
            {
              label: "Time Period (Years)",
              value: timePeriod,
              min: 1,
              max: 40,
              step: 1,
              onChange: setTimePeriod,
            },
            {
              label: "Expected Return (%)",
              value: expectedReturn,
              min: 1,
              max: 30,
              step: 0.5,
              onChange: setExpectedReturn,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[var(--rv-bg-white-light)] backdrop-blur-sm rounded-xl p-5"
            >
              <div className="flex justify-between mb-2">
                <label>{item.label}</label>
                <span>{item.value}</span>
              </div>

              <input
                type="range"
                min={item.min}
                max={item.max}
                step={item.step}
                value={item.value}
                onChange={(e) => item.onChange(Number(e.target.value))}
                className="w-full accent-white"
                style={{
                  background: getRangeBackground(
                    item.value,
                    item.min,
                    item.max
                  ),
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="grid gap-5">
            {statsCards.map((card) => (
              <div
                key={card.label}
                className="bg-[var(--rv-bg-white-light)] backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-5 text-center"
              >
                <strong>{card.label}</strong>
                <h6 className="mt-1">
                  {card.prefix}
                  {card.value}
                </h6>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 bg-[var(--rv-bg-white-light)] backdrop-blur-sm rounded-xl p-5">
            <ResponsiveContainer width="100%" height={380}>
              <LineChart
                data={generateLineChartData()}
                margin={{ top: 20, right: 30, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--rv-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--rv-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="rgba(255,255,255,0.15)" vertical={false} />

                <XAxis dataKey="year" stroke="#fff" />
                <YAxis
                  stroke="#fff"
                  tickFormatter={(v) => `?${(v / 100000).toFixed(1)}L`}
                />

                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.85)",
                    borderRadius: 10,
                    border: "none",
                    color: "#fff",
                  }}
                  formatter={(v) => `?${v.toLocaleString("en-IN")}`}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="Invested"
                  stroke="var(--rv-secondary)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="Value"
                  stroke="var(--rv-primary)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                  fill="url(#valueGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SystematicCalculatorTheme1;


