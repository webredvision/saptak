"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import FaqTheme1 from "./faq-theme1.jsx";
import FaqTheme2 from "./faq-theme2.jsx";
import FaqTheme3 from "./faq-theme3.jsx";
import FaqTheme4 from "./faq-theme4.jsx";
import FaqTheme5 from "./faq-theme5.jsx";

const faqMap = {
  theme1: FaqTheme1,
  theme2: FaqTheme2,
  theme3: FaqTheme3,
  theme4: FaqTheme4,
  theme5: FaqTheme5,
};

export default function Faq({ faqs }) {
  const { theme } = useTheme();
  const ThemedFaq = faqMap[theme] || FaqTheme1;
  return <ThemedFaq faqs={faqs} />;
}
