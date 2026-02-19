"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { calculator, performance, planning } from "@/data/calculators";
import { FaCalculator } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const tabs = [
  { key: "calculator", label: "Calculators" },
  { key: "planning", label: "Planning Tools" },
  { key: "performance", label: "Performance" },
];

const CalculatorTheme5 = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  const data =
    activeTab === "calculator"
      ? calculator
      : activeTab === "planning"
        ? planning
        : performance;

  return (
    <div className="bg-[var(--rv-bg-surface)]">
      <InnerPage title={"Financial Calculators"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <Heading title={'Smart Financial Tools'} heading={'Plan your wealth with confidence'} description={'Explore our intelligent tools designed to simplify your financial decisions, helping you achieve your goals with clarity and precision.'} />

          <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full sm:text-base font-medium transition-all duration-300 ${activeTab === tab.key
                    ? "bg-[var(--rv-primary)] text-[var(--rv-white)] shadow-lg scale-110"
                    : "bg-[var(--rv-primary-light)]  hover:bg-[var(--rv-bg-secondary-light)]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {data.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link href={item.route || item.link}>
                    <motion.div
                      className="rounded-xl p-5 border backdrop-blur-md transition-all cursor-pointer h-full flex flex-col gap-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[var(--rv-primary)] flex items-center justify-center shadow-md">
                        <FaCalculator className="text-[var(--rv-white)] text-3xl" />
                      </div>

                      <h6 className="font-semibold text-[var(--rv-secondary)]">
                        {item.title}
                      </h6>

                      <p className="flex-grow leading-relaxed">
                        {item.desc}
                      </p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorTheme5;



