"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { generateCalculatorsPDF } from "@/lib/generatePdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import CalculatorHeader from "@/app/components/calculators/CalculatorHeader";
import { calculator } from "@/data/calculators";
import { SippieChart } from "@/app/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/app/components/charts/calculatorReturnChart";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import { Skeleton } from "@/app/components/ui/skeleton";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function Page() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sourceFundAmount, setSourceFundAmount] = useState(10000);
  const [transferToFundAmount, setTransferToFundAmount] = useState(500);
  const [transferPeriod, setTransferPeriod] = useState(5);
  const [expectedReturnSource, setExpectedReturnSource] = useState(5);
  const [expectedReturnDestination, setExpectedReturnDestination] = useState(5);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: [
        "Invested Amount",
        "Balance in Source Fund",
        "Amount Transferred to Destination Fund",
        "Expected Amount",
      ],
      totalInvestment: result.totalInvestment,
      futureValue: result.balanceInSourceFund,
      sipInvestment: result.amountTransferredToDestinationFund,
      lumpsumInvestment: result.futureValue,
      inputs: [
        { label: "Source Fund Investment (?)", value: sourceFundAmount },
        { label: "Transfer to Destination (?)", value: transferToFundAmount },
        { label: "Transfer Period (Years)", value: transferPeriod },
        { label: "Expected Return - Source (%)", value: expectedReturnSource },
        {
          label: "Expected Return - Destination (%)",
          value: expectedReturnDestination,
        },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "STP Calculator",
      "2023-01-01",
      "2023-12-31",
      "chartGraph",
      "barGraph",
      sitedata,
      logoSrc
    );
  };

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`,
        );
        if (res.status === 200) {
          setSiteData(res.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSiteData();
  }, []);

  const calculateSTP = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/stp-calculator?sourceFundAmount=${sourceFundAmount}&transferToFundAmount=${transferToFundAmount}&transferPeriod=${transferPeriod}&expectedReturnSource=${expectedReturnSource}&expectedReturnDestination=${expectedReturnDestination}`,
      );
      if (res.status === 200) {
        const data = res.data;
        setResult({
          totalInvestment: data.investedAmount,
          balanceInSourceFund: Math.round(data.futureValueSourceFund),
          amountTransferredToDestinationFund: data.totalTransferred,
          futureValue: Math.round(data.resultantAmount),
        });
        setChartData(data.yearlyData);
        setIsAuthorised(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [
    sourceFundAmount,
    transferToFundAmount,
    transferPeriod,
    expectedReturnSource,
    expectedReturnDestination,
  ]);

  useEffect(() => {
    calculateSTP();
  }, [calculateSTP]);

  const chartConfig = {
    invested: { label: "Invested Amount", color: "var(--rv-primary)" },
    return: { label: "Resultant Amount", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Invested Amount", color: "var(--rv-primary)" },
    growth: { label: "Resultant Amount", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"STP Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="STP Calculator"
            subtitle="Systematic Transfer Plan"
            onDownload={() => handlePdf(result)}
            activeCalculator="STP Calculator"
          />

          {loading && initialLoad ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 animate-pulse p-4">
              <div className="border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-5 space-y-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-72 w-full rounded-2xl" />
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          ) : isAuthorised ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
                <div className="container mx-auto sticky top-4 z-10">
                  <Slider
                    label="I want to invest in Source Fund (?)"
                    min={500}
                    max={10000000}
                    step={500}
                    value={sourceFundAmount}
                    setValue={setSourceFundAmount}
                  />
                  <Slider
                    label="I want to transfer to Destination Fund (?)"
                    min={500}
                    max={100000}
                    step={500}
                    value={transferToFundAmount}
                    setValue={setTransferToFundAmount}
                  />
                  <Slider
                    label="For a period of (years)"
                    min={1}
                    max={30}
                    step={1}
                    value={transferPeriod}
                    setValue={setTransferPeriod}
                  />
                  <Slider
                    label="Expected Rate of Return from Source Fund (%)"
                    min={1}
                    max={30}
                    step={1}
                    value={expectedReturnSource}
                    setValue={setExpectedReturnSource}
                  />
                  <Slider
                    label="Expected Rate of Return from Destination Fund (%)"
                    min={1}
                    max={30}
                    step={1}
                    value={expectedReturnDestination}
                    setValue={setExpectedReturnDestination}
                  />

                  {result && (
                    <ResultDisplay
                      results={[
                        {
                          label: "Invested Amount",
                          value: result.totalInvestment,
                        },
                        {
                          label: "Balance in Source Fund",
                          value: result.balanceInSourceFund,
                        },
                        {
                          label: "Amount Transferred to Destination Fund",
                          value: result.amountTransferredToDestinationFund,
                        },
                        { label: "Expected Amount", value: result.futureValue },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1 space-y-4">
                <div id="chartGraph">
                  <SippieChart
                    piedata={{
                      totalInvestment: result?.totalInvestment,
                      futureValue: result?.futureValue,
                    }}
                    title="STP Calculator"
                    chartConfig={chartConfig}
                  />
                </div>
                <div id="barGraph">
                  <CalculatorReturnChart
                    chartConfig={chartConfig1}
                    data={chartData}
                    title="STP Calculator"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-20">
              <span className="font-bold text-[var(--rv-red-dark)] text-6xl mb-3">
                403
              </span>
              <p className="font-medium text-2xl text-[var(--rv-text)]">
                You're not authorized to view this content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

