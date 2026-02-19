"use client";

import { useTheme } from "@/app/ThemeProvider";
import InvestorTheme1 from "./investor-theme1";
import InvestorTheme2 from "./investor-theme2";
import InvestorTheme3 from "./investor-theme3";
import InvestorTheme4 from "./investor-theme4";
import InvestorTheme5 from "./investor-theme5";

const contactMap = {
  theme1: InvestorTheme1,
  theme2: InvestorTheme2,
  theme3: InvestorTheme3,
  theme4: InvestorTheme4,
  theme5: InvestorTheme5,
};

export default function TermClient({ sitedata }) {
  const { theme } = useTheme();
  const ThemedContact = contactMap[theme] || InvestorTheme1;

  return <ThemedContact sitedata={sitedata} />;
}
