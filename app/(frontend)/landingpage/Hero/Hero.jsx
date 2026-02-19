"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import HeroTheme1 from "./hero-theme1.jsx";
import HeroTheme2 from "./hero-theme2.jsx";
import HeroTheme3 from "./hero-theme3.jsx";
import HeroTheme4 from "./hero-theme4.jsx";
import HeroTheme5 from "./hero-theme5.jsx";

const heroMap = {
  theme1: HeroTheme1,
  theme2: HeroTheme2,
  theme3: HeroTheme3,
  theme4: HeroTheme4,
  theme5: HeroTheme5,
};

export default function Hero({amcLogosData , stats}) {
  const { theme } = useTheme();

  const ThemedHero = heroMap[theme] || HeroTheme1;

  return <ThemedHero amcLogosData={amcLogosData} stats={stats}/>;
}
