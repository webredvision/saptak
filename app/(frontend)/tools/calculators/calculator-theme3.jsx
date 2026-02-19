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

const CalculatorTheme3 = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  const data =
    activeTab === "calculator"
      ? calculator
      : activeTab === "planning"
        ? planning
        : performance;

  return (
    <div className="bg-[var(--rv-bg-surface)]">
      <InnerPage title="Financial Calculators" />

      <div className="px-">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-10">

          <Heading
            title="Smart Financial Tools"
            heading="Plan your wealth with confidence"
            highlight="confidence"
            description="Explore intelligent tools that simplify complex financial decisions and help you grow smarter."
          />

          <div className="flex gap-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-1 font-semibold transition-all duration-300
                ${activeTab === tab.key
                    ? "text-[var(--rv-primary)]"
                    : "text-[var(--rv-text)] hover:text-[var(--rv-primary)]"
                  }`}
              >
                {tab.label}

                {activeTab === tab.key && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-[var(--rv-primary)]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {data.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link href={item.route || item.link}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="h-full rounded-2xl p-6 border transition-all cursor-pointer flex flex-col gap-3"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[var(--rv-primary)]
                        flex items-center justify-center shadow-lg">
                        <FaCalculator className="text-[var(--rv-white)] text-2xl" />
                      </div>
                      <h6 className="font-medium text-[var(--rv-primary)]">
                        {item.title}
                      </h6>

                      <p className="leading-relaxed text-[var(--rv-text)] flex-grow">
                        {item.desc}
                      </p>

                      <span className="mt-2 font-semibold text-[var(--rv-primary)]">
                        Try Calculator  
                      </span>
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

export default CalculatorTheme3;



