"use client";
import { useTheme } from "@/app/ThemeProvider";
import BlogsTheme1 from "./blogs-theme1";
import BlogsTheme2 from "./blogs-theme2";
import BlogsTheme3 from "./blogs-theme3";
import BlogsTheme4 from "./blogs-theme4";
import BlogsTheme5 from "./blogs-theme5";

const themeMap = {
  theme1: BlogsTheme1,
  theme2: BlogsTheme2,
  theme3: BlogsTheme3,
  theme4: BlogsTheme4,
  theme5: BlogsTheme5,
};

export default function BlogsClient({ blogs }) {
  const { theme } = useTheme();
  const ThemedBlogs = themeMap[theme] || BlogsTheme1;
  return <ThemedBlogs blogs={blogs} />;
}
