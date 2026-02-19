"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Heading from "@/app/components/Heading/Heading";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import useInfiniteNews from "./useInfiniteNews";

export default function NewsTheme2({ newsData }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ipo");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const categories = Object.keys(newsData || {});
  const activeData = newsData?.[activeTab] || [];
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
      <div className="px-4 bg-[var(--rv-bg-secondary)]">
        <section className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-8">
          <Heading heading={"Latest News & Updates"} highlight={'News'} title={"News"} />

          <div className="flex justify-center gap-3 flex-wrap bg-[var(--rv-bg-secondary-light)] rounded-full overflow-hidden w-fit p-2 mx-auto">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
                  ? "bg-[var(--rv-bg-primary)] text-[var(--rv-black)] shadow-md"
                  : "bg-[var(--rv-bg-black)] text-[var(--rv-white)] hover:bg-[var(--rv-bg-primary)] hover:text-[var(--rv-black)]"
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
            {visibleData?.map((news, i) => (

              <motion.div
              key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[var(--rv-bg-black)] text-[var(--rv-white)] rounded-xl overflow-hidden flex flex-col"
              >
                <div className="w-full h-56">
                  <img
                    src={news?.img || news?.image || "/no-image.jpg"}
                    alt={news?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center text-sm opacity-80">
                    <BiCalendar className="w-4 h-4 mr-2" />
                    {new Date(news?.pubDate).toDateString()}
                  </div>

                  <h6 className="font-semibold line-clamp-2">
                    {news?.title}
                  </h6>

                  <p className="line-clamp-3">
                    {news?.desc || news?.description}
                  </p>

                  <Link
                    href={news?.link}
                    target="_blank"
                    className="inline-flex items-center font-semibold text-[var(--rv-primary)] group"
                  >
                    Read More
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}


          </motion.div>
          {hasMore && (
            <div ref={sentinelRef} className="h-10" aria-hidden="true" />
          )}
        </section>
      </div>
    </>
  );
}
