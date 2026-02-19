"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { generateCalculatorsPDF } from "@/lib/generatePdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import CalculatorHeader from "@/app/components/calculators/CalculatorHeader";
import { useRouter } from "next/navigation";
import { calculator } from "@/data/calculators";
import { SippieChart } from "@/app/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/app/components/charts/calculatorReturnChart";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function Page() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [currentAge, setCurrentAge] = useState(25);
  const [crorepatiStartAge, setCrorepatiStartAge] = useState(45);
  const [targetWealth, setTargetWealth] = useState(50000000);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const normalizeYearlyData = (yearlyData) => {
    if (!Array.isArray(yearlyData)) return [];
    return yearlyData.map((item, index) => {
      const year =
        item?.year ??
        item?.age ??
        item?.label ??
        item?.period ??
        item?.time ??
        index + 1;
      const investedAmount =
        Number(
          item?.investedAmount ??
          item?.totalInvestment ??
          item?.invested ??
          item?.investment ??
          item?.sipInvestment ??
          item?.amountInvested ??
          item?.currentValue ??
          0,
        ) || 0;
      const futureValue =
        Number(
          item?.futureValue ??
          item?.finalValue ??
          item?.targetValue ??
          item?.totalValue ??
          item?.amount ??
          item?.value ??
          item?.projectedValue ??
          0,
        ) || 0;
      const growth =
        Number(
          item?.growth ??
          item?.return ??
          item?.wealthGained ??
          (futureValue ? Math.max(futureValue - investedAmount, 0) : 0),
        ) || 0;

      return { year, investedAmount, growth };
    });
  };

  const handlePdf = async (result) => {
    let calResult = {
      labels: [
        "Your Targeted Wealth (Inflation Adjusted)",
        "Growth of Savings",
        "Monthly SIP Amount Required",
        "Amount Invested through SIP in 20 years",
        "SIP Growth",
        "Future Value of SIP",
      ],
      values: [
        result.futureTargetWealth,
        result.growthOfSavings,
        result.sipInvestmentRequired,
        result.totalSIPInvestment,
        result.sipGrowth,
        result.sipFutureValue,
      ],
      totalInvestment: result.futureTargetWealth,
      futureValue: result.growthOfSavings,
      sipInvestment: result.sipInvestmentRequired,
      lumpsumInvestment: result.totalSIPInvestment,
      inputs: [
        { label: "Target Wealth (?)", value: targetWealth },
        { label: "Current Age (Years)", value: currentAge },
        { label: "Crorepati Age (Years)", value: crorepatiStartAge },
        { label: "Expected Return (%)", value: expectedReturn },
        { label: "Inflation Rate (%)", value: inflationRate },
        { label: "Current Savings (?)", value: currentSavings },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "Crorepati Planning Calculator",
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

  const calculateCrorepatiPlan = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/crorepati-calculator?currentAge=${currentAge}&crorepatiAge=${crorepatiStartAge}&targetedWealth=${targetWealth}&currentSavings=${currentSavings}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}`,
      );

      if (res.status === 200) {
        const data = res.data;
        setResult({
          futureTargetWealth: Math.round(data.futureTargetWealth || 0),
          growthOfSavings: Math.round(data.savingsGrowth || 0),
          finalTargetWealth: Math.round(data.finalTargetWealth || 0),
          sipInvestmentRequired: Math.round(data.sipInvestmentRequired || 0),
          totalSIPInvestment: Math.round(data.totalSIPInvestment || 0),
          sipGrowth: Math.round(data.sipGrowth || 0),
          sipFutureValue: Math.round(data.sipFutureValue || 0),
        });
        setChartData(normalizeYearlyData(data.yearlyData));
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (firstLoad) {
      calculateCrorepatiPlan(true);
      setFirstLoad(false);
    } else {
      calculateCrorepatiPlan();
    }
  }, [
    currentAge,
    crorepatiStartAge,
    targetWealth,
    currentSavings,
    expectedReturn,
    inflationRate,
  ]);

  const chartConfig = {
    invested: { label: "Invested", color: "var(--rv-primary)" },
    return: { label: "Wealth Gained", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Invested", color: "var(--rv-primary)" },
    growth: { label: "Future Value", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"Crorepati Planning Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Crorepati Calculator"
            subtitle=""
            onDownload={() => handlePdf(result)}
            activeCalculator="Crorepati Calculator"
          />

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
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
                    <div className="input-fields mt-5 mb-10">
                      <Slider
                        label="Target Wealth (?)"
                        min={1000000}
                        max={1000000000}
                        step={100000}
                        value={targetWealth}
                        setValue={setTargetWealth}
                      />
                      <Slider
                        label="Current Age"
                        min={1}
                        max={80}
                        step={1}
                        value={currentAge}
                        setValue={setCurrentAge}
                      />
                      <Slider
                        label="Age at the Time of Crorepati"
                        min={10}
                        max={100}
                        step={1}
                        value={crorepatiStartAge}
                        setValue={setCrorepatiStartAge}
                      />
                      <Slider
                        label="Rate of Return (%)"
                        min={1}
                        max={30}
                        step={1}
                        value={expectedReturn}
                        setValue={setExpectedReturn}
                      />
                      <Slider
                        label="Inflation Rate (%)"
                        min={1}
                        max={20}
                        step={1}
                        value={inflationRate}
                        setValue={setInflationRate}
                      />
                      <Slider
                        label="Current Savings (?)"
                        min={10000}
                        max={1000000000}
                        step={10000}
                        value={currentSavings}
                        setValue={setCurrentSavings}
                      />
                    </div>

                    {result && (
                      <ResultDisplay
                        results={[
                          {
                            label: "Targeted Wealth (Inflation Adjusted)",
                            value: result.futureTargetWealth,
                          },
                          {
                            label: "Growth of Savings",
                            value: result.growthOfSavings,
                          },
                          {
                            label: "Monthly SIP Required",
                            value: result.sipInvestmentRequired,
                          },
                          {
                            label: `Invested in ${crorepatiStartAge - currentAge} years`,
                            value: result.totalSIPInvestment,
                          },
                          { label: "SIP Growth", value: result.sipGrowth },
                          {
                            label: "Future Value of SIP",
                            value: result.sipFutureValue,
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
                  <div className="mb-3" id="chartGraph">
                    <SippieChart
                      piedata={{
                        totalInvestment: result?.totalSIPInvestment,
                        futureValue: result?.sipGrowth,
                      }}
                      title="Crorepati Planning Projection"
                      chartConfig={chartConfig}
                    />
                  </div>
                  <div id="barGraph">
                    <CalculatorReturnChart
                      data={chartData}
                      chartConfig={chartConfig1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

