"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: "theme1", changeTheme: () => {} };
  }
  return context;
};

// 🔹 Get theme BEFORE first render (important)
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "theme1";
  }
  return "theme1";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const applyThemeCSS = (themeName) => {
    if (typeof document === "undefined") return;

    // remove old theme css
    document
      .querySelectorAll("link[data-theme]")
      .forEach((l) => l.remove());

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/themes/${themeName}.css`;
    link.setAttribute("data-theme", themeName);

    document.head.appendChild(link);

    // apply body theme class for global styling
    const body = document.body;
    const root = document.documentElement;
    if (body) {
      body.classList.remove(
        "theme1",
        "theme2",
        "theme3",
        "theme4",
        "theme5",
        "theme-dark",
        "theme-light"
      );
      body.classList.add(themeName);
      const isDark = themeName === "theme2";
      body.classList.add(isDark ? "theme-dark" : "theme-light");
      if (root) {
        root.classList.toggle("dark", isDark);
      }
    }
  };

  // 🔹 Apply theme immediately on mount
  useEffect(() => {
    applyThemeCSS(theme);

    const fetchTheme = async () => {
      try {
        const res = await fetch("/api/theme");
        const data = await res.json();

        const serverTheme = data?.base_theme;

        // agar server aur local alag hain
        if (serverTheme && serverTheme !== theme) {
          setTheme(serverTheme);
          applyThemeCSS(serverTheme);
          localStorage.setItem("theme", serverTheme);
        }
      } catch (err) {
        console.error("Error loading theme:", err);
      }
    };

    fetchTheme();
  }, []);

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    applyThemeCSS(newTheme);
    localStorage.setItem("theme", newTheme);

    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base_theme: newTheme }),
      });
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
