"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import CalculatorTheme1 from "./calculator-theme1.jsx";
import CalculatorTheme2 from "./calculator-theme2.jsx";
import CalculatorTheme3 from "./calculator-theme3.jsx";
import CalculatorTheme4 from "./calculator-theme4.jsx";
import CalculatorTheme5 from "./calculator-theme5.jsx";

const calculatorMap = {
  theme1: CalculatorTheme1,
  theme2: CalculatorTheme2,
  theme3: CalculatorTheme3,
  theme4: CalculatorTheme4,
  theme5: CalculatorTheme5,
};

export default function Calculators() {
  const { theme } = useTheme();

  const ThemeCalculators = calculatorMap[theme] || CalculatorTheme1;

  return <ThemeCalculators />;
}



