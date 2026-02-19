"use client";
import React from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";
import Heading from "./Heading/Heading";

const TopSuggestedFund = ({
  performanceData,
  schemeName,
  roboUser,
  isDark = false,
}) => {
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
  const formatSchemeName = (value) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    try {
      const decoded = decodeURIComponent(value);
      return decoded
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(", ");
    } catch {
      return value;
    }
  };

  const getFundName = (fund) => {
    return (
      fund?.funddes ||
      fund?.schemeName ||
      fund?.scheme_name ||
      fund?.scheme ||
      fund?.title ||
      fund?.name ||
      "Mutual Fund Scheme"
    );
  };

  const getFundCategory = (fund) => {
    return (
      fund?.schemeCategory ||
      fund?.category ||
      fund?.schemeType ||
      fund?.assets_class ||
      "Mutual Fund Category"
    );
  };

  const getFundReturn = (fund) => {
    const raw =
      fund?.one_year ??
      fund?.prevYearPer ??
      fund?.return ??
      fund?.returns ??
      fund?.three_year ??
      fund?.five_year ??
      fund?.si;
    if (raw == null || raw === "") return "0.00";
    const num = Number(raw);
    return Number.isFinite(num) ? num.toFixed(2) : String(raw);
  };

  const handleFundSelect = (item) => {
    if (!item?.pcode) return;
    const ftype = item.category || schemeName || "Unknown";
    const dataToStore = {
      pcode: item.pcode,
      ftype,
      timestamp: Date.now(),
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToStore),
      SECRET_KEY,
    ).toString();

    localStorage.setItem("encryptedFundPerormanceData", encrypted);
  };
  return (
    <div className="bg-[var(--rv-bg-surface)] flex flex-col gap-5">
      <Heading title={'Funds'} heading={'Popular Mutual Funds'} description={'Here are some of the mutual funds that investors frequently invest in. Data shown is factual and based on general investor activity. Please note this is not investment advice or recommendation.'}/>
      <div className="grid gap-4">
        {performanceData &&
          Array.isArray(performanceData) &&
          performanceData.map((fund, index) => (
            <Link
              key={index}
              href="/performance/fund-performance/fund-details"
              onClick={() => handleFundSelect(fund)}
              className="flex justify-between items-center p-5 bg-[var(--rv-bg-secondary-light)] rounded-2xl border border-[var(--rv-border)] hover:border-[var(--rv-primary)]/50 transition-all group"
            >
              <div className="flex-1 pr-4">
                <p className="text-[var(--rv-text)] font-bold leading-tight group-hover:text-[var(--rv-primary)] transition-colors">
                  {getFundName(fund)}
                </p>
                <p className="text-[var(--rv-text-muted)] uppercase tracking-widest mt-1 font-bold">
                  {getFundCategory(fund)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[var(--rv-primary)] font-black text-2xl">
                  {getFundReturn(fund)}%
                </p>
                <p className="text-[8px] text-[var(--rv-text-muted)] uppercase font-black opacity-60">
                  Annualized Return
                </p>
              </div>
            </Link>
          ))}
        {(!performanceData || performanceData.length === 0) && (
          <div className="py-12 flex flex-col items-center justify-center text-[var(--rv-text-muted)] opacity-70">
            <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-lg font-medium">
              Fetching high-quality recommendations...
            </p>
          </div>
        )}
      </div>
      <div className="max-w-5xl mx-auto text-center">
        <p><b>Disclaimer:</b> The above information is provided only for investor awareness. It does not constitute investment advice, research, or a recommendation to invest. The distributor does not rank, rate, or endorse any scheme. Investors should evaluate suitability before investing.</p>
      </div>
    </div>
  );
};

export default TopSuggestedFund;
