"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeProvider.js";
import NavbarTheme1 from "./navbar-theme1.jsx";
import NavbarTheme2 from "./navbar-theme2.jsx";
import NavbarTheme3 from "./navbar-theme3.jsx";
import NavbarTheme4 from "./navbar-theme4.jsx";
import NavbarTheme5 from "./navbar-theme5.jsx";

const navbarMap = {
  theme1: NavbarTheme1,
  theme2: NavbarTheme2,
  theme3: NavbarTheme3,
  theme4: NavbarTheme4,
  theme5: NavbarTheme5,
};

export default function Navbar({ services, sitedata, roboUser }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use theme1 (default) during SSR and initial hydration to avoid mismatch
  const currentTheme = mounted ? theme : "theme1";
  const ThemedNavbar = navbarMap[currentTheme] || NavbarTheme1;

  return (
    <ThemedNavbar services={services} sitedata={sitedata} roboUser={roboUser} />
  );
}
