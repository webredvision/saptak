"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import ServiceCard1 from "./servicecard-theme1.jsx";
import ServiceCard2 from "./servicecard-theme2.jsx";
import ServiceCard3 from "./servicecard-theme3.jsx";
import Servicecard4 from "./servicecard-theme4.jsx";
import ServiceCard5 from "./servicecard-theme5.jsx";

const serviceCardMap = {
  theme1:ServiceCard1,
  theme2:ServiceCard2,
  theme3:ServiceCard3,
  theme4:Servicecard4,
  theme5:ServiceCard5,
};

export default function ServicesClient({services}) {
  const { theme } = useTheme();
  const ThemedServiceCard = serviceCardMap[theme] || ServiceCard1;

  return <ThemedServiceCard services={services} />;
}
