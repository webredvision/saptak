"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { planning } from "@/data/calculators";
import { SippieChart } from "@/app/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/app/components/charts/calculatorReturnChart";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function LifeInsuranceCalculator() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [currentFdRate, setCurrentFdRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(6);
  const [protectionDuration, setProtectionDuration] = useState(20);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async () => {
    if (!result) return;
    let calResult = {
      labels: ["Total Insurance Cover", "Loan Repayment", "Household Expenses"],
      totalInvestment: result.totalInsuranceCover,
      futureValue: result.householdExpenses,
      sipInvestment: result.loanRepayment,
      inputs: [
        { label: "Loan Amount (?)", value: loanAmount },
        { label: "Current FD Rate (%)", value: currentFdRate },
        { label: "Inflation Rate (%)", value: inflationRate },
        { label: "Protection Duration (Years)", value: protectionDuration },
        { label: "Monthly Expenses (?)", value: monthlyExpenses },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "Life Insurance Planning Calculator",
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
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/life-insurance-calculator?loanAmount=${loanAmount}&currentFdRate=${currentFdRate}&protectionDuration=${protectionDuration}&inflationRate=${inflationRate}&monthlyExpenses=${monthlyExpenses}`,
      );
      if (res.status === 200) {
        const data = res.data;
        setResult({
          loanRepayment: data.loanAmount,
          householdExpenses: Math.round(data.totalHouseholdExpenses),
          totalInsuranceCover: Math.round(data.totalInsuranceCover),
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
    loanAmount,
    currentFdRate,
    inflationRate,
    protectionDuration,
    monthlyExpenses,
  ]);

  const chartConfig = {
    invested: { label: "Insurance Cover", color: "var(--rv-primary)" },
    return: { label: "Loan Repayment", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Insurance Cover", color: "var(--rv-primary)" },
    growth: { label: "Value", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"Life Insurance Planning Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Life Insurance Planning Calculator"
            subtitle=""
            onDownload={handlePdf}
            activeCalculator="Life Insurance Planning Calculator"
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-4">
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
                <div className="container mx-auto sticky top-4 z-10">
                  <div className="mt-5 mb-10 space-y-5">
                    <Slider
                      label="Loan Amount (?)"
                      min={0}
                      max={50000000}
                      step={100000}
                      value={loanAmount}
                      setValue={setLoanAmount}
                    />
                    <Slider
                      label="Current FD Rate (%)"
                      min={1}
                      max={15}
                      step={0.1}
                      value={currentFdRate}
                      setValue={setCurrentFdRate}
                    />
                    <Slider
                      label="Inflation Rate (%)"
                      min={1}
                      max={20}
                      step={0.1}
                      value={inflationRate}
                      setValue={setInflationRate}
                    />
                    <Slider
                      label="Protection Duration (Y)"
                      min={1}
                      max={40}
                      step={1}
                      value={protectionDuration}
                      setValue={setProtectionDuration}
                    />
                    <Slider
                      label="Monthly Expenses (?)"
                      min={5000}
                      max={1000000}
                      step={1000}
                      value={monthlyExpenses}
                      setValue={setMonthlyExpenses}
                    />
                  </div>

                  {result && (
                    <ResultDisplay
                      results={[
                        {
                          label: "Total Insurance Cover",
                          value: result.totalInsuranceCover,
                        },
                        { label: "Loan Repayment", value: result.loanRepayment },
                        {
                          label: "Household Expenses",
                          value: result.householdExpenses,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1 space-y-6">
                <div
                  className="border border-[var(--rv-primary)] rounded-3xl overflow-hidden bg-[var(--rv-bg-surface)] shadow-md"
                  id="chartGraph"
                >
                  <SippieChart
                    piedata={{
                      totalInvestment: result?.totalInsuranceCover,
                      futureValue: result?.loanRepayment,
                    }}
                    title={"Life Insurance Breakup"}
                    chartConfig={chartConfig}
                  />
                </div>
                <div className="mt-4" id="barGraph">
                  <CalculatorReturnChart
                    data={chartData}
                    title={"Life Insurance Coverage"}
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

