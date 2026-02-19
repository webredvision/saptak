"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GrClose } from "react-icons/gr";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Heading from "@/app/components/Heading/Heading";
import Link from "next/link";

const GalleryTheme5 = ({ images = [], videos = [] }) => {
  const mainTabs = useMemo(() => {
    const tabs = ["Images"];
    if (videos.length > 0) tabs.push("Videos");
    return tabs;
  }, [videos]);

  const [activeTab, setActiveTab] = useState("Images");
  const [videoTab, setVideoTab] = useState("normal");
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        images.map((item) => item?.category?.title || "Uncategorized")
      ),
    ];
  }, [images]);

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);


  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter(
        (item) =>
          (item?.category?.title || "Uncategorized") === activeCategory
      );


  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [activeTab, activeCategory, videoTab]);

  const filteredVideos = Array.isArray(videos) ? videos : [];


  return (
    <>
      <InnerPage title="Gallery" />

      <div className="bg-[var(--rv-bg-white)] px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-10">
          <Heading
            title="Our Gallery"
            heading="Capturing moments that define our journey"
            description="Explore glimpses of our journey — events, milestones, and moments that showcase our passion, dedication, and teamwork through the years."
          />

          <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full sm:text-base font-medium transition-all duration-300 ${activeTab === tab
                  ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] shadow-md scale-105"
                  : "bg-[var(--rv-bg-primary-light)] text-[var(--rv-text)]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Images" && (
            <>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-3 w-full">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full font-medium border transition-all duration-300 ${activeCategory === cat
                        ? "bg-[var(--rv-bg-primary)] text-white shadow-md"
                        : "bg-white text-black"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-56 bg-gray-200 animate-pulse rounded-xl"
                    />
                  ))
                ) : filteredImages.length > 0 ? (
                  filteredImages.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSelectedImg(item.image?.url)}
                      className="relative overflow-hidden rounded-xl cursor-pointer group"
                    >
                      <img
                        src={item.image?.url}
                        alt=""
                        className="w-full h-56 object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-white font-medium">
                          View Image
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center py-10 text-gray-500">
                    No images found.
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === "Videos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <div
                    key={video._id}
                    className="bg-white rounded-xl shadow overflow-hidden"
                  >
                    {video.embedUrl ? (
                      <iframe
                        src={video.embedUrl}
                        title={video.title}
                        className="w-full h-56"
                        allowFullScreen
                      />
                    ) : (
                      <Link
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={video.image?.url}
                          className="w-full h-56 object-cover"
                          alt=""
                        />
                      </Link>
                    )}

                    <div className="p-3 text-center font-medium">
                      {video.title}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  No videos found.
                </p>
              )}
            </div>
          )}



          <AnimatePresence>
            {selectedImg && (
              <motion.div
                className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="h-96 w-auto relative">
                  <div onClick={() => setSelectedImg(null)} className="w-10 h-10 flex items-center justify-center text-white absolute top-2 right-2 rounded-full bg-red-500 cursor-pointer">
                    <GrClose />
                  </div>
                  <motion.img
                    src={selectedImg}
                    className="w-full h-full rounded-xl object-contain"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default GalleryTheme5;
