"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import ContactTheme1 from "./contact-theme1.jsx";
import ContactTheme2 from "./contact-theme2.jsx";
import ContactTheme3 from "./contact-theme3.jsx";
import ContactTheme4 from "./contact-theme4.jsx";
import ContactTheme5 from "./contact-theme5.jsx";

const contactMap = {
  theme1: ContactTheme1,
  theme2: ContactTheme2,
  theme3: ContactTheme3,
  theme4: ContactTheme4,
  theme5: ContactTheme5,
};

export default function Contact({sitedata}) {
  const { theme } = useTheme();

  const ThemedContact = contactMap[theme] || ContactTheme1;

  return <ThemedContact sitedata={sitedata} />;
}
