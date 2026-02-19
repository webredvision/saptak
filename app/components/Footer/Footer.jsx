"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import FooterTheme1 from "./footer-theme1.jsx";
import FooterTheme2 from "./footer-theme2.jsx";
import FooterTheme3 from "./footer-theme3.jsx";
import FooterTheme4 from "./footer-theme4.jsx";
import FooterTheme5 from "./footer-theme5.jsx";

const footerMap = {
  theme1: FooterTheme1,
  theme2: FooterTheme2,
  theme3: FooterTheme3,
  theme4: FooterTheme4,
  theme5: FooterTheme5,
};

export default function Footer({ services, sitedata, socialMedia, arnData }) {
  const { theme } = useTheme();

  const ThemedFooter = footerMap[theme] || FooterTheme1;

  return (
    <ThemedFooter
      services={services}
      sitedata={sitedata}
      socialMedia={socialMedia}
      arnData={arnData}
    />
  );
}
