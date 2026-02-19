"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import BlogTheme1 from "./blog-theme1.jsx";
import BlogTheme2 from "./blog-theme2.jsx";
import BlogTheme3 from "./blog-theme3.jsx";
import BlogTheme4 from "./blog-theme4.jsx";
import BlogTheme5 from "./blog-theme5.jsx";

const blogMap = {
  theme1: BlogTheme1,
  theme2: BlogTheme2,
  theme3: BlogTheme3,
  theme4: BlogTheme4,
  theme5: BlogTheme5,
};

export default function Blog({ blog }) {
  const { theme } = useTheme();

  const ThemedBlog = blogMap[theme] || BlogTheme1;

  return <ThemedBlog blog={blog} />;
}
