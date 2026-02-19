"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, CartesianGrid, YAxis, XAxis, Line, Legend } from "recharts";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";
import { FaLongArrowAltRight } from "react-icons/fa";
const getRangeBackground = (value, min, max) => {
  const percent = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right,
    var(--rv-primary) 0%,
    var(--rv-primary) ${percent}%,
    #8f8f8f ${percent}%,
    #8f8f8f 100%)`;
};

const SystematicCalculatorTheme5 = () => {
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
      className="w-full bg-[var(--rv-secondary)] px-4 overflow-hidden"
      style={{ backgroundImage: "url('/images/vector.webp')" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            variant="light"
            title={'Calculator'}
            heading={"Calculator Tools"}
            description={"Want to Know How Much You Need to Invest?"}
          />
        </motion.div>

        <div className="flex flex-col gap-5 text-[var(--rv-white)]">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 w-full">
            <motion.div
              className="w-full bg-[var(--rv-bg-white-light)] rounded-xl p-6 md:p-8 shadow-sm flex flex-col gap-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <h5 className="font-semibold">SIP Calculator</h5>

              <div className="flex border border-[var(--rv-primary)] rounded-lg overflow-hidden w-fit">
                {["SIP", "Lumpsum"].map((type, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setMode(type)}
                    whileTap={{ scale: 0.96 }}
                    className={`px-6 py-2 font-semibold transition-colors ${mode === type
                      ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)]"
                      : "bg-[var(--rv-bg-secondary)] text-[var(--rv-white)]"
                      }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col gap-9">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 justify-between">
                    <label className="font-medium text-[var(--rv-white)]">
                      {mode === "SIP"
                        ? "Monthly Investment (?)"
                        : "Investment Amount (?)"}
                    </label>

                    <p>{investmentAmount}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1000"
                      max={maxInvestment}
                      step="1000"
                      value={investmentAmount}
                      onChange={(e) => handleInvestmentChange(e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--rv-primary)]"
                      style={{
                        background: getRangeBackground(
                          investmentAmount,
                          1000,
                          maxInvestment
                        ),
                      }}
                    />


                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 justify-between">
                    <label className="font-medium text-[var(--rv-white)]">
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
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--rv-primary)]"
                      style={{
                        background: getRangeBackground(timePeriod, 1, 40),
                      }}
                    />


                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 justify-between">
                    <label className="font-medium text-[var(--rv-white)]">
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
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--rv-primary)]"
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
              className="flex flex-col gap-5 md:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-full bg-[var(--rv-bg-white-light)] rounded-xl p-5 flex flex-col items-center justify-center shadow-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
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
                      stroke="var(--rv-white)"
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
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="text-[var(--rv-white)] text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {statsCards.map((card) => (
              <motion.div
                key={card.label}
                className="flex flex-col gap-2 bg-[var(--rv-bg-white-light)] rounded-xl p-5"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <strong>{card.label}:</strong>
                {card.prefix}
                {card.value}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Button
              text="Try a FREE Tool"
              Icon={FaLongArrowAltRight}
              variant={"light"}
              link="/login"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SystematicCalculatorTheme5;

