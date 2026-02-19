"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { generateCalculatorsPDF } from "@/lib/generatePdf";
import { BsFileEarmarkPdf } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import CalculatorHeader from "@/app/components/calculators/CalculatorHeader";
import { SippieChart } from "@/app/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/app/components/charts/calculatorReturnChart";
import { planning } from "@/data/calculators";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function DelayCostCalculator() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [monthlySIP, setMonthlySIP] = useState(5000);
  const [timePeriod, setTimePeriod] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [delayMonths, setDelayMonths] = useState(6);

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async () => {
    const calResult = {
      ...result,
      inputs: [
        { label: "Monthly Investment (?)", value: monthlySIP },
        { label: "Investment Duration (Years)", value: timePeriod },
        { label: "Expected Return (%)", value: expectedReturn },
        { label: "Delay (Months)", value: delayMonths },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "Delay Cost Calculator",
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
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/delay-calculator`,
        {
          params: {
            monthlyInvestment: monthlySIP,
            investmentDuration: timePeriod,
            expectedReturn: expectedReturn,
            delayInMonths: delayMonths,
          },
        },
      );
      if (res.status === 200) {
        const data = res.data;
        setResult({
          labels: [
            "Total Value",
            "Future Value without Delay",
            "Cost of Delay in Future Value",
            "Future Value after Delay",
          ],
          totalInvestment: Math.round(data.totalAmountInvested),
          futureValue: Math.round(data.futureValueWithoutDelay),
          lumpsumInvestment: Math.round(data.futureValueAfterDelay),
          sipInvestment: Math.round(data.costOfDelay),
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
  }, [monthlySIP, timePeriod, expectedReturn, delayMonths]);

  const chartConfig = {
    invested: { label: "Total Value", color: "var(--rv-primary)" },
    return: {
      label: "Future Value without Delay",
      color: "var(--rv-secondary)",
    },
  };

  const chartConfig1 = {
    investedAmount: { label: "Total Value", color: "var(--rv-primary)" },
    growth: {
      label: "Future Value without Delay",
      color: "var(--rv-secondary)",
    },
  };

  return (
    <div>
      <InnerPage title="Delay Cost Calculator" />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Delay Cost Calculator"
            subtitle="Cost of Delay"
            onDownload={handlePdf}
            activeCalculator="Delay Planning Calculator"
            items={planning}
          />

          {loading && firstLoad ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 animate-pulse p-4">
              <div className="border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-5 space-y-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
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
                      label="Monthly SIP (?)"
                      min={500}
                      max={100000}
                      step={500}
                      value={monthlySIP}
                      setValue={setMonthlySIP}
                    />
                    <Slider
                      label="Time Period (Years)"
                      min={1}
                      max={30}
                      step={1}
                      value={timePeriod}
                      setValue={setTimePeriod}
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
                      label="Delay in Starting SIP (Months)"
                      min={0}
                      max={24}
                      step={1}
                      value={delayMonths}
                      setValue={setDelayMonths}
                    />
                  </div>

                  {result && (
                    <ResultDisplay
                      results={[
                        { label: "Total Value", value: result.totalInvestment },
                        {
                          label: "Future Value without Delay",
                          value: result.futureValue,
                        },
                        {
                          label: "Cost of Delay in Future Value",
                          value: result.sipInvestment,
                        },
                        {
                          label: "Future Value after Delay",
                          value: result.lumpsumInvestment,
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
                    title="Delay Planning Projection"
                    chartConfig={chartConfig}
                  />
                </div>
                <div className="mt-4" id="barGraph">
                  <CalculatorReturnChart
                    data={chartData}
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

