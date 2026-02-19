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
import { Button } from "@/app/components/ui/button";
import useLogoSrc from "@/hooks/useLogoSrc";

// ✅ Main Page Component
export default function Page() {
  const logoSrc = useLogoSrc();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [investmentDuration, setInvestmentDuration] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [result, setResult] = useState(null);
  const [chartdata, setChartdata] = useState([]);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ["Invested Amount", "Growth", "Total Future Value"],
      totalInvestment: result.totalInvestment,
      futureValue: result.wealthGained,
      sipInvestment: result.futureValue,
      inputs: [
        { label: "Monthly Investment (?)", value: monthlyInvestment },
        { label: "Time Period (Years)", value: investmentDuration },
        { label: "Expected Return (%)", value: expectedReturn },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "SIP Calculator",
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

  const calculateSip = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/sip-calculator?monthlyInvestment=${monthlyInvestment}&investmentDuration=${investmentDuration}&expectedReturn=${expectedReturn}`,
      );

      if (res.status === 200) {
        const data = res.data;
        const futureValue = data.futureValue;
        const totalInvestment = data.totalInvestment;
        const yearlyData = data.yearlyData;

        setResult({
          futureValue: Number(futureValue.toFixed(2)),
          totalInvestment: Number(totalInvestment.toFixed(2)),
          wealthGained: Number((futureValue - totalInvestment).toFixed(2)),
        });
        setChartdata(yearlyData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (firstLoad) {
      calculateSip(true); // show skeleton only once
      setFirstLoad(false);
    } else {
      calculateSip(); // no skeleton after first load
    }
  }, [monthlyInvestment, investmentDuration, expectedReturn]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig = {
    invested: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Return Amount",
      color: "var(--rv-secondary)",
    },
  };

  const chartConfig1 = {
    investedAmount: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Return Amount",
      color: "var(--rv-secondary)",
    },
  };

  return (
    <div>
      <InnerPage title={"SIP Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          {/* Header */}
          <CalculatorHeader
            title="SIP Calculator"
            subtitle="Systematic Investment Plan"
            onDownload={() => handlePdf(result)}
            activeCalculator="SIP Calculator"
          />

          {/* Calculator Section */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
              <div className="sip-calculator container mx-auto sticky top-4 z-10">
                {loading ? (
                  <div className="space-y-5">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="input-fields mt-5 mb-10">
                      <Slider
                        label="Monthly investment (?)"
                        min={500}
                        max={100000}
                        step={100}
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
                  </>
                )}
              </div>
            </div>

            <div className="col-span-1">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div id="chartGraph">
                    <SippieChart
                      piedata={result}
                      title={"SIP Calculator"}
                      chartConfig={chartConfig}
                    />
                  </div>
                  <div id="barGraph">
                    <CalculatorReturnChart
                      data={chartdata}
                      title="SIP"
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

