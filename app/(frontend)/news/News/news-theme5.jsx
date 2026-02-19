"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Heading from "@/app/components/Heading/Heading";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import useInfiniteNews from "./useInfiniteNews";

export default function NewsTheme5({ newsData }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ipo");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const safeData = newsData && typeof newsData === "object" ? newsData : {};
  const categories = Object.keys(safeData);
  const activeData = Array.isArray(safeData?.[activeTab]) ? safeData[activeTab] : [];
  const { visibleData, hasMore, sentinelRef } = useInfiniteNews(activeData, {
    resetKey: activeTab,
  });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <>
      <InnerPage title={"News"} />
      <div className="px-4">
        <section className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-8">
          <Heading heading={"Latest News & Updates"} title={"News"} />

          {/* ❗ If no categories available */}
          {categories.length === 0 && !loading && (
            <div className="text-center text-[var(--rv-red-dark)] font-semibold bg-[var(--rv-bg-red-light)] p-3 rounded-lg">
              No news data available.
            </div>
          )}

          {categories.length > 0 && (
            <div className="flex justify-center gap-3 flex-wrap bg-[var(--rv-bg-primary-light)] rounded-full overflow-hidden w-fit p-2 mx-auto">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
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
          )}

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5"
          >
            {/* LOADING SHIMMERS */}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
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
              ))}

            {!loading && Array.isArray(activeData) && activeData.length === 0 && (
              <div className="col-span-full text-center text-[var(--rv-secondary)] bg-[var(--rv-bg-yellow-light)] p-3 rounded-lg font-medium">
                No news available for this category.
              </div>
            )}


            {!loading &&
              visibleData?.map((news, i) => (
                <motion.div
                  key={news?._id || news?.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[var(--rv-bg-primary-light)] rounded-xl overflow-hidden"
                >
                  <img
                    src={
                      news?.img ||
                      news?.image ||
                      "/no-image.jpg"
                    }
                    alt={news?.title || "News Image"}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center text-[var(--rv-black)]">
                      <BiCalendar className="w-4 h-4 mr-2" />
                      {news?.pubDate
                        ? new Date(news.pubDate).toDateString()
                        : "No Date"}
                    </div>

                    <h6 className="font-semibold text-[var(--rv-secondary)] line-clamp-2">
                      {news?.title || "No title available"}
                    </h6>

                    <p className="line-clamp-4 text-[var(--rv-black)]">
                      {news?.desc ||
                        news?.description ||
                        "No description available."}
                    </p>

                    {news?.link ? (
                      <Link
                        href={news.link}
                        target="_blank"
                        className="inline-flex items-center text-[var(--rv-black)] font-semibold transition-colors group"
                      >
                        Read More
                        <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <span className="text-[var(--rv-gray)] italic">No link available</span>
                    )}
                  </div>
                </motion.div>
              ))}
          </motion.div>
          {!loading && hasMore && (
            <div ref={sentinelRef} className="h-10" aria-hidden="true" />
          )}
        </section>
      </div>
    </>
  );
}
