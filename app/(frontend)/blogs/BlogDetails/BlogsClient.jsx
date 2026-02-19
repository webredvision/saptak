"use client";
import { useTheme } from "@/app/ThemeProvider";
import BlogDetailsPage1 from "./blogdetails-theme1";
import BlogDetailsPage2 from "./blogdetails-theme2";
import BlogDetailsPage3 from "./blogdetails-theme3";
import BlogDetailsPage4 from "./blogdetails-theme4";
import BlogDetailsPage5 from "./blogdetails-theme5";

const themeMap = {
  theme1: BlogDetailsPage1,
  theme2: BlogDetailsPage2,
  theme3: BlogDetailsPage3,
  theme4: BlogDetailsPage4,
  theme5: BlogDetailsPage5,
};

export default function BlogsClient({ blog, blogs }) {
  const { theme } = useTheme();
  const ThemedBlogs = themeMap[theme] || BlogDetailsPage1;
  return <ThemedBlogs blog={blog} blogs={blogs} />;
}
