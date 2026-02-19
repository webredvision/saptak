"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Heading from "@/app/components/Heading/Heading";

export default function YoutubeTheme1({
  videoData = [],
  tabs,
  hideTabs = false,
  hideCategories = false,
}) {
  const categories = hideCategories
    ? ["All"]
    : [
      "All",
      ...Array.from(new Set(videoData.map((v) => v.category || "General"))),
    ];

  const [activeTab, setActiveTab] = useState(categories[0]);
  const [loading, setLoading] = useState(true);

  const filtered = videoData.filter((item) => {
    if (activeTab === "All") return true;
    return item.category === activeTab;
  });

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [activeTab, videoData]);

  useEffect(() => {
    if (hideCategories) setActiveTab("All");
  }, [hideCategories]);

  return (
    <div className="relative overflow-hidden text-[var(--rv-black)] bg-[var(--rv-bg-white)]">
      <InnerPage title="Video Gallery" />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-10">
          <Heading
            heading="Our Journey in Motion"
            description="Explore our latest videos, updates, and insights through our curated video gallery."
          />

          {!hideTabs && tabs}

          {!hideCategories && (
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`px-4 py-2 rounded-full font-medium border transition-all duration-200 flex items-center gap-2 ${activeTab === tab
                      ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] shadow-lg"
                      : "bg-[var(--rv-bg-primary-light)] text-[var(--rv-primary)]"
                    }`}
                >
                  <span className="">{tab}</span>
                  <span className="text-[0.75rem] bg-[var(--rv-bg-white-light)] px-2 py-0.5 rounded">
                    {
                      videoData.filter((v) =>
                        tab === "All" ? true : v.category === tab,
                      ).length
                    }
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-56 bg-gradient-to-r from-[var(--rv-gray)] via-[var(--rv-gray-light)] to-[var(--rv-gray)] animate-pulse rounded-2xl"
                />
              ))}

            {!loading && filtered.length === 0 && (
              <div className="col-span-full text-center font-medium">
                No videos found for{" "}
                <span className="font-semibold">{activeTab}</span>
              </div>
            )}

            {!loading &&
              filtered.map((v, idx) => {
                const hasIframe = v.category === "iframe" || Boolean(v.embedUrl);
                const Wrapper = hasIframe ? "div" : "a";
                const wrapperProps = hasIframe
                  ? {}
                  : {
                    href: v.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  };

                return (
                  <motion.div
                    key={v._id || v.videoId || idx}
                    className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-[var(--rv-bg-primary-light)]"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <Wrapper
                        {...wrapperProps}
                        className={hasIframe ? "block" : "block"}
                      >
                        {hasIframe ? (
                          <div className="w-full h-56 relative">
                            <iframe
                              src={v.embedUrl || v.url}
                              title={v.title || "Video"}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-56 object-cover"
                            loading="lazy"
                          />
                        )}
                      </Wrapper>

                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--rv-black-dark)] via-[var(--rv-black)] to-transparent pointer-events-none" />

                      <span className="absolute top-3 right-3 font-medium px-2.5 py-1 rounded-md backdrop-blur-sm bg-[var(--rv-bg-white-dark)] text-[#333] pointer-events-none">
                        {v.publishedAt
                          ? new Date(v.publishedAt).toLocaleDateString("en-GB")
                          : ""}
                      </span>

                      <div className="absolute bottom-0 left-0 w-full p-4 text-left font-outfit pointer-events-none">
                        <h3 className="text-[var(--rv-white)] text-lg font-semibold leading-snug transition-colors line-clamp-2">
                          {v.title}
                        </h3>
                        <div className="mt-2 h-1 w-12 rounded-full bg-[var(--rv-secondary)] transition-all duration-300 group-hover:w-20" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {!hideCategories && (
            <div className="text-center font-outfit">
              Showing <span className="font-medium">{filtered.length}</span>{" "}
              video(s) in <span className="font-semibold">{activeTab}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
