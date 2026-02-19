"use client";
import React, { useState } from "react";
import {
  FaPiggyBank,
  FaVault,
  FaCoins,
  FaChartLine,
} from "react-icons/fa6";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { FaLongArrowAltRight } from "react-icons/fa";


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

const CompareAssetsTheme5 = () => {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);

  const funds = [
    {
      name: "Savings Account",
      rate: 3,
      type: "simple",
      icon: <FaPiggyBank className="text-[var(--rv-primary)] w-8 h-8" />,
    },
    {
      name: "Fixed Deposit",
      rate: 6,
      type: "compound",
      icon: <FaVault className="text-[var(--rv-black)] w-8 h-8" />,
    },
    {
      name: "Gold",
      rate: 9,
      type: "compound",
      icon: <FaCoins className="text-[var(--rv-secondary)] w-8 h-8" />,
    },
    {
      name: "Mutual Fund",
      rate: 14,
      type: "compound",
      icon: <FaChartLine className="text-[var(--rv-primary-dark)] w-8 h-8" />,
    },
  ];

  const calculateFundReturn = (monthly, years, rate, type) =>
    type === "simple"
      ? calculateSavingReturn(monthly, rate / 100, years)
      : calculateCompoundInterest(monthly, years, rate);

  return (
    <section className="bg-[var(--rv-bg-white)] px-4">
      <div className="max-w-7xl mx-auto text-center flex flex-col gap-5 md:gap-8">
        <Heading
          title="Investment Comparison"
          heading="See How Different Assets Perform"
          description="Compare how your monthly investments can grow in different asset classes — from savings to mutual funds."
        />

        <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
          <div className="w-full md:w-1/3">
            <label className="font-medium text-[var(--rv-primary-dark)]">
              Monthly Investment:{" "}
              <span className="text-[var(--rv-primary)] font-bold">
                ?{monthly}
              </span>
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

          <div className="w-full md:w-1/3">
            <label className="font-medium text-[var(--rv-primary-dark)]">
              Duration (Years):{" "}
              <span className="text-[var(--rv-primary)] font-bold">
                {years} yrs
              </span>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-[var(--rv-primary)] rounded-xl overflow-hidden">
          {funds.map((fund, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-6  bg-[var(--rv-bg-primary-light)] transition-all ${index === 0 ? "" : "md:border-l border-t md:border-t-0 border-[var(--rv-primary)]"
                }`}
            >
              <div>
                <div className="p-4 rounded-full bg-[var(--rv-bg-white)] mb-3">
                  {fund.icon}
                </div>
              </div>
              <h6 className="font-semibold">{fund.name}</h6>
              <p className="text-[var(--rv-primary)] font-bold">
                ?{formatINR(calculateFundReturn(monthly, years, fund.rate, fund.type))}
              </p>
              <p className="">at {fund.rate}% annual return</p>
            </div>
          ))}
        </div>

        <div className="mx-auto">
          <Button
            link="/contact-us"
            text="Start Investing Smarter Today"
            Icon={FaLongArrowAltRight}
          />
        </div>
      </div>
    </section>
  );
};

export default CompareAssetsTheme5;

