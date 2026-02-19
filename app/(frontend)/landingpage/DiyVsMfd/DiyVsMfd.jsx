"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import DiyTheme1 from "./diy-theme1.jsx";
import DiyTheme2 from "./diy-theme2.jsx";
import DiyTheme3 from "./diy-theme3.jsx";
import DiyTheme4 from "./diy-theme4.jsx";
import DiyTheme5 from "./diy-theme5.jsx";

const diyMap = {
  theme1: DiyTheme1,
  theme2: DiyTheme2,
  theme3: DiyTheme3,
  theme4: DiyTheme4,
  theme5: DiyTheme5,
};

export default function DiyVsMfd() {
  const { theme } = useTheme();

  const ThemedDiy = diyMap[theme] || DiyTheme1;

  return <ThemedDiy />;
}
