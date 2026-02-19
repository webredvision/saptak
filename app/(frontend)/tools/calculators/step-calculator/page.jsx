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
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function Page() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [investmentDuration, setInvestmentDuration] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(5);
  const [stepUpPercentage, setStepUpPercentage] = useState(5);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ["Invested Amount", "Growth", "Total Future Value"],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue,
      sipInvestment: result.wealthGained,
      inputs: [
        { label: "Monthly Investment (?)", value: monthlyInvestment },
        { label: "Time Period (Years)", value: investmentDuration },
        { label: "Expected Return (%)", value: expectedReturn },
        { label: "Annual Step-up (%)", value: stepUpPercentage },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "Step-up Calculator",
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

  const calculateStepUpSip = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/stepup-calculator?monthlyInvestment=${monthlyInvestment}&investmentDuration=${investmentDuration}&expectedReturn=${expectedReturn}&annualStepupPercentage=${stepUpPercentage}`,
      );
      if (res.status === 200) {
        const data = res.data;
        setResult({
          totalInvestment: Math.round(data.totalInvestment),
          futureValue: Math.round(data.futureValue),
          wealthGained: Math.round(data.futureValue - data.totalInvestment),
        });
        setIsAuthorised(true);
        setChartData(data.yearlyData);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateStepUpSip();
  }, [monthlyInvestment, investmentDuration, expectedReturn, stepUpPercentage]);

  const chartConfig = {
    invested: { label: "Invested Amount", color: "var(--rv-primary)" },
    return: { label: "Growth", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Invested Amount", color: "var(--rv-primary)" },
    growth: { label: "Growth", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"Step Up Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Step Up Calculator"
            subtitle="Step Up SIP"
            onDownload={() => handlePdf(result)}
            activeCalculator="Step Up Calculator"
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
                <div className="container mx-auto sticky top-4 z-10">
                  <div className="mt-5 mb-10 space-y-5">
                    <Slider
                      label="Monthly investment (?)"
                      min={500}
                      max={100000}
                      step={500}
                      value={monthlyInvestment}
                      setValue={setMonthlyInvestment}
                    />
                    <Slider
                      label="Time period (Years)"
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
                    <Slider
                      label="Step-up Rate (%)"
                      min={1}
                      max={30}
                      step={1}
                      value={stepUpPercentage}
                      setValue={setStepUpPercentage}
                    />
                  </div>

                  {result && (
                    <ResultDisplay
                      results={[
                        {
                          label: "Invested Amount",
                          value: result.totalInvestment,
                        },
                        { label: "Growth", value: result.wealthGained },
                        {
                          label: "Total Future Value",
                          value: result.futureValue,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <div className="mb-3" id="chartGraph">
                  <div className="mb-3" id="chartGraph">
                    {result && (
                      <SippieChart
                        piedata={{
                          totalInvestment: result.totalInvestment,
                          futureValue: result.wealthGained, // Passing gain as 'return'
                        }}
                        title="Step Up Projection"
                        chartConfig={chartConfig}
                      />
                    )}
                  </div>
                </div>
                <div id="barGraph">
                  <CalculatorReturnChart
                    data={chartData}
                    chartConfig={chartConfig1}
                    title="Step-Up Growth"
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
                You're not allowed to access this tool
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

