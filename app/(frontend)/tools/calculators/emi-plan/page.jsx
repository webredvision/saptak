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
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(7);
  const [emi, setEmi] = useState(null);
  const [totalAmountPayable, setTotalAmountPayable] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sitedata, setSiteData] = useState();

  const handlePdf = async () => {
    let calResult = {
      labels: [
        "Loan EMI",
        "Principal Loan Amount",
        "Total Interest Payable",
        "Total Payment (Principal + Interest)",
      ],
      totalInvestment: emi,
      futureValue: loanAmount,
      sipInvestment: totalInterest,
      lumpsumInvestment: totalAmountPayable,
      inputs: [
        { label: "Loan Amount (?)", value: loanAmount },
        { label: "Loan Tenure (Years)", value: loanTenure },
        { label: "Interest Rate (%)", value: interestRate },
      ],
    };
    generateCalculatorsPDF(
      calResult,
      "EMI Calculator",
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

  useEffect(() => {
    const calculateEmi = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/emi-calculator?loanAmount=${loanAmount}&loanTenure=${loanTenure}&interestRate=${interestRate}`,
        );
        if (res.status === 200) {
          const data = res.data;
          setResult({
            principalamount: Math.round(data.principal || 0),
            intrestamount: Math.round(data.totalInterestPaid || 0),
          });
          setChartData(data.yearlyData);
          setEmi(Math.round(data.emiCalculated || 0));
          setTotalAmountPayable(Math.round(data.totalPayment || 0));
          setTotalInterest(Math.round(data.totalInterestPaid || 0));
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isInitial) setLoading(false);
      }
    };
    if (firstLoad) {
      calculateEmi(true);
      setFirstLoad(false);
    } else {
      calculateEmi();
    }
  }, [loanAmount, loanTenure, interestRate]);

  const chartConfig1 = {
    investedAmount: { label: "Principal Amount", color: "var(--rv-primary)" },
    growth: { label: "Interest Amount", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerPage title={"EMI Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="EMI Calculator"
            subtitle="Equated Monthly Installment"
            onDownload={() => handlePdf()}
            activeCalculator="EMI Calculator"
          />

          {loading && firstLoad ? (
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
          ) : (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-3xl bg-[var(--rv-bg-surface)] p-2 md:p-5 shadow-md">
                <div className="container mx-auto sticky top-4 z-10">
                  <div className="mt-5 mb-10 space-y-5">
                    <Slider
                      label="Loan Amount (?)"
                      min={100000}
                      max={100000000}
                      step={1000}
                      value={loanAmount}
                      setValue={setLoanAmount}
                    />
                    <Slider
                      label="Loan Tenure (Years)"
                      min={1}
                      max={40}
                      step={1}
                      value={loanTenure}
                      setValue={setLoanTenure}
                    />
                    <Slider
                      label="Interest Rate (%)"
                      min={1}
                      max={30}
                      step={0.1}
                      value={interestRate}
                      setValue={setInterestRate}
                    />
                  </div>

                  {emi && (
                    <ResultDisplay
                      results={[
                        { label: "Loan EMI", value: emi },
                        { label: "Principal Loan Amount", value: loanAmount },
                        { label: "Total Interest Payable", value: totalInterest },
                        {
                          label: "Total Payment (Principal + Interest)",
                          value: totalAmountPayable,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <div
                  className="rounded-3xl overflow-hidden bg-[var(--rv-bg-surface)] shadow-md"
                  id="chartGraph"
                >
                  <SippieChart
                    piedata={{
                      totalInvestment: result?.principalamount || 0,
                      futureValue: result?.intrestamount || 0,
                    }}
                    title={"EMI Breakdown"}
                    customLabels={{
                      invested: "Principal Amount",
                      return: "Interest Amount",
                    }}
                  />
                </div>
                <div className="mt-4" id="barGraph">
                  <CalculatorReturnChart
                    chartConfig={chartConfig1}
                    data={chartData}
                    title={"EMI Growth"}
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

