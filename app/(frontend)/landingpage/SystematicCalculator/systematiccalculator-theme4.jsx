"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";
const getRangeBackground = (value, min, max) => {
  const percent = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right,
    var(--rv-primary) 0%,
    var(--rv-primary) ${percent}%,
    #9f9f9f ${percent}%,
    #9f9f9f 100%)`;
};

const SystematicCalculatorTheme3 = () => {
  const [mode, setMode] = useState("SIP");
  const [investmentAmount, setInvestmentAmount] = useState(10000000);
  const [timePeriod, setTimePeriod] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const maxInvestment = mode === "SIP" ? 100000 : 10000000;

  const [investedAmount, setInvestedAmount] = useState(0);
  const [estimatedReturn, setEstimatedReturn] = useState(0);
  const [finalValue, setFinalValue] = useState(0);

  const calculateSIP = () => {
    const n = timePeriod * 12;
    const r = expectedReturn / 12 / 100;
    const fv = investmentAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = investmentAmount * n;
    const returns = fv - invested;
    setInvestedAmount(invested);
    setEstimatedReturn(returns);
    setFinalValue(fv);
  };

  const calculateLumpsum = () => {
    const fv = investmentAmount * Math.pow(1 + expectedReturn / 100, timePeriod);
    const returns = fv - investmentAmount;
    setInvestedAmount(investmentAmount);
    setEstimatedReturn(returns);
    setFinalValue(fv);
  };

  useEffect(() => {
    if (mode === "SIP") calculateSIP();
    else calculateLumpsum();
  }, [investmentAmount, timePeriod, expectedReturn, mode]);
  useEffect(() => {
    if (investmentAmount > maxInvestment) {
      setInvestmentAmount(maxInvestment);
    }
  }, [maxInvestment, investmentAmount]);

  const handleInvestmentChange = (value) => {
    if (value < 1000) value = 1000;
    if (value > maxInvestment) value = maxInvestment;
    setInvestmentAmount(Number(value));
  };

  const handleTimeChange = (value) => {
    if (value < 1) value = 1;
    if (value > 40) value = 40;
    setTimePeriod(Number(value));
  };

  const handleReturnChange = (value) => {
    if (value < 1) value = 1;
    if (value > 30) value = 30;
    setExpectedReturn(Number(value));
  };

  const COLORS = ["var(--rv-primary)", "var(--rv-secondary)"];

  const data = [
    { name: "Invested Amount", value: investedAmount },
    { name: "Estimated Return", value: estimatedReturn },
  ];

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
      className="w-full bg-[var(--rv-bg-white)] text-[var(--rv-black)] px-4 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="main-section border border-[var(--rv-border)]-b">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 md:gap-8">
          <Heading title="Calculator"
            heading="Calculator Tools"
            description="Want to Know How Much You Need to Invest?" />
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-5 w-full">
            <motion.div
              className="w-full flex flex-col gap-5 bg-[var(--rv-bg-white)] border border-[var(--rv-border)] rounded-xl p-5 "
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-center mx-auto border border-[var(--rv-border)] rounded-lg overflow-hidden w-fit">
                  {["SIP", "Lumpsum"].map((type, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setMode(type)}
                      whileTap={{ scale: 0.96 }}
                      className={`px-6 py-2 font-semibold transition-colors ${mode === type
                        ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] "
                        : "bg-[var(--rv-bg-white)] text-[var(--rv-primary-dark)]"
                        }`}
                    >
                      {type}
                    </motion.button>
                  ))}
                </div>
                <div className="flex flex-col gap-6 bg-[var(--rv-bg-white)]">
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-medium">
                      {mode === "SIP"
                        ? "Monthly Investment (?)"
                        : "Investment Amount (?)"}
                    </label>
                    <p>{investmentAmount}</p>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max={maxInvestment}
                    step="1000"
                    value={investmentAmount}
                    onChange={(e) => handleInvestmentChange(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--rv-primary)] "
                    style={{
                      background: getRangeBackground(
                        investmentAmount,
                        1000,
                        maxInvestment
                      ),
                    }}
                  />
                </div>

                <div className="flex flex-col gap-6 bg-[var(--rv-bg-white)]">
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-medium">
                      Time Period (Years)
                    </label>
                    <p>{timePeriod}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      step="1"
                      value={timePeriod}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--rv-primary)] "
                      style={{
                        background: getRangeBackground(timePeriod, 1, 40),
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6 bg-[var(--rv-bg-white)]">
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-medium">
                      Expected Return (%)
                    </label>
                    <p>{expectedReturn}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => handleReturnChange(e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--rv-primary)] "
                      style={{
                        background: getRangeBackground(
                          expectedReturn,
                          1,
                          30
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>


            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-full bg-[var(--rv-bg-white)] border border-[var(--rv-border)] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ResponsiveContainer width={400} height={310}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      innerRadius="60%"
                      outerRadius="80%"
                      paddingAngle={2}
                    >
                      {data.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `?${value.toLocaleString("en-IN")}`}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <motion.div
                  className=" text-center grid grid-cols-1 gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                >
                  {statsCards.map((card) => (
                    <motion.div
                      key={card.label}
                      className="flex flex-col gap-2 bg-[var(--rv-bg-white)]"
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <strong>{card.label}:</strong>
                      <p className='text-[var(--rv-primary)]'>
                        {card.prefix}
                        {card.value}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SystematicCalculatorTheme3;

