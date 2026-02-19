"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import ThankyouTheme1 from "./Thankyou/thankyou-theme1.jsx";
import ThankyouTheme2 from "./Thankyou/thankyou-theme2.jsx";
import ThankyouTheme3 from "./Thankyou/thankyou-theme3.jsx";
import ThankyouTheme4 from "./Thankyou/thankyou-theme4.jsx";
import ThankyouTheme5 from "./Thankyou/thankyou-theme5.jsx";

const thankyouMap = {
  theme1: ThankyouTheme1,
  theme2: ThankyouTheme2,
  theme3: ThankyouTheme3,
  theme4: ThankyouTheme4,
  theme5: ThankyouTheme5,
};

export default function Thankyou() {
  const { theme } = useTheme();

  const ThemedThankyou = thankyouMap[theme] || ThankyouTheme1;

  return <ThemedThankyou />;
}
