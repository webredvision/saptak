"use client";
import { useTheme } from "@/app/ThemeProvider.js";

import ServiceCardTheme1 from "./servicecard-theme1.jsx";
import ServiceCardTheme2 from "./servicecard-theme2.jsx";
import ServiceCardTheme3 from "./servicecard-theme3.jsx";
import ServiceCardTheme4 from "./servicecard-theme4.jsx";
import ServiceCardTheme5 from "./servicecard-theme5.jsx";

const serviceCardMap = {
  theme1: ServiceCardTheme1,
  theme2: ServiceCardTheme2,
  theme3: ServiceCardTheme3,
  theme4: ServiceCardTheme4,
  theme5: ServiceCardTheme5,
};

export default function ServiceCard({ services }) {
  const { theme } = useTheme();
  const ThemedServiceCard = serviceCardMap[theme] || ServiceCardTheme1;

  return <ThemedServiceCard services={services} />;
}
