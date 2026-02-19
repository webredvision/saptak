"use client";
import React, { useEffect, useState } from "react";
import { planning } from "@/data/calculators";
import { useRouter } from "next/navigation";
import { SippieChart } from "@/app/components/charts/sippiechart";
import RetrementBarChart from "@/app/components/charts/retirementReturnChart";
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
import axios from "axios";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function RetirementCalculator() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentlyMonth, setCurrentlyMonth] = useState(40000);
  const [inflationRate, setInflationRate] = useState(7);
  const [preRetirementReturn, setPreRetirementReturn] = useState(14);
  const [postRetirementReturn, setPostRetirementReturn] = useState(7);
  const [inflationPostRetirement, setInflationPostRetirement] = useState(5);

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState({
    years: [],
    principal: [],
    interested: [],
    balance: [],
  });
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async () => {
    if (!result) return;
    const pdfResult = {
      labels: [
        "Future Monthly Expenses",
        "Required Corpus At Retirement",
        "Planning Through SIP",
        "Planning Through Lump Sum",
      ],
      totalInvestment: result.totalMonthlyExpenses,
      futureValue: result.totalLumpsumCorpus,
      sipInvestment: result.totalThroughSip,
      lumpsumInvestment: result.totalThroughLumpsum,
      inputs: [
        { label: "Current Age (Years)", value: currentAge },
        { label: "Retirement Age (Years)", value: retirementAge },
        { label: "Life Expectancy (Years)", value: lifeExpectancy },
        { label: "Current Monthly Expenses (?)", value: currentlyMonth },
        { label: "Inflation Rate (%)", value: inflationRate },
        { label: "Pre-Retirement Return (%)", value: preRetirementReturn },
        { label: "Post-Retirement Return (%)", value: postRetirementReturn },
        {
          label: "Post-Retirement Inflation (%)",
          value: inflationPostRetirement,
        },
      ],
    };
    generateCalculatorsPDF(
      pdfResult,
      "Retirement Planning",
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

  const calculateRetirement = () => {
    const age = Number(currentAge);
    const rAge = Number(retirementAge);
    const lExp = Number(lifeExpectancy);
    const exp = Number(currentlyMonth);
    const inf = Number(inflationRate) / 100;
    const preRet = Number(preRetirementReturn) / 100;
    const postRet = Number(postRetirementReturn) / 100;

    const duration = rAge - age;
    const retirementDuration = lExp - rAge;

    // Future Monthly Expense
    const futureMonthlyExp = Math.round(exp * Math.pow(1 + inf, duration));
    const annualFutureExp = futureMonthlyExp * 12;

    // Corpus Required at Retirement (Growing Annuity PV)
    // Formula: PV = P * (1 - ((1+G)/(1+R))^n) / (R-G)
    // Here G = inf, R = postRet
    const netReturn = (1 + postRet) / (1 + inf) - 1;
    let requiredCorpus = 0;
    if (netReturn !== 0) {
      requiredCorpus = Math.round(
        annualFutureExp *
        (1 + netReturn) *
        ((1 - Math.pow(1 + netReturn, -retirementDuration)) / netReturn),
      );
    } else {
      requiredCorpus = annualFutureExp * retirementDuration;
    }

    // Planning through Lumpsum (PV)
    const lumpsumNeeded = Math.round(
      requiredCorpus / Math.pow(1 + preRet, duration),
    );

    // Planning through SIP (PMT)
    const monthlyPreRet = preRet / 12;
    const months = duration * 12;
    const sipNeeded = Math.round(
      requiredCorpus /
      (((Math.pow(1 + monthlyPreRet, months) - 1) / monthlyPreRet) *
        (1 + monthlyPreRet)),
    );

    setResult({
      totalMonthlyExpenses: futureMonthlyExp,
      totalLumpsumCorpus: requiredCorpus,
      totalThroughSip: sipNeeded,
      totalThroughLumpsum: lumpsumNeeded,
    });

    // Generate Chart Data
    const yearsArr = [];
    const principalArr = [];
    const balanceArr = [];
    const monthArr = [];

    let currentCorpus = requiredCorpus;
    let currentAnnualExp = annualFutureExp;

    for (let i = 0; i <= retirementDuration; i++) {
      yearsArr.push(`Age-${rAge + i}`);
      principalArr.push(currentAnnualExp);
      monthArr.push(Math.round(currentAnnualExp / 12));

      const balanceAfterExp = currentCorpus - currentAnnualExp;
      const bGrowth = Math.round(balanceAfterExp * postRet);
      const yearEndBalance = Math.max(0, balanceAfterExp + bGrowth);

      balanceArr.push(yearEndBalance);

      currentCorpus = yearEndBalance;
      currentAnnualExp = Math.round(currentAnnualExp * (1 + inf));
      if (currentCorpus <= 0) break;
    }

    setChartData({
      years: yearsArr,
      principal: principalArr,
      interested: monthArr,
      balance: balanceArr,
    });
  };

  useEffect(() => {
    if (firstLoad) {
      setLoading(true);
      calculateRetirement();
      setLoading(false);
      setFirstLoad(false);
    } else {
      calculateRetirement();
    }
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentlyMonth,
    inflationRate,
    preRetirementReturn,
    postRetirementReturn,
  ]);

  return (
    <div>
      <InnerPage title={"Retirement Planning Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Retirement Planning Calculator"
            subtitle="Future Income Planning"
            onDownload={handlePdf}
            activeCalculator="Retirement Planning Calculator"
            items={planning}
          />

          {loading ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 animate-pulse p-4">
              <div className="border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-5 space-y-5">
                {[...Array(6)].map((_, i) => (
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
                      label="Current Age (Y)"
                      min={18}
                      max={Math.min(retirementAge - 1, 60)}
                      step={1}
                      value={currentAge}
                      setValue={setCurrentAge}
                    />
                    <Slider
                      label="Retirement Age (Y)"
                      min={Math.max(currentAge + 1, 40)}
                      max={Math.min(lifeExpectancy - 1, 80)}
                      step={1}
                      value={retirementAge}
                      setValue={setRetirementAge}
                    />
                    <Slider
                      label="Life Expectancy (Y)"
                      min={Math.max(retirementAge + 1, 60)}
                      max={100}
                      step={1}
                      value={lifeExpectancy}
                      setValue={setLifeExpectancy}
                    />
                    <Slider
                      label="Monthly Expenses (?)"
                      min={5000}
                      max={1000000}
                      step={1000}
                      value={currentlyMonth}
                      setValue={setCurrentlyMonth}
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
                      label="Pre-Retirement Return (%)"
                      min={1}
                      max={30}
                      step={0.1}
                      value={preRetirementReturn}
                      setValue={setPreRetirementReturn}
                    />
                    <Slider
                      label="Post-Retirement Return (%)"
                      min={1}
                      max={20}
                      step={0.1}
                      value={postRetirementReturn}
                      setValue={setPostRetirementReturn}
                    />
                  </div>

                  {result && (
                    <ResultDisplay
                      results={[
                        {
                          label: "Future Monthly Expenses",
                          value: result.totalMonthlyExpenses,
                        },
                        {
                          label: "Required Corpus At Retirement",
                          value: result.totalLumpsumCorpus,
                        },
                        {
                          label: "Planning Through SIP",
                          value: result.totalThroughSip,
                        },
                        {
                          label: "Planning Through Lump Sum",
                          value: result.totalThroughLumpsum,
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
                      totalInvestment: Number(currentlyMonth),
                      futureValue: Number(result?.totalMonthlyExpenses || 0),
                    }}
                    title={"Future & Current Monthly Expenses Breakup"}
                    customLabels={{
                      invested: "Current Monthly Expenses",
                      return: "Future Monthly Expenses",
                    }}
                  />
                </div>
                <div
                  className="  overflow-hidden bg-[var(--rv-bg-surface)] shadow-md "
                  id="barGraph"
                >
                  <RetrementBarChart
                    years={chartData.years}
                    Intrested={chartData.interested}
                    principalBarAmount={chartData.principal}
                    balance={chartData.balance}
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

