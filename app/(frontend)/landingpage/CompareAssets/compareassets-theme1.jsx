"use client";

import React, { useState } from "react";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaCoins,
  FaLongArrowAltRight,
  FaPiggyBank,
} from "react-icons/fa";
import { FaVault } from "react-icons/fa6";

const calculateCompoundInterest = (monthly, years, rate) => {
  const r = rate / 100 / 12;
  const n = years * 12;
  return Math.round(monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
};

const calculateSavingReturn = (monthly, rate, years) => {
  const months = years * 12;
  let interest = 0;
  for (let i = 0; i < months; i++) {
    interest += monthly * rate * ((months - i) / 12);
  }
  return monthly * months + interest;
};

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const CompareAssetsTheme1 = () => {
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
    <section className="relative px-4 bg-[var(--rv-bg-white)]">
      <div className="max-w-7xl mx-auto flex flex-col gap-5 md:gap-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heading
            title="Recommended Funds"
            heading="Where Should You Invest?"
            description="Compare investment options and see how your money can grow over time."
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Monthly Investment",
              value: `?${monthly}`,
              min: 1000,
              max: 100000,
              step: 1000,
              state: monthly,
              setState: setMonthly,
            },
            {
              label: "Investment Duration",
              value: `${years} Years`,
              min: 1,
              max: 30,
              step: 1,
              state: years,
              setState: setYears,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[var(--rv-bg-white)] rounded-2xl p-6 shadow-sm border"
            >
              <div className="flex justify-between font-semibold text-[var(--rv-primary)] mb-2">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <input
                type="range"
                min={item.min}
                max={item.max}
                step={item.step}
                value={item.state}
                onChange={(e) => item.setState(Number(e.target.value))}
                className="w-full accent-[var(--rv-primary)] cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {funds.map((asset, index) => (
            <motion.div
              key={index}
              transition={{ duration: 0.3 }}
              className="relative bg-[var(--rv-bg-white)] rounded-xl border overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-3">
                <div className="bg-[var(--rv-primary)] text-[var(--rv-white)] w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  {asset.icon}
                </div>

                <h6 className="font-bold text-[var(--rv-primary)]">
                  {asset.name}
                </h6>

                <h5 className="font-extrabold">
                  ?{formatINR(
                    calculateFundReturn(monthly, years, asset.rate, asset.type)
                  )}
                </h5>

                <p className="text-sm text-[var(--rv-gray)]">
                  Estimated at {asset.rate}% annual return
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        <div className="mx-auto">
          <Button
            link={'/login'}
            Icon={FaLongArrowAltRight}
            text="Start Investing Smartly"
            link="/login"
          />
        </div>
      </div>
    </section>
  );
};

export default CompareAssetsTheme1;

