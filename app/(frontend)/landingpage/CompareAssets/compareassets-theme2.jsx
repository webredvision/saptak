"use client";

import React, { useState } from "react";
import { FiTrendingUp, FiShield, FiLayers, FiPieChart } from "react-icons/fi";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";
import { FaChartLine, FaCoins, FaPiggyBank } from "react-icons/fa";
import { FaVault } from "react-icons/fa6";

const assets = [
  {
    name: "Saving Account",
    icon: FiShield,
    stats: {
      Risk: "Low",
      Returns: "Very Low",
      Liquidity: "High",
      "Tax Benefits": "No",
      "Best For": "Daily spends",
    },
  },
  {
    name: "Fixed Deposits",
    icon: FiLayers,
    stats: {
      Risk: "Low",
      Returns: "Low",
      Liquidity: "Medium",
      "Tax Benefits": "Limited",
      "Best For": "Short-term saving",
    },
  },
  {
    name: "Gold",
    icon: FiTrendingUp,
    stats: {
      Risk: "Medium",
      Returns: "Medium",
      Liquidity: "Medium",
      "Tax Benefits": "No",
      "Best For": "Emergency wealth",
    },
  },
  {
    name: "Mutual Fund",
    icon: FiPieChart,
    stats: {
      Risk: "Varies",
      Returns: "High",
      Liquidity: "Medium",
      "Tax Benefits": "Yes (ELSS)",
      "Best For": "Long-term wealth building",
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};
const calculateCompoundInterest = (monthly, years, rate) => {
  if (!monthly || !rate || !years) return 0;
  const r = rate / 100 / 12;
  const n = years * 12;
  return Math.round(monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
};

const calculateSavingReturn = (monthly, rate, years) => {
  if (!monthly || !rate || !years) return 0;
  const months = years * 12;
  let totalInterest = 0;
  for (let i = 0; i < months; i++) {
    totalInterest += monthly * rate * ((months - i) / 12);
  }
  return monthly * months + totalInterest;
};

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);


const CompareAssetsTheme2 = () => {

  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);

  const funds = [
    {
      name: "Savings Account",
      rate: 3,
      type: "simple",
      icon: <FaPiggyBank />,
    },
    {
      name: "Fixed Deposit",
      rate: 6,
      type: "compound",
      icon: <FaVault />,
    },
    {
      name: "Gold",
      rate: 9,
      type: "compound",
      icon: <FaCoins />,
    },
    {
      name: "Mutual Fund",
      rate: 14,
      type: "compound",
      icon: <FaChartLine />,
    },
  ];

  const calculateFundReturn = (monthly, years, rate, type) =>
    type === "simple"
      ? calculateSavingReturn(monthly, rate / 100, years)
      : calculateCompoundInterest(monthly, years, rate);


  return (
    <section className="bg-[var(--rv-bg-black)] p-2 md:p-4 text-[var(--rv-white)] overflow-hidden">
      <div className="bg-[var(--rv-bg-secondary)] px-4 rounded-xl">
        <div className="max-w-7xl mx-auto main-section grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">

          <div className="flex flex-col gap-5 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Heading
                align="start"
                heading="Where Should You Invest?"
                highlight={'Invest'}
                description="Compare risk, returns, liquidity, and benefits across popular investment options."
              />
            </motion.div>
            <div className="w-full md:w-4/5">
              <label className="font-medium flex items-center justify-between">
                <p>Monthly Investment:{" "}</p>
                <p className="text-[var(--rv-primary)] font-bold">
                  ?{monthly}
                </p>
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full h-2 mt-2 accent-[var(--rv-primary)] cursor-pointer"
              />
            </div>
            <div className="w-full md:w-4/5">
              <label className="font-medium flex items-center justify-between">
                <p> Duration (Years):{" "}</p>
                <p className="text-[var(--rv-primary)] font-bold">
                  {years} yrs
                </p>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 mt-2 accent-[var(--rv-primary)] cursor-pointer"
              />
            </div>
            <div>
              <Button
                link={'/login'}
                className={'w-fit'}
                text="Start With Smart Investments"
                link="/login"
              />
            </div>
          </div>

          <motion.div
            className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {funds.map((asset, index) => (
              <div
                key={index}
                className=""
              >
                <div className="relative bg-[var(--rv-bg-black)] rounded">
                  <div className="absolute p-2 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[var(--rv-bg-secondary)] rounded-full" >
                    <div className="w-full h-full rounded-full bg-[var(--rv-bg-primary)] flex items-center justify-center">
                      <div className="text-3xl text-[var(--rv-black)]" >{asset.icon}</div>
                    </div>
                  </div>
                  <div className="p-4 pt-12 flex flex-col gap-2 text-center">
                    <h6 className="font-bold text-[var(--rv-white)] text-center">
                      {asset.name}
                    </h6>
                    <h6 className="text-[var(--rv-primary)] font-bold">
                      ?{formatINR(calculateFundReturn(monthly, years, asset.rate, asset.type))}
                    </h6>
                    <p className="">at {asset.rate}% annual return</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompareAssetsTheme2;

