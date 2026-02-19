"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/Button/Button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { generateStpPDF } from "@/lib/generatePdf";
import { StpPerformanceChart } from "@/app/components/charts/stpPerformanceChart";
import StpPerformanceTofundTable from "@/app/components/stpPerformanceTofundTable";
import StpPerformanceFromfundTable from "@/app/components/stpPerformanceFromfundTable";
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
  const [valuationDate, setValuationDate] = useState("2020-10-14");
  const [initialAmount, setInitialAmount] = useState(100000);
  const [transferAmount, setTransferAmount] = useState(1000);
  const [pcode, setPcode] = useState("");
  const [tofundpcode, setTofundPcode] = useState("");
  const [title, setTitle] = useState("");
  const [destinationTitle, setDestinationTitle] = useState("");
  const [viewby, setViewBy] = useState("graph");
  const [assetCategory, setAssetCategory] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [graphData, setGraphData] = useState(false);
  const [sitedata, setSiteData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const haldleSubmit = async () => {
    if (
      selectedAcms.length === 0 ||
      tofundpcode.length === 0 ||
      pcode.length === 0
    ) {
      toast({
        variant: "destructive",
        title: "Please select scheme",
      });
      setGraphData(false);
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/research-calculator/stp-performance`,
          {
            startDate: startsipDate,
            endDate: endsipDate,
            fromFundPcode: pcode,
            toFundPcode: tofundpcode,
            lumpsumInvestedDate: valuationDate,
            initialAmount: Number(initialAmount),
            transferAmount: Number(transferAmount),
          },
        );
        if (
          response.data.data == null ||
          Object.keys(response?.data?.data?.investedScheme).length === 0 ||
          Object.keys(response?.data?.data?.withdrawlingScheme).length === 0
        ) {
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

  const handlePdf = async (
    result,
    title,
    destinationTitle,
    startsipDate,
    valuationDate,
  ) => {
    const inputs = [
      { label: "Transfer From Scheme", value: title },
      { label: "Transfer To Scheme", value: destinationTitle },
      { label: "Initial Amount", value: initialAmount },
      { label: "Transfer Amount", value: transferAmount },
      { label: "Investment Date", value: valuationDate },
      { label: "Start Date", value: startsipDate },
      { label: "End Date", value: endsipDate },
    ];

    generateStpPDF(
      result,
      title,
      inputs,
      destinationTitle,
      startsipDate,
      endsipDate,
      "stp-performance-chart-pdf",
      sitedata,
      logoSrc
    );
  };

  return (
    <div className={styles.contactPage}>
      <InnerPage title={"STP Performance"} />
      <div className="px-4">
        <div className="main-section">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-5">
              <CalculatorHeader
                title="STP Performance"
                subtitle=""
                activeCalculator="STP Performance"
                items={performance}
              />
            </div>
            <Toaster />
            <div>
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl p-2 mb-3">
                <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                  {/* Investment Type Toggle */}
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
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="mt-2 overflow-y-auto p-2">
                      {/* Dropdown for selecting a scheme */}
                      <div className="mb-4">
                        <label
                          htmlFor="schemeSelect"
                          className="text-sm block font-semibold  mb-1"
                        >
                          Transfer From Scheme
                        </label>
                        <select
                          id="schemeSelect"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-2.5"
                          onChange={(e) => {
                            const selectedScheme = schemesData?.data.find(
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
                            <option disabled>Select...</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="mt-2 overflow-y-auto p-2">
                      {/* Dropdown for selecting a scheme */}
                      <div className="mb-4">
                        <label
                          htmlFor="schemeSelect"
                          className="text-sm block font-semibold  mb-1"
                        >
                          Transfer To Scheme
                        </label>
                        <select
                          id="schemeSelect"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-2.5"
                          onChange={(e) => {
                            const selectedScheme = schemesData?.data.find(
                              (scheme) => scheme.funddes === e.target.value,
                            );
                            setTofundPcode(selectedScheme?.pcode);
                            setDestinationTitle(selectedScheme?.funddes);
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
                            <option disabled>Select...</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="col-span-1 mt-2 overflow-y-auto p-2">
                      {/* Text input for scheme name */}
                      <div className="mb-4">
                        <label
                          htmlFor="schemeName"
                          className="text-sm block font-semibold  mb-1"
                        >
                          Initial Amount
                        </label>
                        <input
                          type="number"
                          id="schemeName"
                          placeholder="Enter scheme name"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-2.5"
                          value={initialAmount}
                          onChange={(e) => setInitialAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 mt-2 overflow-y-auto p-2">
                      {/* Text input for scheme name */}
                      <div className="mb-4">
                        <label
                          htmlFor="schemeName"
                          className="text-sm block font-semibold  mb-1"
                        >
                          Transfer Amount
                        </label>
                        <input
                          type="number"
                          id="schemeName"
                          placeholder="Enter scheme name"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-2.5"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Date input for selecting a date */}
                    <div className="col-span-1 mt-2 overflow-y-auto p-2">
                      <div className="mb-4">
                        <label
                          htmlFor="schemeDate"
                          className="text-sm block font-semibold  mb-1"
                        >
                          Investment Date
                        </label>
                        <input
                          type="date"
                          id="schemeDate"
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-2.5"
                          min={startsipDate}
                          max={getTodayDate()}
                          value={valuationDate}
                          onChange={(e) => setValuationDate(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Date input for selecting a date */}
                    <div className="col-span-1 mt-2 overflow-y-auto p-2">
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
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-2.5"
                          value={startsipDate}
                          onChange={(e) => setStartSipDate(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Date input for selecting a date */}
                    <div className="col-span-1 mt-2 overflow-y-auto p-2">
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
                          className="bg-transparent border border-[var(--rv-primary)] text-sm rounded-lg focus:ring-[var(--rv-primary)] focus:border-[var(--rv-primary)] block w-full p-2.5"
                          min={startsipDate}
                          value={endsipDate}
                          onChange={(e) => setEndSipDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    text="Show"
                    className="bg-[var(--rv-primary)] text-[var(--rv-white)]"
                    onClick={() => haldleSubmit()}
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
                        handlePdf(
                          result,
                          title,
                          destinationTitle,
                          startsipDate,
                          endsipDate,
                        )
                      }
                    >
                      <BsFileEarmarkPdf className="text-lg" />
                      <span className="font-semibold text-sm">Download Report</span>
                    </button>
                  </div>
                )}

                {/* Hidden chart for PDF */}
                {graphData && result && (
                  <div
                    id="stp-performance-chart-pdf"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: 0,
                      width: "800px",
                      height: "400px",
                      zIndex: -1,
                    }}
                  >
                    <StpPerformanceChart
                      piedata={result}
                      startDate={startsipDate}
                      endDate={endsipDate}
                      title={destinationTitle}
                      withdrawal={transferAmount}
                    />
                  </div>
                )}

                {graphData && (
                  // <div id="graphId">
                  <div>
                    <h3 className="text-center ">Source Fund</h3>
                    <h4 className="text-center font-semibold  mb-3">{title}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-7 gap-4">
                      <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                        <p className="font-semibold text-xs whitespace-nowrap">
                          Amount Invested
                        </p>
                        <h6 className="font-medium  text-sm">
                          {result?.withdrawlingScheme?.initialAmount}
                        </h6>
                      </div>
                      <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                        <p className="font-semibold text-xs whitespace-nowrap">
                          MONTHLY TRANSFER
                        </p>
                        <h6 className="font-medium  text-sm">
                          {transferAmount}
                        </h6>
                      </div>
                      <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                        <p className="font-semibold text-xs whitespace-nowrap">
                          TOTAL TRANSFER
                        </p>
                        <h6 className="font-medium  text-sm">
                          {result?.withdrawlingScheme?.totalWithdrawlAmount}
                        </h6>
                      </div>
                      <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                        <p className="font-semibold text-xs whitespace-nowrap">
                          SOURCE FUND BALANCE
                        </p>
                        <h6 className="font-medium  text-sm">
                          {result?.withdrawlingScheme?.fundRemaining}
                        </h6>
                      </div>
                      <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                        <p className="font-semibold text-xs whitespace-nowrap">
                          TRANSFERRED + BALANCE
                        </p>
                        <h6 className="font-medium  text-sm">
                          {result?.withdrawlingScheme?.portFolioValue}
                        </h6>
                      </div>
                      <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                        <p className="font-semibold text-xs whitespace-nowrap">XIRR (%)</p>
                        <h6 className="font-medium  text-sm">
                          {result?.withdrawlingScheme?.xirrRate}
                        </h6>
                      </div>
                    </div>

                    <h3 className="text-center ">Destination Fund</h3>
                    <h4 className="text-center font-semibold  mb-3">
                      {destinationTitle}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-7 gap-4">
                      <div className="py-2 px-1 border border-[var(--rv-primary)] shadow-sm rounded-lg text-center bg-[var(--rv-bg-white)]">
                        <p className="font-semibold  text-sm">
                          INSTALLMENT AMOUNT
                        </p>
                        <h6 className="font-medium  text-sm">
                          {
                            result?.investedScheme?.DestinationFundValuation
                              ?.installmentAmount
                          }
                        </h6>
                      </div>
                      <div className="py-2 px-3 border border-[var(--rv-primary)] shadow shadow-emerald-100 rounded-sm text-center">
                        <p className="font-semibold  text-sm">
                          AMOUNT TRANSFERRED FOR MONTH
                        </p>
                        <h6 className="font-medium  text-sm">
                          {
                            result?.investedScheme?.DestinationFundValuation
                              ?.amountTransferFormonth
                          }
                        </h6>
                      </div>
                      <div className="py-2 px-3 border border-[var(--rv-primary)] shadow shadow-emerald-100 rounded-sm text-center">
                        <p className="font-semibold  text-sm">
                          AMOUNT INVESTED
                        </p>
                        <h6 className="font-medium  text-sm">
                          {
                            result?.investedScheme?.DestinationFundValuation
                              ?.amountInvested
                          }
                        </h6>
                      </div>
                      <div className="py-2 px-3 border border-[var(--rv-primary)] shadow shadow-emerald-100 rounded-sm text-center">
                        <p className="font-semibold  text-sm">
                          VALUATION ON MATURITY
                        </p>
                        <h6 className="font-medium  text-sm">
                          {
                            result?.investedScheme?.DestinationFundValuation
                              ?.valuationAsOnMaturity
                          }
                        </h6>
                      </div>
                      <div className="py-2 px-3 border border-[var(--rv-primary)] shadow shadow-emerald-100 rounded-sm text-center">
                        <p className="font-semibold  text-sm">
                          ABSOLUTE RETURN (%)
                        </p>
                        <h6 className="font-medium  text-sm">
                          {
                            result?.investedScheme?.DestinationFundValuation
                              ?.absoluteReturns
                          }
                        </h6>
                      </div>
                      <div className="py-2 px-3 border border-[var(--rv-primary)] shadow shadow-emerald-100 rounded-sm text-center">
                        <p className="font-semibold  text-sm">XIRR (%)</p>
                        <h6 className="font-medium  text-sm">
                          {
                            result?.investedScheme?.DestinationFundValuation
                              ?.xirrRate
                          }
                        </h6>
                      </div>
                    </div>
                  </div>
                )}
                {result &&
                  (viewby === "graph" ? (
                    <div id="graphId">
                      {graphData && (
                        <StpPerformanceChart
                          piedata={result}
                          startDate={startsipDate}
                          endDate={endsipDate}
                          title={destinationTitle}
                          withdrawal={transferAmount}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="border border-[var(--rv-primary)] rounded-2xl p-5">
                      <h3 className="text-center ">Source Fund</h3>
                      <h4 className="text-center font-semibold  mb-3">
                        {title}
                      </h4>
                      {graphData && (
                        <StpPerformanceTofundTable
                          data={result}
                          title={title}
                        />
                      )}
                      <h3 className="text-center ">Destination Fund</h3>
                      <h4 className="text-center font-semibold  mb-3">
                        {destinationTitle}
                      </h4>
                      {graphData && (
                        <StpPerformanceFromfundTable
                          data={result}
                          title={title}
                        />
                      )}
                    </div>
                  ))}
                {error && <div>No Data Found</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
