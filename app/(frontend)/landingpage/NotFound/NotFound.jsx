"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import NotFoundTheme1 from "./not-found-theme1.jsx";
import NotFoundTheme2 from "./not-found-theme2.jsx";
import NotFoundTheme3 from "./not-found-theme3.jsx";
import NotFoundTheme4 from "./not-found-theme4.jsx";
import NotFoundTheme5 from "./not-found-theme5.jsx";

const themeMap = {
  theme1: NotFoundTheme1,
  theme2: NotFoundTheme2,
  theme3: NotFoundTheme3,
  theme4: NotFoundTheme4,
  theme5: NotFoundTheme5,
};

export default function NotFoundClient({newsData}) {
  const { theme } = useTheme();
  const ThemedNews = themeMap[theme] || NotFoundTheme1;

  return <ThemedNews newsData={newsData} />;
}
