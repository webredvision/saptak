"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { calculator, performance, planning } from "@/data/calculators";
import { FaCalculator } from "react-icons/fa";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const tabs = [
    { key: "calculator", label: "Calculators" },
    { key: "planning", label: "Planning Tools" },
    { key: "performance", label: "Performance" },
];

const CalculatorTheme1 = () => {
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
                    <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2 rounded-full  sm:text-base font-medium transition-all duration-300 ${activeTab === tab.key
                                    ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] shadow-md scale-105"
                                    : "bg-[var(--rv-bg-primary-light)] text-[var(--rv-text)]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                                            whileHover={{ scale: 1.03 }}
                                            className="bg-[var(--rv-bg-primary-light)] rounded-xl p-5 border gap-3 transition-all cursor-pointer h-full flex flex-col"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <FaCalculator className="text-[var(--rv-primary)]" />
                                                </div>
                                                <h6 className="">
                                                    {item.title}
                                                </h6>
                                            </div>
                                            <p className="">
                                                {item.desc}
                                            </p>
                                            <motion.div
                                                className="text-[var(--rv-primary)] font-medium"
                                                whileHover={{ x: 5 }}
                                            >
                                                Explore  
                                            </motion.div>
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

export default CalculatorTheme1;



