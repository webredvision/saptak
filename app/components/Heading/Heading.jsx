"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import HeadingTheme1 from "./heading-theme1.jsx";
import HeadingTheme2 from "./heading-theme2.jsx";
import HeadingTheme3 from "./heading-theme3.jsx";
import HeadingTheme4 from "./heading-theme4.jsx";
import HeadingTheme5 from "./heading-theme5.jsx";

const headingMap = {
  theme1: HeadingTheme1,
  theme2: HeadingTheme2,
  theme3: HeadingTheme3,
  theme4: HeadingTheme4,
  theme5: HeadingTheme5,
};

export default function Heading({ title, heading,highlight, description, align = "center" , variant = "dark"  }) {
  const { theme } = useTheme();

  const ThemedHeading = headingMap[theme] || HeadingTheme1;

  return (
    <ThemedHeading
      title={title}
      heading={heading}
      description={description}
      align={align}
      variant={variant}
      highlight={highlight}
    />
  );
}
