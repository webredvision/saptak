"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";
import { Input } from "@/app/components/ui/input";
import Button from "@/app/components/Button/Button";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

const FundPerformanceList = ({ data, title, roboUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFund, setSelectedFund] = useState(null);
  const [investAmount, setInvestAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
  const router = useRouter();

  const handleFundSelect = (item) => {
    if (!item?.pcode) return;
    const dataToStore = {
      pcode: item.pcode,
      ftype: title,
      timestamp: Date.now(),
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToStore),
      SECRET_KEY,
    ).toString();

    localStorage.setItem("encryptedFundPerormanceData", encrypted);
  };

  const filteredData = useMemo(() => {
    let result = (data || []).filter((item) =>
      item.funddes?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortBy === "nav") {
      result.sort(
        (a, b) =>
          parseFloat(b.threeyear_navEndDate || b.NAVAmount || 0) -
          parseFloat(a.threeyear_navEndDate || a.NAVAmount || 0),
      );
    } else if (sortBy === "returns") {
      result.sort(
        (a, b) =>
          parseFloat(b.one_year || b.prevYearPer || 0) -
          parseFloat(a.one_year || a.prevYearPer || 0),
      );
    } else {
      result.sort((a, b) => (a.funddes || "").localeCompare(b.funddes || ""));
    }

    return result;
  }, [data, searchQuery, sortBy]);

  const openInvestPopup = (fund) => {
    setSelectedFund(fund);
    setInvestAmount("");
    setErrorMessage("");
    setIsConfirmed(false);
  };

  const closeInvestPopup = () => {
    setSelectedFund(null);
    setInvestAmount("");
    setErrorMessage("");
    setIsConfirmed(false);
  };

  const handleInvestSubmit = async (pcode) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/get-minimum-amount`,
        {
          schemeCode: pcode,
          arn_id: roboUser?.arnId,
        }
      );

      const minAmount = res?.data?.data?.data[pcode] || 0;
      const maxAmount = 10000000; // 1 Crore limit
      const enteredAmount = parseFloat(investAmount);

      if (!enteredAmount || enteredAmount <= 0) {
        setErrorMessage("Please enter a valid investment amount.");
        return;
      }

      if (enteredAmount < minAmount) {
        setErrorMessage(`Minimum investment amount is ₹${minAmount}.`);
        return;
      }

      if (enteredAmount > maxAmount) {
        setErrorMessage(`Maximum investment amount is ?1,00,00,000 (1 Crore).`);
        return;
      }

      const funds = [
        {
          pcode,
          allocation: "100",
          allocationAmount: enteredAmount,
        },
      ];

      const investmentData = {
        arnid: roboUser?.arnId,
        arnnumber: roboUser?.arnNumber,
        totalAmount: enteredAmount,
        funds,
      };

      localStorage.setItem("investmentData", JSON.stringify(investmentData));
      setInvestAmount("");
      closeInvestPopup();
      router.push("/login");
    } catch (error) {
      console.error("Error fetching minimum amount:", error);
      setErrorMessage("Failed to fetch minimum investment amount. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center bg-[var(--rv-bg-page)] p-3 sm:p-4 rounded-xl shadow-lg border">
        <div className="relative w-full sm:flex-1 md:w-96">
          <Input
            placeholder="Search fund name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 sm:h-11 bg-[var(--rv-bg-page)] rounded-lg text-[var(--rv-text)] placeholder:text-[var(--rv-gray)] outline-none"
          />
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
            size={16}
          />
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-[200px] md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-10 sm:h-11 pl-3 pr-10 appearance-none bg-[var(--rv-bg-page)] border rounded-lg text-[var(--rv-text)] outline-none font-medium cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="nav">Sort by NAV</option>
            <option value="returns">Sort by 1Y returns</option>
          </select>
          <FaChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)] pointer-events-none"
            size={12}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="group bg-[var(--rv-bg-page)] border p-4 sm:p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 rounded-xl  last:border-b-0"
            >
              <Link
                href="/performance/fund-performance/fund-details"
                onClick={() => handleFundSelect(item)}
                className="flex-1 space-y-1"
              >
                <h3 className="text-base sm:text-lg font-bold text-[var(--rv-primary)] transition-colors line-clamp-2 sm:line-clamp-1">
                  {item.funddes}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--rv-gray)] font-medium uppercase tracking-wider">
                  {title}
                </p>
              </Link>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-[var(--rv-gray)] font-bold uppercase mb-1">
                    Corpus
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[var(--rv-white)]">
                    ₹{item.Corpus || item.corpus || "---"}
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-[var(--rv-gray)] font-bold uppercase mb-1">
                    NAV
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[var(--rv-white)]">
                    ₹{item.threeyear_navEndDate || item.NAVAmount || "0.00"}
                  </p>
                </div>

                <div className="text-center sm:text-right col-span-2 sm:col-span-1 border-t sm:border-t-0 border-[var(--rv-gray-dark)] pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <p className="text-xs sm:text-sm text-[var(--rv-gray)] font-bold uppercase mb-1">
                    1Y CAGR returns
                  </p>
                  <p
                    className={`text-sm sm:text-base font-bold ${parseFloat(item.one_year || item.prevYearPer) >= 0 ? "text-[var(--rv-green)]" : "text-[var(--rv-red)]"}`}
                  >
                    {item.one_year || item.prevYearPer || "0.00"}%
                  </p>
                </div>
              </div>

              <div className="lg:ml-4 flex justify-stretch sm:justify-end mt-2 sm:mt-0">
                {roboUser ? (
                  <Button
                    text="Purchase Now"
                    onClick={() => openInvestPopup(item)}
                    className="w-full sm:w-auto text-sm sm:text-base font-bold rounded min-w-[130px] bg-[var(--rv-primary)] text-[var(--rv-black)] hover:bg-[var(--rv-primary-dark)] hover:text-[var(--rv-white)] transition-all shadow-md"
                  />
                ) : (
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      text="Purchase Now"
                      className="w-full sm:w-auto text-sm sm:text-base font-bold rounded min-w-[130px] bg-[var(--rv-primary)] text-[var(--rv-black)] hover:bg-[var(--rv-primary-dark)] hover:text-[var(--rv-white)] transition-all shadow-md"
                    />
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-[var(--rv-bg-page)] rounded-xl border border-dashed">
            <p className="text-[var(--rv-gray)] font-medium">
              No funds found matching your search.
            </p>
          </div>
        )}
      </div>

      {selectedFund && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[var(--rv-bg-page)] text-[var(--rv-text)] rounded-lg shadow-xl max-w-md w-full px-5 sm:px-7 py-5 sm:py-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeInvestPopup}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 text-red-500 text-2xl sm:text-3xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-lg sm:text-xl font-bold mb-3 pr-8">
              {selectedFund?.funddes}
            </h2>
            <p className="text-start mb-2 text-sm sm:text-base font-medium">
              Enter Lumpsum Amount
            </p>

            <input
              type="number"
              min={1}
              max={10000000}
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              placeholder="Enter amount"
              className="border rounded-lg w-full p-2 sm:p-3 mb-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--rv-primary)]"
            />

            {errorMessage && (
              <p className="text-red-600 text-xs sm:text-sm mb-3 bg-red-50 p-2 rounded">
                {errorMessage}
              </p>
            )}

            <div className="flex items-start gap-2 mb-4">
              <input
                id="disclaimerCheckbox"
                type="checkbox"
                className="mt-1 w-4 h-4 flex-shrink-0 text-[var(--rv-primary)] border-gray-300 rounded focus:ring-[var(--rv-primary)]"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              <label
                htmlFor="disclaimerCheckbox"
                className="text-start text-xs sm:text-sm leading-snug"
              >
                I understand this is factual information only and I am investing at my own discretion.
                <br />
                This transaction is execution-only, and the distributor has not provided investment advice.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => handleInvestSubmit(selectedFund.pcode)}
                disabled={!isConfirmed}
                text="Purchase"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundPerformanceList;
