"use client";
import React, { useState } from "react";
import { FaPiggyBank, FaVault, FaCoins, FaChartLine } from "react-icons/fa6";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { motion } from "framer-motion";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
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

const CompareAssetsTheme4 = () => {
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
    <section className="bg-[var(--rv-bg-white)] px-4 text-[var(--rv-black)]">
      <div className="main-section border-b">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-5 md:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Heading
              title="Investment Comparison"
              heading="See How Different Assets Perform"
              description="Compare how your monthly investments can grow in different asset classes — from savings to mutual funds."
            />
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row gap-5 justify-center items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="w-full border border-[var(--rv-border)]   p-5 rounded-xl shadow-md">
              <label className="font-medium ">
                Monthly Investment:
                <span className="text-[var(--rv-primary)] font-bold"> ?{monthly}</span>
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
            </motion.div>
            <motion.div variants={fadeUp} className="w-full border border-[var(--rv-border)]   p-5 rounded-xl shadow-md">
              <label className="font-medium ">
                Duration (Years):
                <span className="text-[var(--rv-primary)] font-bold"> {years} yrs</span>
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
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {funds.map((fund, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ scale: 1.02 }}
                className={`flex flex-col gap-2 items-center justify-center border border-[var(--rv-border)] overflow-hidden   shadow-lg rounded-xl
             `}
              >
                <div
                  className="w-full h-20 flex items-center justify-center text-4xl bg-[var(--rv-bg-primary)]"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-[var(--rv-bg-white)] rounded-full">
                    {fund.icon}
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <h6 className="font-semibold">{fund.name}</h6>
                  <h6 className="text-[var(--rv-primary)] font-bold">
                    ?{formatINR(
                      calculateFundReturn(monthly, years, fund.rate, fund.type)
                    )}
                  </h6>
                  <p className="">at {fund.rate}% annual return</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Button
                link="/contact-us"
                text="Start Investing Smarter Today"
                className="border border-[var(--rv-bg-primary)]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompareAssetsTheme4;

