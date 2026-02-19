"use client";
import React, { useState } from "react";
import Link from "next/link";
import { calculator, performance, planning } from "@/data/calculators";
import { FaCalculator, FaChartLine, FaRegLightbulb } from "react-icons/fa";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const tabs = [
  { key: "calculator", label: "Calculators", icon: <FaCalculator size={24}/> },
  { key: "planning", label: "Planning Tools", icon: <FaRegLightbulb size={24}/> },
  { key: "performance", label: "Performance", icon: <FaChartLine size={24}/> },
];

const CalculatorTheme2 = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  const data =
    activeTab === "calculator"
      ? calculator
      : activeTab === "planning"
        ? planning
        : performance;

  return (
    <div>
      <InnerPage title="Financial Calculators" />
      <section className="relative bg-[var(--rv-bg-secondary)] px-4  text-[var(--rv-white)] overflow-hidden">
        <div className="relative max-w-7xl mx-auto main-section flex flex-col gap-10">
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
                  ${isActive
                      ? "bg-[var(--rv-bg-primary)] text-[var(--rv-text)] shadow-lg"
                      : "bg-[var(--rv-bg-black)]"
                    }`}
                >
                  <span className="">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, i) => (
              <Link key={item.title} href={item.route || item.link}>
                <div
                  className={`group relative rounded-2xl p-6 border border-[var(--rv-primary)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-xl`}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-2xl
                      } blur-2xl`}
                  />

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--rv-bg-primary)] text-[var(--rv-text)]
                          }`}
                      >
                        {tabs.find((t) => t.key === activeTab)?.icon}
                      </div>

                      <h6 className="font-semibold">{item.title}</h6>
                    </div>

                    <p className="leading-relaxed">
                      {item.desc}
                    </p>

                    <span className="inline-flex items-center gap-1 font-medium text-[var(--rv-primary)] group-hover:gap-2 transition-all">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

};

export default CalculatorTheme2;



