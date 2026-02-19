"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import FundPerformanceTheme1 from "./fundperformance-theme1.jsx";
import FundPerformanceTheme2 from "./fundperformance-theme2.jsx";
import FundPerformanceTheme3 from "./fundperformance-theme3.jsx";
import FundPerformanceTheme4 from "./fundperformance-theme4.jsx";
import FundPerformanceTheme5 from "./fundperformance-theme5.jsx";

const aboutMap = {
  theme1: FundPerformanceTheme1,
  theme2: FundPerformanceTheme2,
  theme3: FundPerformanceTheme3,
  theme4: FundPerformanceTheme4,
  theme5: FundPerformanceTheme5,
};

export default function FundPerformance() {
  const { theme } = useTheme();
  const ThemedFundPerformance = aboutMap[theme] || FundPerformanceTheme1;

  return <ThemedFundPerformance />;
}
