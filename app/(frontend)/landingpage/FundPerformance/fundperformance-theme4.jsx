"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js";
const tabOptions = [
  {
    key: "equity",
    label: "Equity Funds",
    description: "Long-term wealth creation",
    defaultSub: "Small Cap Fund",
    icon: "/images/fundperformer/equity.svg",
  },
  {
    key: "debt",
    label: "Debt Funds",
    description: "Safer, stable returns",
    defaultSub: "Gilt Fund",
    icon: "/images/fundperformer/debt.svg",
  },
  {
    key: "hybrid",
    label: "Hybrid Funds",
    description: "Mix of both worlds",
    defaultSub: "Aggressive Hybrid Fund",
    icon: "/images/fundperformer/hybrid.svg",
  },
  {
    key: "sol",
    label: "Sol Oriented",
    description: "Save taxes, grow money",
    defaultSub: "ELSS",
    icon: "/images/fundperformer/sol-oriented.svg",
  },
  {
    key: "liquid",
    label: "Liquid Funds",
    description: "Park idle cash smartly",
    defaultSub: "Liquid Fund",
    icon: "/images/fundperformer/others.svg",
  },
];
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
const tabsContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.05 },
  },
};

const tabVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.04 },
  }),
};

export default function FundPerformanceTheme4() {
  const [activeTab, setActiveTab] = useState("equity");
  const [subcategories, setSubCategories] = useState("Small Cap Fund");
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const router = useRouter();

  const pick = (obj, keys = [], fallback = "—") => {
    if (!obj) return fallback;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
        return obj[k];
      }
    }
    return fallback;
  };

  const fetchPerformanceData = async (subcategory) => {
    if (!subcategory) return;
    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_NEXTAUTH_URL || "";
      const url = `${base}/api/open-apis/fund-performance/fp-data?categorySchemes=${encodeURIComponent(
        subcategory
      )}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const allFunds = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const topFunds = allFunds
          .filter((fund) => {
            const raw5 = pick(
              fund,
              ["five_year", "fiveYear", "5_year", "5y", "five_year_return"],
              null
            );
            const val =
              raw5 === null
                ? NaN
                : parseFloat(String(raw5).replace("%", "").replace(",", ""));
            return !isNaN(val);
          })
          .sort((a, b) => {
            const aVal =
              parseFloat(
                String(
                  pick(
                    a,
                    ["five_year", "fiveYear", "5_year", "5y", "five_year_return"],
                    0
                  )
                )
                  .toString()
                  .replace("%", "")
                  .replace(",", "")
              ) || 0;
            const bVal =
              parseFloat(
                String(
                  pick(
                    b,
                    ["five_year", "fiveYear", "5_year", "5y", "five_year_return"],
                    0
                  )
                )
                  .toString()
                  .replace("%", "")
                  .replace(",", "")
              ) || 0;
            return bVal - aVal;
          })
          .slice(0, 10);

        setPerformanceData(topFunds);
      } else {
        setPerformanceData([]);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
      setPerformanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectedTab = tabOptions.find((tab) => tab.key === activeTab);
    if (selectedTab) {
      setSubCategories(selectedTab.defaultSub);
      fetchPerformanceData(selectedTab.defaultSub);
    }
  }, [activeTab]);

    const handleSelectFunds = (fund, subcategory) => {
      if (!SECRET_KEY) {
        console.error("Missing SECRET_KEY! Please define NEXT_PUBLIC_SECRET_KEY in .env file.");
        return;
      }
       console.log(fund)
       const dataToStore = {
        pcode:fund?.pcode,
        ftype: subcategory,
        timestamp: Date.now(),
      };
     
      console.log(dataToStore)
      try {
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(dataToStore),
          SECRET_KEY
        ).toString();
  
        localStorage.setItem("encryptedFundPerormanceData", encrypted);
  
        window.location.href = "/performance/fund-performance/fund-details";
      } catch (error) {
        console.error("Encryption or navigation failed:", error);
      }
     
    };

  const renderNav = (f) => pick(f, ["si", "nav", "navValue", "nav"], "—");
  const render3y = (f) => pick(f, ["three_year", "3y", "threeYear"], "—");
  const render5y = (f) => pick(f, ["five_year", "5y", "fiveYear"], "—");

  return (
    <motion.section
      className="text-[var(--rv-white)] overflow-hidden px-4 bg-[var(--rv-bg-secondary)]"
    >
      <div className="main-section border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-6 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              variant="light"
              title={'Top Performing Funds'}
              heading="Explore the Best Mutual Fund Performers"
              description="Analyze the historical returns of top-performing funds to make informed investment decisions."
            />
          </motion.div>

          <div className="w-full flex flex-col gap-5">
            <div>
              <div className="w-full  items-center justify-center hidden lg:flex">
                <img src="/images/fund-svg.svg" alt="" />
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
                variants={tabsContainerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                {tabOptions.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <motion.button
                      key={tab.key}
                      variants={tabVariants}
                      onClick={() => setActiveTab(tab.key)}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      className={`border border-[var(--rv-border)] md:p-5 p-2 rounded-md transition-all duration-200 ${isActive
                        ? "bg-[var(--rv-primary)] text-[var(--rv-white)] shadow-md"
                        : ""
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-start">
                          <p className="font-semibold">{tab.label}</p>
                          <p className="">{tab.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            <motion.div
              className="overflow-x-auto rounded-xl border border-[var(--rv-border)] bg-transparent whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
              {loading ? (
                <p className="bg-[var(--rv-primary)] text-[var(--rv-white)] py-4">
                  Loading funds...
                </p>
              ) : performanceData.length > 0 ? (
                <table className="min-w-full text-[var(--rv-white)]">
                  <thead className="bg-[var(--rv-secondary)] rounded">
                    <tr>
                      <th className="p-4 text-start">Fund Name</th>
                      <th className="p-4 text-center">Nav</th>
                      <th className="p-4 text-center">3Y Return</th>
                      <th className="p-4 text-center">5Y Return</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {performanceData.slice(0, 5).map((fund, idx) => (
                      <motion.tr
                        key={idx}
                        variants={rowVariants}
                        custom={idx}
                        className="cursor-pointer border-t border-[var(--rv-border)]"
                        onClick={() => handleSelectFunds(fund, subcategories)}
                      >
                        <td className="px-4 py-[15px] font-medium">
                          <div className="line-clamp-1">
                            {pick(
                              fund,
                              ["funddes", "scheme_name", "scheme"],
                              "Unknown Fund"
                            )}
                          </div>
                          <p className="">
                            {fund.schemeCategory || "Equity"}
                            {fund.schemeType ? ` - ${fund.schemeType}` : ""}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {renderNav(fund) || "0.00"}
                        </td>
                        <td className="px-4 py-4 text-center text-[var(--rv-primary)] font-semibold">
                          {render3y(fund) || "0.00"}%
                        </td>
                        <td className="px-4 py-4 text-center text-[var(--rv-primary)] font-semibold">
                          {render5y(fund) || "0.00"}%
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              ) : (
                <p className="text-center py-4">No fund data available</p>
              )}
            </motion.div>

            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Button
                  className="border border-[var(--rv-bg-primary)]"
                  text="Explore More"
                  link="/performance/fund-performance"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
