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
import { SippieChart } from "@/app/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/app/components/charts/calculatorReturnChart";
import { calculator } from "@/data/calculators";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";

export default function Page() {
  const router = useRouter();
  const [oneTimeInvestment, setOneTimeInvestment] = useState(500);
  const [investmentDuration, setInvestmentDuration] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [result, setResult] = useState(null);
  const [chartdata, setChartdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ["Invested Amount", "Wealth Gained", "Expected Amount"],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue - result.totalInvestment,
      sipInvestment: result.futureValue,
      inputs: [
        { label: "Total Investment (?)", value: oneTimeInvestment },
        { label: "Time Period (Years)", value: investmentDuration },
        { label: "Expected Return (%)", value: expectedReturn },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "Lumpsum Calculator",
      "2023-01-01",
      "2023-12-31",
      "chartGraph",
      "barGraph",
      sitedata,
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

  const calculateLumpsum = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/lumpsum-calculator`,
        {
          params: {
            oneTimeInvestment,
            investmentDuration,
            expectedReturn,
          },
        },
      );

      if (res.status === 200) {
        const data = res.data;
        // Default to 0 if data is missing to prevent NaN
        const futureValue = Number(data.futureValue) || 0;
        const totalInvestment = Number(data.totalInvestment) || 0;

        setResult({
          futureValue: Number(futureValue.toFixed(2)),
          totalInvestment: Number(totalInvestment.toFixed(2)),
        });
        setChartdata(data.yearlyData || []);
      }
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (firstLoad) {
      calculateLumpsum(true);
      setFirstLoad(false);
    } else {
      calculateLumpsum();
    }
  }, [oneTimeInvestment, investmentDuration, expectedReturn]);

  const chartConfig = {
    invested: { label: "Total Investment", color: "var(--rv-primary)" },
    return: { label: "Future Value", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Total Investment", color: "var(--rv-primary)" },
    growth: { label: "Future Value", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title="Lumpsum Calculator" />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Lumpsum Calculator"
            subtitle=""
            onDownload={() => handlePdf(result)}
            activeCalculator="Lumpsum Calculator"
          />

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            <div className="col-span-1 border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] rounded-3xl p-2 md:p-5 shadow-md">
              <div className="container mx-auto sticky top-4 z-10">
                {loading && firstLoad ? (
                  <div className="space-y-5 animate-pulse">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <Slider
                      label="Total Investment (?)"
                      min={500}
                      max={10000000}
                      step={100}
                      value={oneTimeInvestment}
                      setValue={setOneTimeInvestment}
                    />
                    <Slider
                      label="Time Period (Years)"
                      min={1}
                      max={40}
                      step={1}
                      value={investmentDuration}
                      setValue={setInvestmentDuration}
                    />
                    <Slider
                      label="Expected Return (%)"
                      min={1}
                      max={30}
                      step={1}
                      value={expectedReturn}
                      setValue={setExpectedReturn}
                    />

                    {result && (
                      <ResultDisplay
                        results={[
                          {
                            label: "Invested Amount",
                            value: result.totalInvestment,
                          },
                          {
                            label: "Wealth Gained",
                            value: result.futureValue - result.totalInvestment,
                          },
                          {
                            label: "Expected Amount",
                            value: result.futureValue,
                          },
                        ]}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="col-span-1">
              {loading && firstLoad ? (
                <div className="space-y-4 animate-pulse">
                  <Skeleton className="h-72 w-full rounded-2xl" />
                  <Skeleton className="h-80 w-full rounded-2xl" />
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div id="chartGraph">
                    <SippieChart
                      piedata={{
                        totalInvestment: result?.totalInvestment || 0,
                        futureValue:
                          (result?.futureValue || 0) -
                          (result?.totalInvestment || 0),
                      }}
                      title="Lumpsum Calculator"
                      chartConfig={chartConfig}
                    />
                  </div>
                  <div id="barGraph">
                    <CalculatorReturnChart
                      data={chartdata}
                      title="Lumpsum"
                      chartConfig={chartConfig1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div >
        </div >
      </div >
    </div >
  );
}

