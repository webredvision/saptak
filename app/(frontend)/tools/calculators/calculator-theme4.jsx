"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  calculator,
  performance,
  planning,
} from "@/data/calculators";
import { FaCalculator, FaChartLine, FaRegLightbulb } from "react-icons/fa";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const tabs = [
  { key: "calculator", label: "Calculators", icon: <FaCalculator size={20} /> },
  {
    key: "planning",
    label: "Planning Tools",
    icon: <FaRegLightbulb size={20} />,
  },
  { key: "performance", label: "Performance", icon: <FaChartLine size={20} /> },
];

const CalculatorTheme4 = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  const data =
    activeTab === "calculator"
      ? calculator
      : activeTab === "planning"
        ? planning
        : performance;

  return (
    <div>
      <InnerPage title={"Financial Calculators"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <aside className="max-w-4xl w-full mx-auto">
            <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {tabs.map((t) => {
                const isActive = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg border border-[var(--rv-primary)] font-medium transition
                            ${
                              isActive
                                ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] shadow"
                                : "text-[var(--rv-primary)] bg-[var(--rv-bg-surface)]"
                            }
                          `}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`p-2 rounded-full ${
                        isActive
                          ? "bg-[var(--rv-bg-white-light)]"
                          : "bg-[var(--rv-bg-primary)] text-[var(--rv-white)]"
                      }`}
                    >
                      {t.icon}
                    </span>
                    <div>
                      <b className="text-lg">{t.label}</b>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h6 className="font-bold text-[var(--rv-primary)]">
                  {tabs.find((t) => t.key === activeTab)?.label}
                </h6>
                <p className="mt-1">
                  Select a tool to run numbers & plan confidently.
                </p>
              </div>
              <div className="hidden sm:flex gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg shadow-md">
                  <FaCalculator /> {data.length} tools
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-[var(--rv-white)]"
            >
              {data.map((item) => (
                <Link
                  key={item.title}
                  href={item.route || item.link || "#"}
                  className="group"
                >
                  <motion.article
                    whileHover={{ scale: 1.02, y: -6 }}
                    className="relative z-10   overflow-hidden rounded-xl bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] border border-[var(--rv-primary)] p-5 h-full flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div
                            style={{
                              backgroundImage: "var(--rv-bg-gradient)",
                            }}
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-[var(--rv-white)]"
                          >
                            <span>
                              {tabs.find((t) => t.key === activeTab)?.icon}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-semibold md:text-lg">
                            {item.title}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <p className="flex-grow">{item.desc}</p>
                  </motion.article>
                </Link>
              ))}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalculatorTheme4;

