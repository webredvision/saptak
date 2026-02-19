"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/Button/Button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import { BsFileEarmarkPdf } from "react-icons/bs";
// import SipPerformanceTable from "@/app/components/SipPerformanceTable";
import { generateSchemePDF } from "@/lib/generatePdf";
import { SchemePerformanceChart } from "@/app/components/charts/schemePerformanceChart";
import SchemePerformanceTable from "@/app/components/schemePerformanceTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
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
  const [isMonthlyScheme, setIsMonthlyScheme] = useState(true);
  const [allAcmdata, setAllAcmdata] = useState([]);
  const [selectedAcms, setSelectedAcms] = useState([]);
  const [funds, setFunds] = useState([]);
  const [startSchemeDate, setStartSchemeDate] = useState("2021-10-14");
  const [endSchemeDate, setEndSchemeDate] = useState(getTodayDate());
  const [valuationDate, setValuationDate] = useState(getTodayDate());
  const [SchemeAmount, setSchemeAmount] = useState(10000);
  const [pcode, setPcode] = useState("");
  const [title, setTitle] = useState("");
  const [viewby, setViewBy] = useState("graph");
  const [assetCategory, setAssetCategory] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState(new Set());
  const [graphData, setGraphData] = useState(false);
  const [sensex, setSensex] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sitedata, setSiteData] = useState([]);

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

  // Handle selecting/deselecting AMCs
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
      pcode.length === 0 ||
      (selectedAcms.length === 0 && selectedAssets.size === 0)
    ) {
      toast({
        variant: "destructive",
        title: "Please select scheme",
      });
      setGraphData(false);
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/research-calculator/scheme-performance`,
          {
            fundPcode: pcode,
            investedAmount: Number(SchemeAmount),
            startDate: startSchemeDate,
            endDate: endSchemeDate,
            sensex: sensex,
            ppf: true,
            eventFlag: false,
          },
        );
        if (response.data.data == null) {
          setGraphData(false);
          setError(response.data);
        } else {
          setGraphData(true);
          setResult(response.data.data);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching schemes data:", error);
      }
    }
  };

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

  const tableResult = result?.sensex
    ? [
      {
        ...result,
        sensex: undefined,
        sensexGraphData: undefined,
        title: title,
      },
      {
        ...result.sensex,
        buyUnit: result.sensex.units,
        units: undefined,
        investedAmount: result.investedAmount,
        maturityDate: result.maturityDate,
        maturityValue: result.sensex.maturityAmount,
        maturityAmount: undefined,
        title: "Sensex",
      },
    ]
    : [
      {
        ...result,
        sensex: undefined,
        sensexGraphData: undefined,
        title: title,
      },
    ];

  const handlePdf = async (
    tableResult,
    title,
    startSchemeDate,
    valuationDate,
  ) => {
    const inputs = [
      { label: "Scheme Name", value: title },
      { label: "Scheme Amount", value: SchemeAmount },
      { label: "Start Date", value: startSchemeDate },
      { label: "End Date", value: endSchemeDate },
      { label: "Compare with Sensex", value: sensex ? "Yes" : "No" },
    ];
    generateSchemePDF(
      tableResult,
      title,
      inputs,
      startSchemeDate,
      valuationDate,
      "scheme-performance-chart-pdf",
      sitedata,
      logoSrc
    );
  };

  return (
    <div className={styles.contactPage}>
      <InnerPage title={"Scheme Performance"} />
      <div className="px-4">
        <div className="main-section">
          <div className="max-w-screen-xl mx-auto ">
            <Toaster />
            <div className="mb-5">
              <CalculatorHeader
                title="Scheme Performance"
                subtitle=""
                activeCalculator="Scheme Performance"
                items={performance}
              />
            </div>
            <div>
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-white)] p-6 mb-8 shadow-xl">
                <div className="Scheme-calculator container mx-auto p-3 sticky top-0 z-10">
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="inline-flex items-center rounded-full border border-[var(--rv-primary)] bg-[var(--rv-bg-primary-light)] p-1">
                      <button
                        type="button"
                        onClick={() => (
                          setIsMonthlyScheme(true),
                          setSchemesData([]),
                          setGraphData(false),
                          setSelectedAcms([])
                        )}
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${isMonthlyScheme
                          ? "bg-[var(--rv-primary)] text-white"
                          : "text-[var(--rv-primary)]"
                          }`}
                      >
                        Fund House
                      </button>
                      <button
                        type="button"
                        onClick={() => (
                          setIsMonthlyScheme(false),
                          setSchemesData([]),
                          setGraphData(false),
                          setSelectedAssets(new Set())
                        )}
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${!isMonthlyScheme
                          ? "bg-[var(--rv-primary)] text-white"
                          : "text-[var(--rv-primary)]"
                          }`}
                      >
                        Asset Category
                      </button>
                    </div>
                  </div>
                  <div className="input-fields mt-5 mb-5">
                    {isMonthlyScheme ? (
                      <div className="w-full">
                        <h4 className="   font-bold mb-4">Select AMC</h4>
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
                          <h5 className="font-semibold ">Select Equity Funds</h5>
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
                          <h5 className="font-semibold ">Select Hybrid Funds</h5>
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
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="mb-4">
                      <label
                        htmlFor="schemeSelect"
                        className="  font-bold uppercase tracking-widest text-[var(--rv-secondary)] mb-2 block"
                      >
                        Select Scheme
                      </label>
                      <select
                        id="schemeSelect"
                        className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-xl focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-3 transition-all outline-none"
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
                        {!isMonthlyScheme ? (
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
                            Loading...
                          </option>
                        )}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="schemeAmount"
                        className="  font-bold uppercase tracking-widest text-[var(--rv-secondary)] mb-2 block"
                      >
                        Scheme Amount (Monthly)
                      </label>
                      <input
                        type="number"
                        id="schemeAmount"
                        placeholder="Enter amount"
                        value={SchemeAmount}
                        onChange={(e) => setSchemeAmount(e.target.value)}
                        className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-xl focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-3 transition-all outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="schemeDateStart"
                        className="  font-bold uppercase tracking-widest text-[var(--rv-secondary)] mb-2 block"
                      >
                        {" "}
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="schemeDateStart"
                        className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-xl focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-3 transition-all outline-none"
                        value={startSchemeDate}
                        onChange={(e) => setStartSchemeDate(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="schemeDateEnd"
                        className="  font-bold uppercase tracking-widest text-[var(--rv-secondary)] mb-2 block"
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        id="schemeDateEnd"
                        className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-xl focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-3 transition-all outline-none"
                        min={startSchemeDate}
                        value={endSchemeDate}
                        onChange={(e) => setEndSchemeDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Date input for selecting a date */}
                  <div className="p-2">
                    <div className="p-2 mt-4">
                      <label
                        htmlFor="sensex"
                        className="text-sm block font-bold mb-3"
                      >
                        Compare Fund
                      </label>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="sensex"
                            className="w-5 h-5 rounded border-[var(--rv-primary)] bg-transparent text-[var(--rv-primary)] focus:ring-[var(--rv-primary)]"
                            checked={sensex}
                            onChange={(e) => setSensex((prev) => !prev)}
                          />
                        </div>
                        <label
                          htmlFor="sensex"
                          className="text-sm font-bold cursor-pointer"
                        >
                          BSE SENSEX
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button
                      text="Show Performance"
                      onClick={() => handleSubmit()}
                      className="w-full md:w-auto font-bold tracking-wider rounded-2xl transition-all duration-300"
                    />
                  </div>
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
                        handlePdf(
                          tableResult,
                          title,
                          startSchemeDate,
                          valuationDate,
                        )
                      }
                    >
                      <BsFileEarmarkPdf className="text-lg" />
                      <span className="font-semibold text-sm">Download Report</span>
                    </button>
                  </div>
                )}

                {/* Hidden chart for PDF */}
                {graphData && (
                  <div
                    id="scheme-performance-chart-pdf"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: 0,
                      width: "800px",
                      height: "400px",
                      zIndex: -1,
                    }}
                  >
                    <SchemePerformanceChart
                      data={result}
                      startDate={startSchemeDate}
                      endDate={valuationDate}
                      title={title}
                    />
                  </div>
                )}

                <div className="">
                  {result && viewby === "graph" ? (
                    graphData && (
                      <div className="">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 gap-y-2 my-10">
                          <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                            <h1 className="font-semibold  text-xs whitespace-nowrap">
                              Amount Invested
                            </h1>
                            <h6 className="font-medium text-sm">
                              {result?.investedAmount || 0}
                            </h6>
                          </div>
                          <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                            <h1 className="font-semibold  text-xs whitespace-nowrap">
                              Buy Units
                            </h1>
                            <h6 className="font-medium text-sm">
                              {result?.buyUnit || 0}
                            </h6>
                          </div>
                          <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                            <h1 className="font-semibold  text-xs whitespace-nowrap">
                              Profit/Loss
                            </h1>
                            <h6 className="font-medium text-sm">
                              {result?.maturityValue && result?.investedAmount
                                ? Math.floor(
                                  result.maturityValue -
                                  result.investedAmount,
                                )
                                : 0}
                            </h6>
                          </div>
                          <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                            <h1 className="font-semibold  text-xs whitespace-nowrap">
                              Maturity Rate
                            </h1>
                            <h6 className="font-medium text-sm">
                              {result?.RateAtMaturity || 0}
                            </h6>
                          </div>
                          <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                            <h1 className="font-semibold  text-xs whitespace-nowrap">
                              Maturity Value
                            </h1>
                            <h6 className="font-medium text-sm">
                              {result?.maturityValue || 0}
                            </h6>
                          </div>
                          <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                            <h1 className="font-semibold  text-xs whitespace-nowrap">
                              Absolute Return(%)
                            </h1>
                            <h6 className="font-medium text-sm">
                              {result?.absoluteReturns || 0}
                            </h6>
                          </div>
                          <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                            <h1 className="font-semibold  text-xs whitespace-nowrap">XIRR (%)</h1>
                            <h6 className="font-medium text-sm">
                              {result?.xirrRate || 0}
                            </h6>
                          </div>
                        </div>
                        <div id="graphId">
                          {graphData && (
                            <SchemePerformanceChart
                              data={result}
                              startDate={startSchemeDate}
                              endDate={valuationDate}
                              title={title}
                            />
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div>
                      {graphData && (
                        <SchemePerformanceTable
                          data={tableResult}
                          title={title}
                        />
                      )}
                    </div>
                  )}
                </div>
                {error && <div>No Data Found</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
