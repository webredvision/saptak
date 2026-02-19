"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { FaArrowRight } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";

export default function NewsTheme2({ newsData }) {
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
        <div className="px-4 bg-[var(--rv-bg-black)]">
            <section className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-8">
                <div className="flex items-center justify-between flex-wrap gap-5 w-full">
                    <Heading align="start" heading={"Latest News & Updates"} highlight={'Latest'} title={"News"} />
                    {!loading && (
                        <div className="">
                            <Button
                                link={"/news"}
                                text={"View All News"}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-5 w-full">

                    <div className="max-w-4xl mx-auto w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full py-2 rounded-full font-medium transition-all duration-300 ${activeTab === tab
                                    ? "bg-[var(--rv-bg-primary)] text-[var(--rv-black)] shadow-md"
                                    : "bg-[var(--rv-bg-white)] text-[var(--rv-text-primary)] hover:bg-[var(--rv-bg-primary)] hover:text-[var(--rv-black)]"
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
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 "
                    >
                        {!loading && Array.isArray(activeData) && activeData.length > 0 && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="lg:col-span-2 bg-[var(--rv-bg-secondary)] p-3 text-[var(--rv-white)] rounded-xl overflow-hidden flex flex-col gap-2"
                                >
                                    <div className="w-full h-56 rounded-xl overflow-hidden">
                                        <img
                                            src={activeData[0]?.img || activeData[0]?.image || "/no-image.jpg"}
                                            alt={activeData[0]?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-2 flex flex-col gap-2 md:gap-4">
                                        <div className="flex items-center text-sm opacity-80">
                                            <BiCalendar className="w-4 h-4 mr-2" />
                                            {new Date(activeData[0]?.pubDate).toDateString()}
                                        </div>

                                        <h6 className="font-light md:line-clamp-2 line-clamp-1">
                                            {activeData[0]?.title}
                                        </h6>

                                        <p className="md:line-clamp-5 line-clamp-1 font-extralight">
                                            {activeData[0]?.desc || activeData[0]?.description}
                                        </p>

                                        <Link
                                            href={activeData[0]?.link}
                                            target="_blank"
                                            className="inline-flex items-center font-semibold text-[var(--rv-primary)] group"
                                        >
                                            Read More
                                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>

                                <div className="flex flex-col gap-5 lg:col-span-2">
                                    {activeData.slice(1, 4).map((news, i) => (
                                        <motion.div
                                            key={news._id || news.id || i}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="bg-[var(--rv-bg-secondary)] p-3 text-[var(--rv-white)] rounded-xl overflow-hidden flex flex-col md:flex-row items-center gap-3"
                                        >
                                            <div className="md:w-1/3 w-full h-56 md:h-36 rounded-xl overflow-hidden">
                                                <img
                                                    src={news?.img || news?.image || "/no-image.jpg"}
                                                    alt={news?.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="md:w-2/3 flex flex-col gap-2 p-2">
                                                <div className="flex items-center opacity-80">
                                                    <BiCalendar className="w-4 h-4 mr-2" />
                                                    {new Date(news?.pubDate).toDateString()}
                                                </div>

                                                <h6 className="font-light line-clamp-1">
                                                    {news?.title}
                                                </h6>
                                                <p className="line-clamp-1 font-extralight">
                                                    {activeData[0]?.desc || activeData[0]?.description}
                                                </p>
                                                <Link
                                                    href={news?.link}
                                                    target="_blank"
                                                    className="inline-flex items-center text-sm font-semibold text-[var(--rv-primary)] group"
                                                >
                                                    Read More
                                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
