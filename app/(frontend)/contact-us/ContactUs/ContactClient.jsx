"use client";

import { useTheme } from "@/app/ThemeProvider";
import ContactTheme1 from "./contact-theme1";
import ContactTheme2 from "./contact-theme2";
import ContactTheme3 from "./contact-theme3";
import ContactTheme4 from "./contact-theme4";
import ContactTheme5 from "./contact-theme5";

const contactMap = {
  theme1: ContactTheme1,
  theme2: ContactTheme2,
  theme3: ContactTheme3,
  theme4: ContactTheme4,
  theme5: ContactTheme5,
};

export default function ContactClient({sitedata}) {
  const { theme } = useTheme();
  const ThemedContact = contactMap[theme] || ContactTheme1;

  return <ThemedContact sitedata={sitedata}/>;
}
