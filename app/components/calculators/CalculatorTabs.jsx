"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { calculator, performance, planning } from "@/app/data/calculators";

export default function CalculatorTabs() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("calculator");

    useEffect(() => {
        const tab = searchParams.get("tab") || "calculator";
        setActiveTab(tab);
    }, [searchParams]);

    const tabs = [
        { key: "calculator", label: "Calculators" },
        { key: "performance", label: "Performance" },
        { key: "planning", label: "Planning" },
    ];

    const getData = () => {
        switch (activeTab) {
            case "performance":
                return performance;
            case "planning":
                return planning;
            default:
                return calculator;
        }
    };

    const getRoundedClass = (index) => {
        if (index === 0) return "rounded-l-full";
        if (index === tabs.length - 1) return "rounded-r-full";
        return "";
    };

    return (
        <section>
            {/* Tabs */}
            <div className="flex justify-center mb-14">
                <div className="inline-flex border border-[var(--rv-white-light)] rounded-full shadow-inner bg-[var(--rv-bg-white-light)]">
                    {tabs.map((tab, index) => (
                        <Link
                            key={tab.key}
                            href={`/tools/calculators?tab=${tab.key}`}
                            className={`px-5 md:px-14 py-2 text-lg font-medium border border-[var(--rv-white-light)] hover:bg-[var(--rv-secondary)] hover:text-[var(--rv-black)] transition-all duration-300 ${getRoundedClass(index)} ${activeTab === tab.key
                                    ? "bg-[var(--rv-secondary)] text-[var(--rv-black)]"
                                    : "bg-[var(--rv-bg-white-light)] text-[var(--rv-white-dark)]"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Grid content */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
                {getData().map((item, index) => (
                    <Link href={item?.route || item?.link || "#"} key={index}>
                        <div className="bg-[#0a0a0a] border border-[var(--rv-white-light)] hover:border-[var(--rv-secondary)] transition-all duration-300 rounded-2xl p-6 shadow-md group flex flex-col items-center justify-center text-center h-52">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[var(--rv-secondary)] group-hover:bg-[var(--rv-bg-white)] transition-all duration-300">
                                <Image
                                    src={item?.image}
                                    alt={item?.title || ""}
                                    width={32}
                                    height={32}
                                    className="transition-all duration-300"
                                />
                            </div>
                            <p className="mt-4 font-semibold text-[var(--rv-secondary)] group-hover:text-[var(--rv-white)] group-hover:font-medium text-base">
                                {item?.title}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
