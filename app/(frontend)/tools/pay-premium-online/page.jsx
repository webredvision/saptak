"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/app/components/ui/skeleton";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

export default function PayPremium({ isDark = false }) {
  const [allCategory, setAllCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState("");
  const [amcLogoData, setAmcLogoData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchAmcLogos(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-category`,
      );
      const data = await res.json();

      const filtered = data.filter((cat) =>
        ["Life Insurance", "Health Insurance", "General Insurance"].includes(
          cat.title,
        ),
      );

      setAllCategory(filtered);

      if (filtered.length > 0) {
        setSelectedCategoryId(filtered[0]._id);
        setSelectedCategoryTitle(filtered[0].title);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAmcLogos = async (categoryID) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryID }),
        },
      );

      const data = await res.json();
      const filteredLogos = data?.data?.filter((logo) => logo.addisstatus);
      setAmcLogoData(filteredLogos || []);
    } catch (error) {
      console.error("Error fetching AMC logos:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="text-[var(--rv-text)] bg-[var(--rv-bg-page)]">
      <InnerPage title="Pay Premium Online" />
      <div className="px-4">
        <div className="max-w-screen-xl mx-auto main-section w-full flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-2 w-fit">
            <div className="p-1.5 bg-[var(--rv-bg-white)] border w-full">
              {allCategory.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategoryId(cat._id);
                    setSelectedCategoryTitle(cat.title);
                  }}
                  className={`px-6 py-2
                    ${selectedCategoryId === cat._id
                      ? "bg-[var(--rv-primary)] text-[var(--rv-white)] shadow-lg"
                      : "bg-[var(--rv-bg-secondary-light)]"
                    }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 bg-gray-100 rounded-xl" />
                ))}
              </div>
            ) : amcLogoData.length > 0 ? (
              <div
                 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              >
                {amcLogoData.map((item, index) => (
                    <motion.div key={index} className="h-full">
                      <a
                        href={item?.adminlogourl || item?.logourl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-20 border rounded-xl transition-all relative overflow-hidden"
                      >
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4">
                          <div className="w-full h-20 p-1 relative bg-[var(--rv-bg-white)]">
                            <img
                              src={`https://redvisionweb.com/${item?.logo}`}
                              alt={`logo-${item?.logoname}`}
                              className={`object-contain w-full h-full transition-all ${isDark ? "brightness-110 contrast-125" : ""}`}
                            />
                          </div>
                        </div>
                      </a>
                    </motion.div>
                ))}
              </div>
            ) : (
              <div className="main-section text-center border border-[var(--rv-bg-white-light)]">
                <p className="text-xl">No partners found for this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
