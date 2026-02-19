"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import InnerTheme1 from "./inner-theme1.jsx";
import InnerTheme2 from "./inner-theme2.jsx";
import InnerTheme3 from "./inner-theme3.jsx";
import InnerTheme4 from "./inner-theme4.jsx";
import InnerTheme5 from "./inner-theme5.jsx";

const innerMap = {
  theme1: InnerTheme1,
  theme2: InnerTheme2,
  theme3: InnerTheme3,
  theme4: InnerTheme4,
  theme5: InnerTheme5,
};

export default function InnerPage({ title }) {
  const { theme } = useTheme();

  const ThemedInner = innerMap[theme] || InnerTheme1;

  return <ThemedInner title={title} />;
}
