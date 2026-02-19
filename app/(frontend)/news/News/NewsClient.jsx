"use client";

import { useTheme } from "@/app/ThemeProvider.js";
import NewsTheme1 from "./news-theme1.jsx";
import NewsTheme2 from "./news-theme2.jsx";
import NewsTheme3 from "./news-theme3.jsx";
import NewsTheme4 from "./news-theme4.jsx";
import NewsTheme5 from "./news-theme5.jsx";

const themeMap = {
  theme1: NewsTheme1,
  theme2: NewsTheme2,
  theme3: NewsTheme3,
  theme4: NewsTheme4,
  theme5: NewsTheme5,
};

export default function NewsClient({newsData}) {
  const { theme } = useTheme();
  const ThemedNews = themeMap[theme] || NewsTheme1;

  return <ThemedNews newsData={newsData} />;
}
