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

export default function EducationPlanningCalculator() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [currentAge, setCurrentAge] = useState(10);
  const [educationStartAge, setEducationStartAge] = useState(18);
  const [totalInvestment, setTotalInvestment] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(5);

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async () => {
    let calResult = {
      labels: [
        "Current Education Expenses",
        "Future Education Expenses",
        "Planning Through SIP",
        "Planning Through Lump Sum",
      ],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue,
      sipInvestment: result.sipInvestment,
      lumpsumInvestment: result.lumpsumInvestment,
      inputs: [
        { label: "Current Age (Years)", value: currentAge },
        { label: "Education Start Age (Years)", value: educationStartAge },
        { label: "Current Education Expenses (?)", value: totalInvestment },
        { label: "Expected Return (%)", value: expectedReturn },
        { label: "Inflation Rate (%)", value: inflationRate },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "Education Planning Calculator",
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

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/education-calculator?currentAge=${currentAge}&educationAge=${educationStartAge}&totalInvestment=${totalInvestment}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}`,
      );
      if (res.status === 200) {
        const data = res.data;
        setResult({
          totalInvestment,
          futureValue: Math.round(data.futureEducationCost),
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
  }, [
    currentAge,
    educationStartAge,
    totalInvestment,
    expectedReturn,
    inflationRate,
  ]);

  const chartConfig = {
    invested: { label: "Current Expenses", color: "var(--rv-primary)" },
    return: { label: "Future Expenses", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Current Expenses", color: "var(--rv-primary)" },
    growth: { label: "Future Expenses", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"Education Planning Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Education Planning Calculator"
            subtitle=""
            onDownload={handlePdf}
            activeCalculator="Education Planning Calculator"
            items={planning}
          />

          {loading && firstLoad ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 animate-pulse p-4">
              <div className="border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-5 space-y-5">
                {[...Array(5)].map((_, i) => (
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
                <div className="container mx-auto sticky top-4 z-10">
                  <div className="mt-5 mb-10 space-y-5">
                    <Slider
                      label="Current Age"
                      min={1}
                      max={30}
                      step={1}
                      value={currentAge}
                      setValue={setCurrentAge}
                    />
                    <Slider
                      label="Age at the Start of Education"
                      min={10}
                      max={50}
                      step={1}
                      value={educationStartAge}
                      setValue={setEducationStartAge}
                    />
                    <Slider
                      label="Current Education Expenses (?)"
                      min={100000}
                      max={10000000}
                      step={1000}
                      value={totalInvestment}
                      setValue={setTotalInvestment}
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
                      max={30}
                      step={0.1}
                      value={inflationRate}
                      setValue={setInflationRate}
                    />
                  </div>

                  {result && (
                    <ResultDisplay
                      results={[
                        {
                          label: "Current Education Expenses",
                          value: result.totalInvestment,
                        },
                        {
                          label: "Future Education Expenses",
                          value: result.futureValue,
                        },
                        {
                          label: "Planning Through Lumpsum",
                          value: result.lumpsumInvestment,
                        },
                        {
                          label: "Planning Through SIP",
                          value: result.sipInvestment,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <div
                  className="border border-[var(--rv-primary)] rounded-3xl overflow-hidden bg-[var(--rv-bg-surface)] shadow-md"
                  id="chartGraph"
                >
                  <SippieChart
                    piedata={result}
                    title={"Education Planning Projection"}
                    customLabels={{
                      invested: "Current Expenses",
                      return: "Future Expenses",
                    }}
                    chartConfig={chartConfig}
                  />
                </div>
                <div className="mt-4" id="barGraph">
                  <CalculatorReturnChart
                    title={"Education Plan"}
                    data={chartData}
                    chartType="line"
                    chartTitle="Education Planning Projection"
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

