"use client";
import React from "react";
import { cn } from "@/lib/utils";

const ResultDisplay = ({ results, className }) => {
  return (
    <div
      className={cn(
        "mt-5 space-y-4 bg-[var(--rv-bg-surface)] p-5 rounded-2xl border border-[var(--rv-border)]",
        className,
      )}
    >
      {results.map((item, i) => (
        <div key={i} className="last:mb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-2 mb-2">
            <p className="text-[var(--rv-text-muted)] opacity-80 text-sm md:text-base font-medium">
              {item.label}
            </p>
            <p className="font-bold text-lg md:text-xl text-[var(--rv-primary)]">
              ₹{Math.floor(item.value)?.toLocaleString("en-IN")}
            </p>
          </div>
          {i < results.length - 1 && (
            <div className="h-[1px] w-full bg-[var(--rv-border)] opacity-50" />
          )}
        </div>
      ))}
    </div>
  );
};

export { ResultDisplay };


