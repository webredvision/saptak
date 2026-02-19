"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import { SippieChart } from "@/app/components/charts/sippiechart";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";

const parseNumber = (value) => {
  if (value === null || value === undefined) return null;
  const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const getExpectedReturn = (data) => {
  const candidates = [
    data?.three_year,
    data?.threeYear,
    data?.prev3YearPer,
    data?.one_year,
    data?.oneYear,
    data?.prevYearPer,
    data?.si,
    data?.sinceInceptionReturn,
  ];
  for (const value of candidates) {
    const parsed = parseNumber(value);
    if (parsed !== null && parsed !== 0) return parsed;
  }
  return 12;
};

const sanitizeText = (value) => {
  if (!value) return "";
  return String(value).replace(/\?/g, " ").replace(/\s+/g, " ").trim();
};

export function SipCalculator({ data, embedded = false, variant = "default" }) {
  const router = useRouter();
  const [roboUser, setRoboUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [oneTimeInvestment, setOneTimeInvestment] = useState(5000);
  const [investmentDuration, setInvestmentDuration] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [investAmount, setInvestAmount] = useState("");
  const [showInvestPopup, setShowInvestPopup] = useState(false);
  const [result, setResult] = useState(null);
  const [isMonthlySip, setIsMonthlySip] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!data) return;
    const minAmountRaw = parseNumber(data?.sip_minimum_installment_amount);
    if (minAmountRaw) {
      setMonthlyInvestment(minAmountRaw);
    }
    setExpectedReturn(getExpectedReturn(data));
  }, [data]);

  useEffect(() => {
    const fetchRoboUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo`,
        );
        if (res.data.success) {
          setRoboUser(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching Robo User:", error);
      }
    };
    fetchRoboUser();
  }, []);

  useEffect(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = investmentDuration * 12;

    if (isMonthlySip) {
      const futureValue =
        monthlyRate === 0
          ? monthlyInvestment * months
          : monthlyInvestment *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);
      const totalInvestment = monthlyInvestment * months;
      setResult({
        futureValue: Math.round(futureValue),
        totalInvestment: Math.round(totalInvestment),
        wealthGained: Math.round(futureValue - totalInvestment),
      });
    } else {
      const futureValue = oneTimeInvestment * Math.pow(1 + monthlyRate, months);
      const totalInvestment = oneTimeInvestment;
      setResult({
        futureValue: Math.round(futureValue),
        totalInvestment: Math.round(totalInvestment),
        wealthGained: Math.round(futureValue - totalInvestment),
      });
    }
  }, [
    monthlyInvestment,
    oneTimeInvestment,
    investmentDuration,
    expectedReturn,
    isMonthlySip,
  ]);

  const handleInvestSubmit = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/get-minimum-amount`,
        {
          schemeCode: data?.pcode,
          arn_id: roboUser?.arnId,
        },
      );

      const minAmount = res?.data?.data?.data?.[data?.pcode] || 0;
      const enteredAmount = parseFloat(investAmount);

      if (!enteredAmount || enteredAmount <= 0) {
        setErrorMessage("Please enter a valid investment amount.");
        return;
      }

      if (enteredAmount < minAmount) {
        setErrorMessage(`Minimum investment amount is ₹${minAmount}.`);
        return;
      }
      const maxAllowed = isMonthlySip ? 100000 : 10000000;
      if (enteredAmount > maxAllowed) {
        setErrorMessage(
          isMonthlySip
            ? "Maximum SIP amount is ₹1,00,000."
            : "Maximum investment amount is ₹1,00,00,000.",
        );
        return;
      }

      const funds = [
        {
          pcode: data?.pcode,
          allocation: "100",
          allocationAmount: enteredAmount,
        },
      ];

      const investmentData = {
        arnid: roboUser?.arnId,
        arnnumber: roboUser?.arnNumber,
        totalAmount: enteredAmount,
        funds,
      };

      localStorage.setItem("investmentData", JSON.stringify(investmentData));
      localStorage.setItem("selectedFundPcode", data?.pcode || "");
      localStorage.setItem("selectedFundAmount", String(enteredAmount));

      setShowInvestPopup(false);
      setInvestAmount("");
      setErrorMessage("");
      router.push("/login");
    } catch (error) {
      console.error("Error fetching minimum amount:", error);
      setErrorMessage(
        "Failed to fetch minimum investment amount. Please try again.",
      );
    }
  };

  const chartConfig = useMemo(
    () => ({
      invested: { label: "Total Investment", color: "var(--rv-primary)" },
      return: { label: "Wealth Gained", color: "var(--rv-secondary)" },
    }),
    [],
  );

  const isFundVariant = variant === "fund";

  return (
    <div className={embedded ? "space-y-5" : "sip-calculator space-y-5"}>
      {isFundVariant ? (
        <div className="rounded-2xl border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] p-4 space-y-4 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold uppercase text-[var(--rv-text)]">
              SIP Calculator
            </h3>
          </div>
          <div className="flex w-full gap-2 rounded-full bg-[var(--rv-bg-secondary-light)] p-1">
            <Button
              variant={isMonthlySip ? "primary" : "outline"}
              onClick={() => setIsMonthlySip(true)}
              className={
                isMonthlySip
                  ? "text-[var(--rv-white)] rounded-full px-4 flex-1"
                  : "border-[var(--rv-border)] text-[var(--rv-text)] rounded-full px-4 flex-1"
              }
            >
              Monthly SIP
            </Button>
            <Button
              variant={!isMonthlySip ? "primary" : "outline"}
              onClick={() => setIsMonthlySip(false)}
              className={
                !isMonthlySip
                  ? "text-[var(--rv-white)] rounded-full px-4 flex-1"
                  : "border-[var(--rv-border)] text-[var(--rv-text)] rounded-full px-4 flex-1"
              }
            >
              One-Time Investment
            </Button>
          </div>

          <div className="space-y-4">
            {isMonthlySip ? (
              <Slider
                label="Monthly Investment (₹)"
                min={500}
                max={100000}
                step={500}
                value={monthlyInvestment}
                setValue={setMonthlyInvestment}
              />
            ) : (
              <Slider
                label="Total Investment (₹)"
                min={500}
                max={10000000}
                step={1000}
                value={oneTimeInvestment}
                setValue={setOneTimeInvestment}
              />
            )}
            <Slider
              label="Investment Duration (Years)"
              min={1}
              max={40}
              step={1}
              value={investmentDuration}
              setValue={setInvestmentDuration}
            />
          </div>

          {result && (
            <ResultDisplay
              className={
                embedded ? "border-none bg-transparent p-0" : undefined
              }
              results={[
                { label: "Invested Amount", value: result.totalInvestment },
                { label: "Wealth Gained", value: result.wealthGained },
                { label: "Expected Amount", value: result.futureValue },
              ]}
            />
          )}

          <div className="mt-auto flex justify-center items-center">
            {roboUser ? (
              <Button
                variant="primary"
                className="px-8"
                onClick={() => setShowInvestPopup(true)}
              >
                Purchase Now
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="primary" className="px-8">
                  Purchase Now
                </Button>
              </Link>
            )}
          </div>
          {result && (
            <div className=" border-t ">
              <SippieChart
                piedata={result}
                title="Investment Split"
                chartConfig={chartConfig}
                className={
                  embedded
                    ? "border-none bg-transparent shadow-none"
                    : undefined
                }
                containerClassName="aspect-square max-h-[240px]"
                showLabels={false}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="flex w-full gap-2 rounded-full bg-[var(--rv-bg-secondary-light)] p-1">
              <Button
                variant={isMonthlySip ? "primary" : "outline"}
                onClick={() => setIsMonthlySip(true)}
                className={
                  isMonthlySip
                    ? "text-[var(--rv-white)] rounded-full px-4 flex-1"
                    : "border-[var(--rv-border)] text-[var(--rv-text)] rounded-full px-4 flex-1"
                }
              >
                Monthly SIP
              </Button>
              <Button
                variant={!isMonthlySip ? "primary" : "outline"}
                onClick={() => setIsMonthlySip(false)}
                className={
                  !isMonthlySip
                    ? "text-[var(--rv-white)] rounded-full px-4 flex-1"
                    : "border-[var(--rv-border)] text-[var(--rv-text)] rounded-full px-4 flex-1"
                }
              >
                One-Time Investment
              </Button>
            </div>

            {isMonthlySip ? (
              <Slider
                label="Monthly Investment (₹)"
                min={500}
                max={100000}
                step={500}
                value={monthlyInvestment}
                setValue={setMonthlyInvestment}
              />
            ) : (
              <Slider
                label="Total Investment (₹)"
                min={500}
                max={10000000}
                step={1000}
                value={oneTimeInvestment}
                setValue={setOneTimeInvestment}
              />
            )}
            <Slider
              label="Investment Duration (Years)"
              min={1}
              max={40}
              step={1}
              value={investmentDuration}
              setValue={setInvestmentDuration}
            />
          </div>

          {result && (
            <ResultDisplay
              className={
                embedded ? "border-none bg-transparent p-0" : undefined
              }
              results={[
                { label: "Invested Amount", value: result.totalInvestment },
                { label: "Wealth Gained", value: result.wealthGained },
                { label: "Expected Amount", value: result.futureValue },
              ]}
            />
          )}
        </>
      )}

      <Dialog open={showInvestPopup} onOpenChange={setShowInvestPopup}>
        <DialogContent className="max-w-xl bg-[var(--rv-bg-surface)] text-[var(--rv-text)] border-[var(--rv-border)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--rv-text)]">
              {sanitizeText(data?.funddes)}
            </DialogTitle>
            <DialogTitle className="text-lg text-[var(--rv-text-muted)]">
              {isMonthlySip ? "Enter SIP Amount" : "Enter Lumpsum Amount"}
            </DialogTitle>
          </DialogHeader>

          <div>
            <Input
              type="number"
              min={1}
              max={isMonthlySip ? 100000 : 10000000}
              placeholder={
                isMonthlySip ? "Enter SIP Amount" : "Enter Lumpsum Amount"
              }
              value={investAmount}
              onChange={(e) => {
                const raw = e.target.value;
                const numeric = Number(raw);
                if (!raw) {
                  setInvestAmount("");
                  return;
                }
                const maxAllowed = isMonthlySip ? 100000 : 10000000;
                setInvestAmount(String(Math.min(numeric, maxAllowed)));
              }}
            />
            {errorMessage && (
              <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              id="disclaimerCheckbox"
              type="checkbox"
              className="mt-1 h-4 w-4 text-[var(--rv-primary)] border-gray-300 rounded focus:ring-[var(--rv-primary)]"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            <label
              htmlFor="disclaimerCheckbox"
              className="text-start text-sm text-[var(--rv-text-muted)] leading-snug"
            >
              I understand this is factual information only and I am investing
              at my own discretion.
              <br />
              This transaction is execution-only, and the distributor has not
              provided investment advice.
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="primary"
              className="text-[var(--rv-white)]"
              onClick={handleInvestSubmit}
              disabled={!isConfirmed}
            >
              Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {!isFundVariant && (
        <div className="flex justify-center items-center">
          {roboUser ? (
            <Button
              variant="primary"
              className="px-8"
              onClick={() => setShowInvestPopup(true)}
            >
              Purchase Now
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="primary" className="px-6">
                Purchase Now
              </Button>
            </Link>
          )}
        </div>
      )}

      {!isFundVariant && result && (
        <SippieChart
          piedata={result}
          title="Investment Split"
          chartConfig={chartConfig}
          className={
            embedded ? "border-none bg-transparent shadow-none" : undefined
          }
          containerClassName="aspect-square max-h-[300px]"
          showLabels={false}
        />
      )}
    </div>
  );
}
