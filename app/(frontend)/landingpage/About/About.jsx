"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import AboutTheme1 from "./about-theme1.jsx";
import AboutTheme2 from "./about-theme2.jsx";
import AboutTheme3 from "./about-theme3.jsx";
import AboutTheme4 from "./about-theme4.jsx";
import AboutTheme5 from "./about-theme5.jsx";

const aboutMap = {
  theme1: AboutTheme1,
  theme2: AboutTheme2,
  theme3: AboutTheme3,
  theme4: AboutTheme4,
  theme5: AboutTheme5,
};

export default function About({stats , aboutData , otherData}) {
  const { theme } = useTheme();
  const ThemedAbout = aboutMap[theme] || AboutTheme1;

  return <ThemedAbout stats={stats} aboutData={aboutData} otherData={otherData}/>;
}
