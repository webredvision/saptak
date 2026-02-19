"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

import { ReturnChart } from "@/app/components/charts/ReturnChart";
import { FundDetailSkeleton } from "@/app/components/skeletons/performanceSkeleton";
import CryptoJS from "crypto-js";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { SipCalculator } from "@/app/components/sipcalculator";

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
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
  const [activePcode, setActivePcode] = useState(null);
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

  const fetchPerformanceData = async (pcode) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/single-schemedata`,
        { pcode: pcode },
      );
      if (response.status === 200) {
        setPerformanceData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFromStorage = () => {
      const selectedPcode = localStorage.getItem("selectedFundPcode");
      if (selectedPcode && selectedPcode !== activePcode) {
        setActivePcode(selectedPcode);
        fetchPerformanceData(selectedPcode);
        return;
      }

      const encrypted = localStorage.getItem("encryptedFundData");
      if (!encrypted) return;
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) return;
      const data = JSON.parse(decrypted);
      const isExpired = Date.now() - data.timestamp > 2 * 60 * 60 * 1000;

      if (isExpired) {
        localStorage.removeItem("encryptedFundData");
        return;
      }

      if (data.pcode && data.pcode !== activePcode) {
        setActivePcode(data.pcode);
        fetchPerformanceData(data.pcode);
      }
    };

    loadFromStorage();
    const intervalId = setInterval(loadFromStorage, 1000);

    return () => clearInterval(intervalId);
  }, [activePcode, SECRET_KEY]);

  const transformGraphData = (data) => {
    if (!data) return {};
    const labels = data?.map((item) => item.nav_date) || [];
    const navValues = data?.map((item) => item.nav) || [];
    return {
      labels,
      datasets: [
        {
          label: "NAV over time",
          data: navValues,
          fill: false,
          backgroundColor: "var(--rv-primary)",
          borderColor: "var(--rv-primary)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1,
        },
      ],
    };
  };

  const handlePdf = () => {
    if (performanceData) {
      generateFundDetailsPDF(
        performanceData,
        "single-fund-chart-pdf",
        sitedata,
        logoSrc
      );
    }
  };

  return (
    <>
      <InnerPage title="Single Fund" />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <div className="">
            <div>
              {loading ? (
                <FundDetailSkeleton />
              ) : !performanceData ? (
                <div className="h-screen text-center py-10">
                  <h2 className="text-2xl font-semibold mb-2">
                    Fund Data Not Found
                  </h2>
                  <p className="text-lg ">
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
                        {sanitizeText(performanceData?.nav_c2)} -{" "}
                        {sanitizeText(performanceData?.nav_c4)}
                      </h1>
                    </div>
                    {/* <button
                      onClick={handlePdf}
                      className="flex items-center gap-2 rounded-full bg-[var(--rv-bg-secondary)] px-4 py-2 text-[var(--rv-white)] hover:bg-[var(--rv-bg-primary)] transition-all duration-300 pointer-events-auto"
                    >
                      <BsFileEarmarkPdf className="text-lg" />
                      <span className="font-semibold text-sm">Download Report</span>
                    </button> */}
                  </div>

                  {/* Hidden chart for PDF */}
                  <div
                    id="single-fund-chart-pdf"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: 0,
                      width: "800px",
                      height: "400px",
                      zIndex: -1,
                    }}
                  >
                    {performanceData?.nav && (
                      <ReturnChart
                        data={transformGraphData(performanceData?.nav)}
                        className="border-none bg-transparent p-0"
                      />
                    )}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3 items-stretch">
                    <div className="lg:col-span-2">
                      <div className="p-4 rounded-2xl mb-5 border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] shadow-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                          <div>
                            <p className="text-lg font-bold text-[var(--rv-text)]">
                              ₹{performanceData?.NAVAmount}
                            </p>
                            <h6 className="text-md text-[var(--rv-text-muted)]">
                              Current NAV
                            </h6>
                          </div>

                          <div>
                            {(() => {
                              const {
                                prev5YearPer,
                                prev3YearPer,
                                prevYearPer,
                                prev9MonthsPer,
                                prev6MonthsPer,
                                prev3MonthsPer,
                                prev1MonthPer,
                                prev1WeekPer,
                              } = performanceData || {};

                              let value = "0.00";
                              let label = "";

                              if (prev5YearPer && prev5YearPer !== "0.00") {
                                value = prev5YearPer;
                                label = "5Y";
                              } else if (
                                prev3YearPer &&
                                prev3YearPer !== "0.00"
                              ) {
                                value = prev3YearPer;
                                label = "3Y";
                              } else if (
                                prevYearPer &&
                                prevYearPer !== "0.00"
                              ) {
                                value = prevYearPer;
                                label = "1Y";
                              } else if (
                                prev9MonthsPer &&
                                prev9MonthsPer !== "0.00"
                              ) {
                                value = prev9MonthsPer;
                                label = "9M";
                              } else if (
                                prev6MonthsPer &&
                                prev6MonthsPer !== "0.00"
                              ) {
                                value = prev6MonthsPer;
                                label = "6M";
                              } else if (
                                prev3MonthsPer &&
                                prev3MonthsPer !== "0.00"
                              ) {
                                value = prev3MonthsPer;
                                label = "3M";
                              } else if (
                                prev1MonthPer &&
                                prev1MonthPer !== "0.00"
                              ) {
                                value = prev1MonthPer;
                                label = "1M";
                              } else if (
                                prev1WeekPer &&
                                prev1WeekPer !== "0.00"
                              ) {
                                value = prev1WeekPer;
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
                        {performanceData?.nav ? (
                          <ReturnChart
                            data={transformGraphData(performanceData?.nav)}
                            className="border-none bg-transparent p-0"
                          />
                        ) : (
                          <p className="text-[var(--rv-text-muted)]">
                            No graph data available.
                          </p>
                        )}
                      </div>
                      <div className="rounded-2xl bg-[var(--rv-bg-surface)] p-4">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-[var(--rv-text)]">
                              Scheme Performance
                            </AccordionTrigger>
                            <AccordionContent className="">
                              <p className="text-sm font-medium mb-3 text-[var(--rv-text-muted)]">
                                Returns and Ranks
                              </p>
                              <div className="border-y border-[var(--rv-border)] flex justify-between py-4 items-center">
                                <div>
                                  <p className="text-md font-medium text-[var(--rv-text)]">
                                    Time Line
                                  </p>
                                </div>
                                <div className="grid grid-cols-4 text-center md:gap-x-20 gap-x-3">
                                  <div className="text-lg font-bold text-[var(--rv-text)]">
                                    1Y
                                  </div>
                                  <div className="text-lg font-bold text-[var(--rv-text)]">
                                    3Y
                                  </div>
                                  <div className="text-lg font-bold text-[var(--rv-text)]">
                                    5Y
                                  </div>
                                  <div className="text-lg font-bold text-[var(--rv-text)]">
                                    MAX
                                  </div>
                                </div>
                              </div>
                              <div className="border-b border-[var(--rv-border)] flex justify-between py-4">
                                <div>
                                  <p className="text-md font-bold text-[var(--rv-text)]">
                                    Trailing Returns
                                  </p>
                                </div>
                                <div className="grid grid-cols-4 text-center md:gap-x-16 gap-x-3">
                                  <div className="text-md font-medium text-[var(--rv-text-muted)]">
                                    {performanceData?.prevYearPer || "-"}%
                                  </div>
                                  <div className="text-md font-medium text-[var(--rv-text-muted)]">
                                    {performanceData?.prev3YearPer || "-"}%
                                  </div>
                                  <div className="text-md font-medium text-[var(--rv-text-muted)]">
                                    {performanceData?.prev5YearPer || "-"}%
                                  </div>
                                  <div className="text-md font-medium text-[var(--rv-text-muted)]">
                                    {performanceData?.sinceInceptionReturn ||
                                      "-"}
                                    %
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg text-[var(--rv-text)]">
                              Minimum Sip Amount
                            </AccordionTrigger>
                            <AccordionContent className="text-[var(--rv-text-muted)]">
                              <p>
                                Minimum Sip Amount -{" "}
                                {
                                  performanceData?.sip_minimum_installment_amount
                                }
                              </p>
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
      </div>
    </>
  );
}
