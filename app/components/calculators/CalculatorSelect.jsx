"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export function CalculatorSelect({
  label,
  items = [],
  placeholder = "Select",
  onChange,
  className = "",
}) {
  return (
    <div className={`flex flex-col justify-between w-full md:w-auto ${className}`}>
      {label ? <span className="mb-2 text-sm opacity-60">{label}</span> : null}
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-[280px] bg-[var(--rv-bg-white)] border border-[var(--rv-primary)] text-[var(--rv-black)] hover:bg-[var(--rv-bg-white-dark)] transition-colors rounded-xl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[var(--rv-bg-white)] text-[var(--rv-black)] border border-[var(--rv-primary)] shadow-lg">
          {items.map((item) => (
            <SelectItem
              key={item.title}
              value={item.route}
              className="focus:bg-[var(--rv-primary)] focus:text-[var(--rv-white)] cursor-pointer py-3"
            >
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
