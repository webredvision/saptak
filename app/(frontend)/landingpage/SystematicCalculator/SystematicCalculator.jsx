"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import SystematicCalculatorTheme1 from "./systematiccalculator-theme1.jsx";
import SystematicCalculatorTheme2 from "./systematiccalculator-theme2.jsx";
import SystematicCalculatorTheme3 from "./systematiccalculator-theme3.jsx";
import SystematicCalculatorTheme4 from "./systematiccalculator-theme4.jsx";
import SystematicCalculatorTheme5 from "./systematiccalculator-theme5.jsx";

const aboutMap = {
  theme1: SystematicCalculatorTheme1,
  theme2: SystematicCalculatorTheme2,
  theme3: SystematicCalculatorTheme3,
  theme4: SystematicCalculatorTheme4,
  theme5: SystematicCalculatorTheme5,
};

export default function SystematicCalculator() {
  const { theme } = useTheme();
  const ThemedSystematicCalculator = aboutMap[theme] || SystematicCalculatorTheme1;

  return <ThemedSystematicCalculator />;
}
