"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { FaArrowRight } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";

export default function NewsTheme4({ newsData }) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ipo");

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const categories = Object.keys(newsData || {});
    const activeData = newsData?.[activeTab] || [];

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.2 } },
    };

    return (
        <section className="px-4 bg-[var(--rv-bg-white)] text-[var(--rv-black)]">
            <div className="main-section border-b">
                <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
                    <Heading heading={"Latest News & Updates"} title={"News"} />

                    <div className="flex justify-center gap-3 flex-wrap p-1 rounded-full w-fit mx-auto bg-[var(--rv-bg-primary-light)] ">
                        {categories.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
                                    ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] shadow-md"
                                    : "bg-[var(--rv-bg-white)] text-[var(--rv-black)] "
                                    }`}
                            >
                                {tab === "ipo"
                                    ? "IPO News"
                                    : tab === "market"
                                        ? "Market News"
                                        : "Popular News"}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5"
                    >
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-[var(--rv-bg-gray-light)] animate-pulse rounded-xl overflow-hidden flex flex-col"
                                >
                                    <div className="w-full h-48 bg-[var(--rv-bg-gray)]"></div>
                                    <div className="p-5 flex flex-col gap-3">
                                        <div className="w-24 h-4 bg-[var(--rv-bg-gray)] rounded"></div>
                                        <div className="w-3/4 h-5 bg-[var(--rv-bg-gray)] rounded"></div>
                                        <div className="w-full h-4 bg-[var(--rv-bg-gray)] rounded"></div>
                                        <div className="w-1/2 h-4 bg-[var(--rv-bg-gray)] rounded"></div>
                                    </div>
                                </div>
                            )) : !Array.isArray(activeData) ? (
                                <p className="text-center text-[var(--rv-red-dark)] font-medium col-span-3">
                                    {newsData?.[activeTab]?.error || "No data available"}
                                </p>
                            ) : (
                                activeData?.slice(0, 3)?.map((news, i) => (
                                    <motion.div
                                        key={news._id || news.id || i}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-[var(--rv-bg-white)] border border-[var(--rv-border)] rounded-xl overflow-hidden"
                                    >
                                        <img
                                            src={news?.img || news?.image || "/no-image.jpg"}
                                            alt={news?.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="p-5 flex flex-col gap-3">
                                            <div className="flex items-center ">
                                                <BiCalendar className="w-4 h-4 mr-2" />
                                                {new Date(news?.pubDate).toDateString()}
                                            </div>
                                            <h6 className="font-semibold line-clamp-2 text-[var(--rv-primary)]">
                                                {news?.title}
                                            </h6>
                                            <p className="line-clamp-2">
                                                {news?.desc || news?.description}
                                            </p>
                                            <Link
                                                href={news?.link} target="_blank"
                                                className="inline-flex items-center font-semibold transition-colors group"
                                            >
                                                Read More
                                                <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                    </motion.div>

                    {!loading && (
                        <div className="mx-auto">
                            <Button
                                link={"/news"}
                                text={"All News"}
                                className="border border-[var(--rv-bg-primary)]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
