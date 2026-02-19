"use client";
import React, { useEffect, useState } from "react";
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
  const [investedAmount, setInvestedAmount] = useState(10000);
  const [withdrawalAmount, setWithdrawalAmount] = useState(500);
  const [transferPeriod, setTransferPeriod] = useState(5);
  const [expectedReturnSource, setExpectedReturnSource] = useState(5);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: [
        "Total Investment",
        "Total Withdrawal",
        "Total Growth",
        "Current Value",
      ],
      totalInvestment: result.investedAmount,
      futureValue: result.balanceInSourceFund,
      sipInvestment: result.amountTransferredToDestinationFund,
      lumpsumInvestment: result.resultantAmount,
      inputs: [
        { label: "Lumpsum Invested Amount (?)", value: investedAmount },
        { label: "SWP Withdrawal Amount (?)", value: withdrawalAmount },
        { label: "Time Period (Years)", value: transferPeriod },
        { label: "Expected Return (%)", value: expectedReturnSource },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "SWP Calculator",
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

  const calculateSWP = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/swp-calculator?investedAmount=${investedAmount}&withdrawalAmount=${withdrawalAmount}&timePeriod=${transferPeriod}&expectedReturn=${expectedReturnSource}`,
      );
      if (res.status === 200) {
        const data = res.data;
        setChartData(data.yearlyData);
        setResult({
          investedAmount: data.totalInvestment || 0,
          balanceInSourceFund: Math.round(data.totalWithdrawn || 0),
          amountTransferredToDestinationFund: Math.round(data.totalGrowth || 0),
          resultantAmount: Math.round(data.currentValue || 0),
        });
        setIsAuthorised(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSWP();
  }, [investedAmount, withdrawalAmount, transferPeriod, expectedReturnSource]);

  const chartConfig = {
    invested: { label: "Total Investment", color: "var(--rv-primary)" },
    return: { label: "Total Growth", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Total Investment", color: "var(--rv-primary)" },
    growth: { label: "Current Value", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"SWP Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="SWP Calculator"
            subtitle="Systematic Withdrawal Plan"
            onDownload={() => handlePdf(result)}
            activeCalculator="SWP Calculator"
          />

          {loading ? (
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 p-2">
              {/* Left Column: Inputs & Results */}
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
                <div className="container mx-auto sticky top-4 z-10">
                  <Slider
                    label="Lumpsum Invested Amount (?)"
                    min={10000}
                    max={10000000}
                    step={500}
                    value={investedAmount}
                    setValue={setInvestedAmount}
                  />
                  <Slider
                    label="SWP Withdrawal Amount (?)"
                    min={500}
                    max={100000}
                    step={500}
                    value={withdrawalAmount}
                    setValue={setWithdrawalAmount}
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
                    label="Expected Rate of Return (%)"
                    min={1}
                    max={30}
                    step={1}
                    value={expectedReturnSource}
                    setValue={setExpectedReturnSource}
                  />

                  {result && (
                    <ResultDisplay
                      results={[
                        {
                          label: "Total Investment",
                          value: result.investedAmount,
                        },
                        {
                          label: "Total Withdrawal",
                          value: result.balanceInSourceFund,
                        },
                        {
                          label: "Total Growth",
                          value: result.amountTransferredToDestinationFund,
                        },
                        { label: "Current Value", value: result.resultantAmount },
                      ]}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Charts */}
              <div className="col-span-1">
                <div className="mb-4" id="chartGraph">
                  <SippieChart
                    piedata={{
                      totalInvestment: result?.investedAmount,
                      futureValue: result?.amountTransferredToDestinationFund,
                    }}
                    title={"SWP Calculator"}
                    chartConfig={chartConfig}
                  />
                </div>
                <div id="barGraph">
                  <CalculatorReturnChart
                    data={chartData}
                    title={"SWP Calculator"}
                    chartConfig={chartConfig1}
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
                You're not authorised to view this content
              </p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

