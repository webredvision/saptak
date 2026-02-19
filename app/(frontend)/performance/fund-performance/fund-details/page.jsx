"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { SipCalculator } from "@/app/components/sipcalculator";
import { ReturnChart } from "@/app/components/charts/ReturnChart";
import CryptoJS from "crypto-js";
import { FundDetailSkeleton } from "@/app/components/skeletons/performanceSkeleton";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { generateFundDetailsPDF } from "@/lib/generatePdf";
import { BsFileEarmarkPdf } from "react-icons/bs";
import useLogoSrc from "@/hooks/useLogoSrc";

const sanitizeText = (value) => {
  if (!value) return "";
  return String(value).replace(/\?/g, " ").replace(/\s+/g, " ").trim();
};

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [timeFrame, setTimeFrame] = useState("1Y");
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
  const logoSrc = useLogoSrc();
  const [sitedata, setSiteData] = useState([]);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`
        );
        if (res.ok) {
          const data = await res.json();
          setSiteData(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch site settings", error);
      }
    };
    fetchSiteData();
  }, []);

  const fetchPerformanceData = async (pcode, ftype) => {
    setLoading(true);
    try {
      const sanitizedperformanceId = ftype.includes("&")
        ? ftype.replace(/&/g, "%26")
        : ftype;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/fund-performance/fp-data?categorySchemes=${sanitizedperformanceId}`,
      );
      if (response.status === 200) {
        const foundData = response.data.data?.find(
          (item) => item.pcode === pcode,
        );
        setPerformanceData(foundData);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async (pcode) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/fund-performance/graph-data?pcode=${pcode}`,
      );
      if (response.status === 200) {
        setGraphData(response.data);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    const encrypted = localStorage.getItem("encryptedFundPerormanceData");
    if (!encrypted) return;
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Decryption failed");
    const data = JSON.parse(decrypted);
    const isExpired = Date.now() - data.timestamp > 2 * 60 * 60 * 1000;

    if (isExpired) {
      localStorage.removeItem("encryptedFundPerormanceData");
    } else {
      fetchPerformanceData(data.pcode, data.ftype);
      fetchGraphData(data.pcode, timeFrame);
    }
  }, [timeFrame]);

  const transformGraphData = (data) => {
    if (!data) return {};

    const labels = [];
    const navValues = [];

    (data.navDateArray || []).forEach((dateValue, index) => {
      const navValue = parseFloat(data.navArray?.[index]);
      const parsedDate = new Date(dateValue);
      if (!Number.isNaN(navValue) && !Number.isNaN(parsedDate.getTime())) {
        labels.push(dateValue);
        navValues.push(navValue);
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "NAV over time",
          data: navValues,
          fill: false,
          backgroundColor: "var(--rv-primary)",
          borderColor: "var(--rv-primary)",
        },
      ],
    };
  };

  const handlePdf = () => {
    if (performanceData) {
      generateFundDetailsPDF(
        performanceData,
        "fund-performance-chart",
        sitedata,
        logoSrc
      );
    }
  };

  return (
    <>
      <InnerPage title="Fund Details" />
      <div className="px-4 bg-[var(--rv-bg-white)] text-[var(--rv-black)]">
        <div className="max-w-screen-xl mx-auto main-section">
          <div className="">
            {loading ? (
              <FundDetailSkeleton />
            ) : !performanceData ? (
              <div className="h-screen text-center py-10">
                <h2 className="text-2xl font-semibold mb-2">
                  Fund Data Not Found
                </h2>
                <p className="text-lg">
                  We couldn&apos;t find the performance data for this fund.
                  Please try again later or check the fund details.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 text-[var(--rv-text)]">
                      {sanitizeText(performanceData?.funddes)}
                    </h1>
                    <h1 className="text-base sm:text-lg font-medium text-[var(--rv-text-muted)]">
                      {sanitizeText(performanceData?.schemeCategory)}
                    </h1>
                  </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-3 items-stretch">
                  <div className="lg:col-span-2">
                    <div className="p-4 rounded-2xl mb-5 border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] shadow-md">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                        <div>
                          <p className="text-lg font-bold text-[var(--rv-text)]">
                            ₹
                            {performanceData?.threeyear_navEndDate ||
                              performanceData?.NAVAmount ||
                              performanceData?.one_year ||
                              "0.00"}
                          </p>
                          <h6 className="text-md text-[var(--rv-text-muted)]">
                            Current NAV
                          </h6>
                        </div>

                        <div>
                          {(() => {
                            const {
                              five_year,
                              three_year,
                              one_year,
                              nine_month,
                              six_month,
                              three_month,
                              one_month,
                              one_week,
                            } = performanceData || {};

                            let value = "0.00";
                            let label = "";

                            if (five_year && five_year !== "0.00") {
                              value = five_year;
                              label = "5Y";
                            } else if (three_year && three_year !== "0.00") {
                              value = three_year;
                              label = "3Y";
                            } else if (one_year && one_year !== "0.00") {
                              value = one_year;
                              label = "1Y";
                            } else if (nine_month && nine_month !== "0.00") {
                              value = nine_month;
                              label = "9M";
                            } else if (six_month && six_month !== "0.00") {
                              value = six_month;
                              label = "6M";
                            } else if (three_month && three_month !== "0.00") {
                              value = three_month;
                              label = "3M";
                            } else if (one_month && one_month !== "0.00") {
                              value = one_month;
                              label = "1M";
                            } else if (one_week && one_week !== "0.00") {
                              value = one_week;
                              label = "1W";
                            }

                            return (
                              <>
                                <p className="text-lg font-bold text-[var(--rv-text)]">
                                  {value}%
                                </p>
                                <p className="text-md text-[var(--rv-text-muted)]">
                                  {label} CAGR returns
                                </p>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      {graphData ? (
                        <div id="fund-performance-chart">
                          <ReturnChart
                            data={transformGraphData(graphData)}
                            className="border-none bg-transparent p-0"
                          />
                        </div>
                      ) : (
                        <p className="text-[var(--rv-text-muted)]">
                          No graph data available.
                        </p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] p-4">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-lg text-[var(--rv-text)]">
                            Scheme Performance
                          </AccordionTrigger>
                          <AccordionContent className="">
                            <p className="text-sm font-medium mb-3 text-[var(--rv-text-muted)]">
                              Returns and Ranks
                            </p>
                            <div className="border-y border-[var(--rv-border)] flex flex-col sm:flex-row sm:justify-between gap-3 py-4 items-start sm:items-center">
                              <div>
                                <p className="text-md font-medium text-[var(--rv-text)]">
                                  Time Line
                                </p>
                              </div>
                              <div className="grid grid-cols-4 text-center sm:gap-x-8 gap-x-3">
                                <div className="text-xs sm:text-lg font-bold text-[var(--rv-text)]">
                                  1Y
                                </div>
                                <div className="text-xs sm:text-lg font-bold text-[var(--rv-text)]">
                                  3Y
                                </div>
                                <div className="text-xs sm:text-lg font-bold text-[var(--rv-text)]">
                                  5Y
                                </div>
                                <div className="text-xs sm:text-lg font-bold text-[var(--rv-text)]">
                                  MAX
                                </div>
                              </div>
                            </div>
                            <div className="border-b border-[var(--rv-border)] flex flex-col sm:flex-row sm:justify-between gap-3 py-4">
                              <div>
                                <p className="text-md font-bold text-[var(--rv-text)]">
                                  Trailing Returns
                                </p>
                              </div>
                              <div className="grid grid-cols-4 text-center sm:gap-x-8 gap-x-3">
                                <div className="text-xs sm:text-md font-medium text-[var(--rv-text-muted)]">
                                  {performanceData?.one_year !== "0.00" &&
                                    performanceData?.one_year
                                    ? `${performanceData.one_year}%`
                                    : performanceData?.onemonth || "-"}
                                  %
                                </div>
                                <div className="text-xs sm:text-md font-medium text-[var(--rv-text-muted)]">
                                  {performanceData?.three_year !== "0.00" &&
                                    performanceData?.three_year
                                    ? `${performanceData.three_year}%`
                                    : performanceData?.six_month || "-"}
                                  %
                                </div>
                                <div className="text-xs sm:text-md font-medium text-[var(--rv-text-muted)]">
                                  {performanceData?.five_year !== "0.00" &&
                                    performanceData?.five_year
                                    ? `${performanceData.five_year}%`
                                    : performanceData?.three_month || "-"}
                                  %
                                </div>
                                <div className="text-xs sm:text-md font-medium text-[var(--rv-text-muted)]">
                                  {performanceData?.si || "-"}%
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger className="text-lg text-[var(--rv-text)]">
                            Fund Managers
                          </AccordionTrigger>
                          <AccordionContent className="">
                            <div className="rounded py-2 px-3 mt-2 bg-[var(--rv-bg-surface)] ">
                              <div className="flex flex-col gap-1">
                                {performanceData?.fundManager
                                  ?.split(",")
                                  .map((manager, index) => (
                                    <div key={index} className="mr-4">
                                      <div className="text-md font-bold text-[var(--rv-text)]">
                                        {manager.trim()}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <SipCalculator
                      data={performanceData}
                      embedded
                      variant="fund"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
