"use client";
import React, { useEffect, useState } from "react";
import { SippieChart } from "@/app/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/app/components/charts/calculatorReturnChart";
import axios from "axios";
import { planning } from "@/data/calculators";
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
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function VacationPlanningCalculator() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [totalInvestment, setCurrentExpenses] = useState(100000);
  const [investmentDuration, setInvestmentDuration] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async () => {
    if (!result) return;
    const calResult = {
      labels: [
        "Current Cost of Vacation",
        "Future Cost of Vacation",
        "Planning Through SIP",
        "Planning Through Lump Sum",
      ],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue,
      sipInvestment: result.sipInvestment,
      lumpsumInvestment: result.lumpsumInvestment,
      inputs: [
        { label: "Current Cost of Vacation (?)", value: totalInvestment },
        { label: "After How Many Years?", value: investmentDuration },
        { label: "Expected Return (%)", value: expectedReturn },
        { label: "Inflation Rate (%)", value: inflationRate },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "Vacation Plan Calculator",
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
        if (res.status === 200) setSiteData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSiteData();
  }, []);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/vacation-plan?planHolidayInYears=${investmentDuration}&currentExpense=${totalInvestment}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}`,
      );
      if (res.status === 200) {
        const data = res.data;
        setResult({
          totalInvestment: data.totalInvestment,
          futureValue: Math.round(data.futureVacationCost),
          lumpsumInvestment: Math.round(data.lumpsumInvestment),
          sipInvestment: Math.round(data.sipInvestment),
        });
        setChartData(data.yearlyData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (firstLoad) {
      fetchData(true);
      setFirstLoad(false);
    } else {
      fetchData();
    }
  }, [totalInvestment, investmentDuration, expectedReturn, inflationRate]);

  const chartConfig = {
    invested: { label: "Current Cost", color: "var(--rv-primary)" },
    return: { label: "Future Cost", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Current Cost", color: "var(--rv-primary)" },
    growth: { label: "Future Cost", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"Vacation Plan Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Vacation Plan Calculator"
            subtitle="Holiday Planning"
            onDownload={handlePdf}
            activeCalculator="Vacation Plan Calculator"
            items={planning}
          />

          {loading && firstLoad ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 animate-pulse p-4">
              <div className="border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-5 space-y-5 sticky top-4 z-10">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-72 w-full rounded-2xl" />
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-4">
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
                <div className="container mx-auto sticky top-4 z-10">
                  <div className="mt-5 mb-10 space-y-5">
                    <Slider
                      label="Current Vacation Expenses (?)"
                      min={10000}
                      max={1000000}
                      step={1000}
                      value={totalInvestment}
                      setValue={setCurrentExpenses}
                    />
                    <Slider
                      label="Years Until Vacation"
                      min={1}
                      max={30}
                      step={1}
                      value={investmentDuration}
                      setValue={setInvestmentDuration}
                    />
                    <Slider
                      label="Expected Return (%)"
                      min={1}
                      max={30}
                      step={0.1}
                      value={expectedReturn}
                      setValue={setExpectedReturn}
                    />
                    <Slider
                      label="Inflation Rate (%)"
                      min={1}
                      max={20}
                      step={0.1}
                      value={inflationRate}
                      setValue={setInflationRate}
                    />
                  </div>

                  {result && (
                    <ResultDisplay
                      results={[
                        {
                          label: "Current Cost of Vacation",
                          value: result.totalInvestment,
                        },
                        {
                          label: "Future Cost of Vacation",
                          value: result.futureValue,
                        },
                        {
                          label: "Planning Through SIP",
                          value: result.sipInvestment,
                        },
                        {
                          label: "Planning Through Lump Sum",
                          value: result.lumpsumInvestment,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>
              <div className="col-span-1 space-y-6 sticky top-4 z-10">
                <div
                  className="border border-[var(--rv-primary)] rounded-3xl overflow-hidden bg-[var(--rv-bg-surface)] shadow-md"
                  id="chartGraph"
                >
                  <SippieChart
                    piedata={result}
                    title={"Current & Future Cost Of Vacation Breakup"}
                    chartConfig={chartConfig}
                  />
                </div>
                <div className="mt-4" id="barGraph">
                  <CalculatorReturnChart
                    data={chartData}
                    title={"Vacation Planning"}
                    chartConfig={chartConfig1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

