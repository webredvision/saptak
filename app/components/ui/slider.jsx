"use client";
import React from "react";
import { cn } from "@/lib/utils";

const Slider = ({ label, min, max, step, value, setValue, className }) => {
    const formatNumber = (num) => {
        if (!num && num !== 0) return "";
        return num.toLocaleString("en-IN");
    };

    const clampValue = (num) => {
        const minValue = typeof min === "number" ? min : 0;
        const maxValue = typeof max === "number" ? max : Number.MAX_SAFE_INTEGER;
        return Math.min(Math.max(num, minValue), maxValue);
    };

    const handleChange = (e) => {
        const numericString = e.target.value.replace(/,/g, "").replace(/[^\d.]/g, "");
        const numericValue = parseFloat(numericString);
        if (!isNaN(numericValue)) {
            setValue(clampValue(numericValue));
        } else {
            setValue(clampValue(0));
        }
    };

    return (
        <div className={cn("mt-5", className)}>
            <div className="flex justify-between mb-2">
                <span className="text-[var(--rv-text)] font-medium">{label}</span>
                <input
                    type="text"
                    value={formatNumber(value)}
                    onChange={handleChange}
                    className="font-semibold bg-[var(--rv-bg-secondary-light)] text-[var(--rv-text)] w-32 border border-[var(--rv-border)] px-2 py-2 rounded-lg text-right focus:outline-none focus:ring-1 focus:ring-[var(--rv-primary)]"
                />
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={isNaN(value) ? 0 : value}
                onChange={(e) => setValue(clampValue(parseFloat(e.target.value)))}
                className="customRange w-full"
                style={{
                    "--progress": `${(((isNaN(value) ? 0 : value) - min) / (max - min)) * 100}%`,
                }}
            />
            <style jsx>{`
        .customRange {
          -webkit-appearance: none;
          height: 6px;
          background: var(--rv-border);
          border-radius: 5px;
          background-image: linear-gradient(var(--rv-primary), var(--rv-primary));
          background-size: var(--progress) 100%;
          background-repeat: no-repeat;
        }
        .customRange::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: var(--rv-primary);
          cursor: pointer;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
          transition: background 0.3s ease-in-out;
        }
        .customRange::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          box-shadow: none;
          border: none;
          background: transparent;
        }
      `}</style>
        </div>
    );
};

export { Slider };

