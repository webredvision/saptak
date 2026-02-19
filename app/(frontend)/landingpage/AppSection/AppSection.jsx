"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import AppSectionTheme1 from "./appsection-theme1.jsx";
import AppSectionTheme2 from "./appsection-theme2.jsx";
import AppSectionTheme3 from "./appsection-theme3.jsx";
import AppSectionTheme4 from "./appsection-theme4.jsx";
import AppSectionTheme5 from "./appsection-theme5.jsx";

const aboutMap = {
  theme1: AppSectionTheme1,
  theme2: AppSectionTheme2,
  theme3: AppSectionTheme3,
  theme4: AppSectionTheme4,
  theme5: AppSectionTheme5,
};

export default function AppSection({ sitedata }) {
  const { theme } = useTheme();
  const ThemedAppSection = aboutMap[theme] || AppSectionTheme1;

  return <ThemedAppSection sitedata={sitedata} />;
}
