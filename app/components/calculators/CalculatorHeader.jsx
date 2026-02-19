"use client";
import React from "react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { CalculatorSelect } from "@/app/components/calculators/CalculatorSelect";
import { calculator } from "@/data/calculators";
import { useRouter } from "next/navigation";

export default function CalculatorHeader({
  title,
  subtitle,
  onDownload,
  activeCalculator,
  items = calculator,
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end border-b border-black/60 pb-6">
      <div className="flex flex-col gap-2">
        <h2 className="  font-bold text-[var(--rv-text)] uppercase tracking-tight">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {subtitle && (
            <p className="   text-[var(--rv-text-muted)] uppercase tracking-widest font-bold">
              {subtitle}
            </p>
          )}

          {onDownload && (
            <div className="flex items-center gap-3">
              {subtitle && (
                <div className="hidden sm:block h-1 w-1 rounded-full bg-[var(--rv-text-muted)]/40" />
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onDownload}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--rv-primary)] text-[var(--rv-primary)] bg-[var(--rv-bg-surface)] hover:bg-[var(--rv-primary)] hover:text-[var(--rv-white)] transition-all font-bold uppercase tracking-wider group w-fit shadow-sm"
                    >
                      <BsFileEarmarkPdf
                        size={14}
                        className="group-hover:scale-110 transition-transform"
                      />
                      Download Report
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[var(--rv-bg-black)] text-[var(--rv-white)] border-[var(--rv-white-light)]   uppercase font-bold tracking-widest">
                    <p>Generate Detailed PDF</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Dropdown */}
      <CalculatorSelect
        label="Explore other calculators"
        items={items}
        placeholder={activeCalculator || "Select Calculator"}
        onChange={(value) => router.push(value)}
      />
    </div>
  );
}
