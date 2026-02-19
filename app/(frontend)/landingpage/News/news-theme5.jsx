"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { FaArrowRight } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";

export default function NewsTheme5({ newsData }) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ipo");

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const categories = Object.keys(newsData || {});

    const activeData = Array.isArray(newsData?.[activeTab])
        ? newsData[activeTab]
        : [];

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.2 } },
    };

    return (
        <div className="px-4 bg-[var(--rv-bg-white)]">
            <section className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-8">
                <Heading heading={"Latest News & Updates"} highlight={'Latest'} title={"News"} />

                <div className="flex justify-center gap-3 flex-wrap">
                    {categories?.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${activeTab === tab
                                ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] shadow-md"
                                : "bg-[var(--rv-bg-white)] text-[var(--rv-text-primary)] hover:bg-[var(--rv-bg-primary)] hover:text-[var(--rv-white)]"
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
                    className=""
                >

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                        {activeData?.slice(0, 4)?.map((news, i) => (
                            <motion.div
                                key={news._id || news.id || i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-[var(--rv-bg-white)] text-[var(--rv-black)] border rounded-xl overflow-hidden flex flex-col md:flex-row items-center gap-3"
                            >
                                <div className="md:w-1/3 h-60">
                                    <img
                                        src={news?.img || news?.image || "/no-image.jpg"}
                                        alt={news?.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="md:w-2/3 flex flex-col gap-2 p-4">
                                    <div className="flex items-center opacity-80">
                                        <BiCalendar className="w-4 h-4 mr-2" />
                                        {new Date(news?.pubDate).toDateString()}
                                    </div>

                                    <h6 className="font-semibold line-clamp-2">
                                        {news?.title}
                                    </h6>
                                    <p className="line-clamp-3">
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
                </motion.div>

                {!loading && (
                    <div className="mx-auto">
                        <Button
                            link={"/news"}
                            text={"All News  "}
                        />
                    </div>
                )}
            </section>
        </div>
    );
}
