"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/Button/Button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import { SipPerformanceChart } from "@/app/components/charts/sipPerformanceChart";
import { BsFileEarmarkPdf } from "react-icons/bs";
import SipPerformanceTable from "@/app/components/sipPerformanceTable";
import { generatePDF } from "@/lib/generatePdf";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import CalculatorHeader from "@/app/components/calculators/CalculatorHeader";
import { performance } from "@/data/calculators";

import styles from "@/app/(frontend)/performance/Calculators.module.css";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function Page() {
  const logoSrc = useLogoSrc();
  function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const [schemesData, setSchemesData] = useState([]);
  const [result, setResult] = useState(null);
  const [isMonthlySip, setIsMonthlySip] = useState(true);
  const [allAcmdata, setAllAcmdata] = useState([]);
  const [selectedAcms, setSelectedAcms] = useState([]);
  const [funds, setFunds] = useState([]);
  const [startsipDate, setStartSipDate] = useState("2021-10-14");
  const [endsipDate, setEndSipDate] = useState(getTodayDate());
  const [valuationDate, setValuationDate] = useState(getTodayDate());
  const [sipAmount, setSipAmount] = useState(10000);
  const [pcode, setPcode] = useState("");
  const [title, setTitle] = useState("");
  const [viewby, setViewBy] = useState("graph");
  const [assetCategory, setAssetCategory] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [graphData, setGraphData] = useState(false);
  const [sitedata, setSiteData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Constants for time calculations
  const TWENTY_DAYS_IN_MS = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

  useEffect(() => {
    // Check if the form has already been submitted (stored in localStorage)
    const formSubmitted = localStorage.getItem("formSubmitted");
    const submissionTimestamp = localStorage.getItem("submissionTimestamp");

    if (formSubmitted === "true" && submissionTimestamp) {
      const currentTime = Date.now();
      const timeDifference = currentTime - submissionTimestamp;

      // If 20 days have passed since submission, clear the localStorage
      if (timeDifference > TWENTY_DAYS_IN_MS) {
        localStorage.removeItem("formSubmitted");
        localStorage.removeItem("submissionTimestamp");
        setIsSubmitted(false); // Allow form to open again
      } else {
        setIsSubmitted(true); // Keep form closed if within 20 days
      }
    }
  }, []);

  const fetcAcm = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/all-amc`,
      );
      setAllAcmdata(response.data);
    } catch (error) {
      console.error("Error fetching AMC data:", error);
    }
  };

  const fetcAssetCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/get-assets`,
      );
      setAssetCategory(response.data);
    } catch (error) {
      console.error("Error fetching AMC data:", error);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedAcms]);

  React.useEffect(() => {
    fetcAcm();
    fetcAssetCategory();
  }, []);

  const handleAssetSelect = (scheme) => {
    const assetClass = scheme?.assets_class;
    if (assetClass) {
      setSelectedAssets((prevSelected) => {
        const updatedSelection = new Set(prevSelected);

        if (updatedSelection.has(assetClass)) {
          // If already selected, remove it
          updatedSelection.delete(assetClass);
        } else {
          // If not selected, add it
          updatedSelection.add(assetClass);
        }

        return updatedSelection; // Return updated Set
      });
    } else {
      console.warn("No valid assets_class found in selectedAcm");
    }
  };

  useEffect(() => {
    // Convert the Set back to an array and filter out undefined values
    const updatedFunds = Array.from(selectedAssets).filter(
      (fund) => fund !== undefined,
    ); // Remove undefined values
    // Fetch asset data after updating funds
    if (updatedFunds.length > 0) {
      fetchAsset(updatedFunds);
    }
  }, [selectedAssets]);

  useEffect(() => {
    const fetchSiteData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`,
      );
      if (res.ok) {
        const data = await res.json();
        setSiteData(data[0]);
      } else {
        console.error("Failed to fetch site settings");
      }
    };
    fetchSiteData();
  }, []);

  const fetchAsset = async (funds) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/get-sub-assets?subAssetClass=${funds}`,
      );
      setSchemesData(response); // Update the state with fetched schemes
    } catch (error) {
      console.error("Error fetching schemes data:", error);
    }
  };

  const fetchSchemes = async (selectedAcm) => {
    // Check if the fund is already in the array to avoid duplicates
    if (!funds?.includes(selectedAcm?.fund)) {
      // Append the new fund to the existing array
      setFunds((prevFunds) => [...prevFunds, selectedAcm?.fund]);
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/all-scheme?fund=${funds}`,
      );
      setSchemesData(response); // Update the state with fetched schemes
    } catch (error) {
      console.error("Error fetching schemes data:", error);
    }
  };

  const handleAcmSelect = (scheme) => {
    if (selectedAcms.includes(scheme)) {
      setSelectedAcms(selectedAcms.filter((s) => s !== scheme));
    } else {
      setSelectedAcms([...selectedAcms, scheme]);
      fetchSchemes(scheme); // Fetch schemes when an AMC is selected
    }
  };

  const handleSubmit = async () => {
    if (
      (selectedAcms.length === 0 && selectedAssets.size === 0) ||
      pcode.length === 0
    ) {
      toast({
        variant: "destructive",
        title: "Please select scheme",
      });
      setGraphData(false);
      setError(true); // Set error to show "Data Not Found"
      return; // Exit early to avoid API call
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/research-calculator/sip-performance`,
        {
          startDate: startsipDate,
          endDate: endsipDate,
          fundPcode: pcode,
          valuationAsOnDate: valuationDate,
          amount: Number(sipAmount),
        },
      );

      if (
        response.data.data == null ||
        Object.keys(response.data.data).length === 0
      ) {
        // Checks for null or undefined
        setGraphData(false);
        setError(true); // Set error to trigger "Data Not Found"
        setResult(null); // Clear result to prevent rendering stale data
      } else {
        setGraphData(true);
        setResult(response.data.data);
        setError(null); // Clear error
      }
    } catch (error) {
      console.error("Error fetching schemes data:", error);
      setGraphData(false);
      setError(true); // Set error to trigger "Data Not Found"
      setResult(null); // Clear result
      toast({
        variant: "destructive",
        title: "Failed to fetch data",
        description: error.message,
      });
    }
  };

  const handlePdf = async (result, title, startsipDate, valuationDate) => {
    const inputs = [
      { label: "Scheme Name", value: title },
      { label: "SIP Amount (Monthly)", value: sipAmount },
      { label: "Start Date", value: startsipDate },
      { label: "End Date", value: endsipDate },
      { label: "Valuation Date", value: valuationDate },
    ];
    generatePDF(
      result,
      title,
      inputs,
      startsipDate,
      valuationDate,
      "sip-performance-chart-pdf",
      sitedata,
      logoSrc
    );
  };

  return (
    <div className={styles.contactPage}>
      <InnerPage title={"SIP Performance"} />
      <div className="px-4">
        <div className="main-section">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-5">
              <CalculatorHeader
                title="SIP Performance"
                subtitle=""
                activeCalculator="SIP Performance"
                items={performance}
              />
            </div>
            <Toaster />
            <div>
              <div>
                <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl p-2 mb-3">
                  <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                    <div className="flex space-x-4 mb-8">
                      <div className="inline-flex items-center rounded-full border border-[var(--rv-primary)] bg-[var(--rv-bg-primary-light)] p-1">
                        <button
                          type="button"
                          onClick={() => (
                            setIsMonthlySip(true),
                            setSchemesData([]),
                            setGraphData(false),
                            setSelectedAcms([])
                          )}
                          className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${isMonthlySip
                            ? "bg-[var(--rv-primary)] text-white"
                            : "text-[var(--rv-primary)]"
                            }`}
                        >
                          Fund House
                        </button>
                        <button
                          type="button"
                          onClick={() => (
                            setIsMonthlySip(false),
                            setSchemesData([]),
                            setGraphData(false),
                            setSelectedAssets(new Set())
                          )}
                          className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${!isMonthlySip
                            ? "bg-[var(--rv-primary)] text-white"
                            : "text-[var(--rv-primary)]"
                            }`}
                        >
                          Asset Category
                        </button>
                      </div>
                    </div>
                    <div className="input-fields mt-5 mb-5">
                      {isMonthlySip ? (
                        <div className="w-full">
                          <h4 className="font-semibold ">Select AMC</h4>
                          <div className="max-w-full mt-2 border border-[var(--rv-primary)] p-3 rounded h-60 overflow-y-auto">
                            <input
                              type="text"
                              placeholder="Search Scheme"
                              className="w-full px-3 py-2 border border-[var(--rv-primary)] rounded mb-1 bg-transparent"
                              value={searchQuery}
                              onChange={(e) =>
                                setSearchQuery(e.target.value.toLowerCase())
                              } // Update search query
                            />
                            {/* Render filtered checkboxes for each AMC */}
                            {allAcmdata
                              ?.filter((scheme) =>
                                scheme?.funddes
                                  ?.toLowerCase()
                                  .includes(searchQuery),
                              )
                              .map((scheme, index) => (
                                <div
                                  key={index}
                                  className="flex items-center mb-1"
                                >
                                  <input
                                    type="checkbox"
                                    id={`acm-${index}`}
                                    checked={selectedAcms.includes(scheme)}
                                    onChange={() => handleAcmSelect(scheme)}
                                    className="mr-2"
                                  />
                                  <label
                                    htmlFor={`acm-${index}`}
                                    className=" text-sm"
                                  >
                                    {scheme?.funddes}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                          <div>
                            <h5 className="font-semibold ">
                              Select Equity Funds
                            </h5>
                            <div className="mt-2 border border-[var(--rv-primary)] p-3 rounded h-60 overflow-y-auto">
                              {/* Equity Funds checkboxes here */}
                              {assetCategory
                                ?.filter((item) => item.nav_c2 === "Equity")
                                .map((scheme, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center mb-1"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`asset-equity-${index}`}
                                      checked={selectedAssets.has(
                                        scheme.assets_class,
                                      )}
                                      onChange={() => handleAssetSelect(scheme)}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`asset-equity-${index}`}
                                      className=" text-sm"
                                    >
                                      Equity - {scheme?.assets_class}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold ">Select Debt Funds</h5>
                            <div className="mt-2 border border-[var(--rv-primary)] p-3 rounded h-60 overflow-y-auto">
                              {assetCategory
                                ?.filter((item) => item.nav_c2 === "Debt")
                                .map((scheme, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center mb-1"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`asset-debt-${index}`}
                                      checked={selectedAssets.has(
                                        scheme.assets_class,
                                      )}
                                      onChange={() => handleAssetSelect(scheme)}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`asset-debt-${index}`}
                                      className=" text-sm"
                                    >
                                      Debt - {scheme?.assets_class}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold ">
                              Select Hybrid Funds
                            </h5>
                            <div className="mt-2 border border-[var(--rv-primary)] p-3 rounded h-60 overflow-y-auto">
                              {/* Hybrid Funds checkboxes here */}
                              {assetCategory
                                ?.filter((item) => item.nav_c2 === "Hybrid")
                                .map((scheme, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center mb-1"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`asset-hybrid-${index}`}
                                      checked={selectedAssets.has(
                                        scheme.assets_class,
                                      )}
                                      onChange={() => handleAssetSelect(scheme)}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`asset-hybrid-${index}`}
                                      className=" text-sm"
                                    >
                                      Hybrid - {scheme?.assets_class}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold ">
                              Select Commodity Funds/ Others
                            </h5>
                            <div className="mt-2 border border-[var(--rv-primary)] p-3 rounded h-60 overflow-y-auto">
                              {assetCategory
                                ?.filter(
                                  (item) =>
                                    item.nav_c2 === "Other " ||
                                    item.nav_c2 === "Others" ||
                                    item.nav_c2 === "Sol Oriented",
                                )
                                .map((scheme, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center mb-1"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`asset-other-${index}`}
                                      checked={selectedAssets.has(
                                        scheme.assets_class,
                                      )}
                                      onChange={() => handleAssetSelect(scheme)}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`asset-other-${index}`}
                                      className=" text-sm"
                                    >
                                      Other - {scheme?.assets_class}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="mb-4">
                        <label
                          htmlFor="schemeSelect"
                          className="text-sm block font-semibold  mb-1"
                        >
                          Select Scheme
                        </label>
                        <select
                          id="schemeSelect"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-blue-500 focus:border-[var(--rv-blue)] block w-full p-2.5"
                          onChange={(e) => {
                            const selectedScheme = schemesData?.data?.find(
                              (scheme) => scheme.funddes === e.target.value,
                            );
                            setPcode(selectedScheme?.pcode);
                            setTitle(selectedScheme?.funddes);
                          }}
                        >
                          <option
                            value=""
                            selected
                          >
                            Choose a scheme
                          </option>
                          {!isMonthlySip ? (
                            schemesData ? (
                              schemesData &&
                              schemesData?.data?.map((scheme, index) => (
                                <option
                                  key={index}
                                  value={scheme?.funddes}
                                >
                                  {scheme?.funddes}
                                </option>
                              ))
                            ) : (
                              "Loading..."
                            )
                          ) : selectedAcms &&
                            selectedAcms.length > 0 &&
                            schemesData?.data ? (
                            schemesData.data
                              .filter((scheme) =>
                                selectedAcms.some(
                                  (acm) => acm.fund === scheme.fund,
                                ),
                              )
                              .map((scheme, index) => (
                                <option
                                  key={index}
                                  value={scheme.funddes}
                                >
                                  {scheme.funddes}
                                </option>
                              ))
                          ) : (
                            <option disabled>
                              Select...
                            </option>
                          )}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="schemeName"
                          className="text-sm block font-semibold  mb-1"
                        >
                          SIP Amount (Monthly)
                        </label>
                        <input
                          type="number"
                          id="schemeName"
                          placeholder="Enter scheme name"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-blue-500 focus:border-[var(--rv-blue)] block w-full p-2.5"
                          value={sipAmount}
                          onChange={(e) => setSipAmount(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="schemeDate"
                          className="text-sm block font-semibold  mb-1"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="schemeDate"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-blue-500 focus:border-[var(--rv-blue)] block w-full p-2.5"
                          value={startsipDate}
                          onChange={(e) => setStartSipDate(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="schemeDate"
                          className="text-sm block font-semibold  mb-1"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          id="schemeDate"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-blue-500 focus:border-[var(--rv-blue)] block w-full p-2.5"
                          min={startsipDate}
                          value={endsipDate}
                          onChange={(e) => setEndSipDate(e.target.value)}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <div className="mb-4">
                          <label
                            htmlFor="schemeDate"
                            className="text-sm block font-semibold  mb-1"
                          >
                            Valuation As On
                          </label>
                          <input
                            type="date"
                            id="schemeDate"
                            className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-blue-500 focus:border-[var(--rv-blue)] block w-full p-2.5"
                            min={endsipDate}
                            max={getTodayDate()}
                            value={valuationDate}
                            onChange={(e) => setValuationDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      text="Show"
                      className="bg-[var(--rv-primary)] text-[var(--rv-white)]"
                      onClick={() => handleSubmit()}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  {graphData && (
                    <div className="mb-5 flex flex-wrap gap-4 justify-between items-center">
                      <div className="inline-flex items-center rounded-full border border-[var(--rv-primary)] bg-[var(--rv-bg-primary-light)] p-1">
                        <button
                          type="button"
                          onClick={() => setViewBy("graph")}
                          className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${viewby === "graph"
                            ? "bg-[var(--rv-primary)] text-white"
                            : "text-[var(--rv-primary)]"
                            }`}
                        >
                          Graph
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewBy("table")}
                          className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${viewby === "table"
                            ? "bg-[var(--rv-primary)] text-white"
                            : "text-[var(--rv-primary)]"
                            }`}
                        >
                          Table
                        </button>
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-full bg-[var(--rv-bg-secondary)] px-4 py-2 text-[var(--rv-white)] hover:bg-[var(--rv-bg-primary)] transition-all duration-300"
                        onClick={() =>
                          handlePdf(result, title, startsipDate, valuationDate)
                        }
                      >
                        <BsFileEarmarkPdf className="text-lg" />
                        <span className="font-semibold text-sm">Download Report</span>
                      </button>
                    </div>
                  )}

                  {/* Hidden Chart for PDF Generation */}
                  {graphData && result && (
                    <div
                      id="sip-performance-chart-pdf"
                      style={{
                        position: "absolute",
                        left: "-9999px",
                        top: 0,
                        width: "800px",
                        height: "400px",
                        zIndex: -1,
                      }}
                    >
                      <SipPerformanceChart
                        piedata={result}
                        startDate={startsipDate}
                        endDate={valuationDate}
                        title={title}
                      />
                    </div>
                  )}

                  {graphData && result && (viewby === "graph" ? (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 my-10">
                        <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                          <p className="font-semibold text-xs whitespace-nowrap">
                            Amount Invested
                          </p>
                          <h6 className="font-medium text-sm">
                            {result?.valuation?.investedAmount}
                          </h6>
                        </div>
                        <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                          <p className="font-semibold text-xs whitespace-nowrap">
                            Current Value
                          </p>
                          <h6 className="font-medium text-sm">
                            {result?.valuation?.currentAssetValue}
                          </h6>
                        </div>
                        <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                          <p className="font-semibold text-xs whitespace-nowrap">
                            Profit/Loss
                          </p>
                          <h6 className="font-medium text-sm">
                            {result?.valuation?.pl}
                          </h6>
                        </div>
                        <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                          <p className="font-semibold text-xs whitespace-nowrap">
                            MONTHLY SIP
                          </p>
                          <h6 className="font-medium text-sm">
                            {result?.valuation?.sipAmout}
                          </h6>
                        </div>
                        <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                          <p className="font-semibold text-xs whitespace-nowrap">
                            Current NAV
                          </p>
                          <h6 className="font-medium text-sm">
                            {result?.valuation?.currentNav}
                          </h6>
                        </div>
                        <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                          <p className="font-semibold text-xs whitespace-nowrap">
                            Absolute Return(%)
                          </p>
                          <h6 className="font-medium text-sm">
                            {result?.valuation?.absoluteReturns}
                          </h6>
                        </div>
                        <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                          <p className="font-semibold text-xs whitespace-nowrap">XIRR (%)</p>
                          <h6 className="font-medium text-sm">
                            {result?.valuation?.xirrRate}
                          </h6>
                        </div>
                      </div>
                      <div id="graphId">
                        <SipPerformanceChart
                          piedata={result}
                          startDate={startsipDate}
                          endDate={valuationDate}
                          title={title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <SipPerformanceTable data={result} />
                    </div>
                  ))}
                  {error && !graphData && (
                    <div className="">Data Not Found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

