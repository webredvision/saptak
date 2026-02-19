"use client";

import { useTheme } from "@/app/ThemeProvider";
import TermTheme1 from "./term-theme1";
import TermTheme2 from "./term-theme2";
import TermTheme3 from "./term-theme3";
import TermTheme4 from "./term-theme4";
import TermTheme5 from "./term-theme5";


const contactMap = {
  theme1: TermTheme1,
  theme2: TermTheme2,
  theme3: TermTheme3,
  theme4: TermTheme4,
  theme5: TermTheme5,

};

export default function TermClient() {
  const { theme } = useTheme();
  const ThemedContact = contactMap[theme] || TermTheme1;

  return <ThemedContact />;
}
