"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import CompareAssetsTheme1 from "./compareassets-theme1.jsx";
import CompareAssetsTheme2 from "./compareassets-theme2.jsx";
import CompareAssetsTheme3 from "./compareassets-theme3.jsx";
import CompareAssetsTheme4 from "./compareassets-theme4.jsx";
import CompareAssetsTheme5 from "./compareassets-theme5.jsx";

const aboutMap = {
  theme1: CompareAssetsTheme1,
  theme2: CompareAssetsTheme2,
  theme3: CompareAssetsTheme3,
  theme4: CompareAssetsTheme4,
  theme5: CompareAssetsTheme5,
};

export default function CompareAssets() {
  const { theme } = useTheme();
  const ThemedCompareAssets = aboutMap[theme] || CompareAssetsTheme1;

  return <ThemedCompareAssets />;
}
