"use client";

import { useTheme } from "@/app/ThemeProvider";
import RiskTheme1 from "./risk-theme1";
import RiskTheme2 from "./risk-theme2";
import RiskTheme3 from "./risk-theme3";
import RiskTheme4 from "./risk-theme4";
import RiskTheme5 from "./risk-theme5";

const contactMap = {
  theme1: RiskTheme1,
  theme2: RiskTheme2,
  theme3: RiskTheme3,
  theme4: RiskTheme4,
  theme5: RiskTheme5,

};

export default function RiskClient() {
  const { theme } = useTheme();
  const ThemedContact = contactMap[theme] || RiskTheme1;

  return <ThemedContact />;
}
