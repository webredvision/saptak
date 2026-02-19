"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { RiImageAddLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/app/ThemeProvider";

const themes = ["theme1", "theme2", "theme3", "theme4", "theme5"];

const COLOR_VARIABLES = [
  "--rv-primary",
  "--rv-secondary",
  "--rv-primary-light",
  "--rv-secondary-light",
  "--rv-primary-dark",
  "--rv-secondary-dark",
];

const COLOR_LABELS = {
  "--rv-primary": "Primary Color",
  "--rv-primary-light": "Primary Light Color",
  "--rv-primary-dark": "Primary Dark Color",
  "--rv-secondary": "Secondary Color",
  "--rv-secondary-light": "Secondary Light Color",
  "--rv-secondary-dark": "Secondary Dark Color",
};

const Colortheme = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState({});
  const [defaultColors, setDefaultColors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const localLogo = localStorage.getItem("custom-logo");
      setLogoPreview(localLogo);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const root = getComputedStyle(document.documentElement);
    const loaded = {};
    const defaults = {};

    COLOR_VARIABLES.forEach((variable) => {
      const value = root.getPropertyValue(variable).trim() || "#000000";
      const bgVar = variable.replace("--rv-", "--rv-bg-");
      const bgValue = root.getPropertyValue(bgVar).trim() || "#000000";

      loaded[variable] = value;
      loaded[bgVar] = bgValue;

      if (!Object.keys(defaultColors).length) {
        defaults[variable] = value;
        defaults[bgVar] = bgValue;
      }
    });

    setColors(loaded);
    if (!Object.keys(defaultColors).length) {
      setDefaultColors(defaults);
    }
  }, [isOpen]);

  const handleColorChange = (variable, hex) => {
    const bgVar = variable.replace("--rv-", "--rv-bg-");

    document.documentElement.style.setProperty(variable, hex);
    document.documentElement.style.setProperty(bgVar, hex);

    setColors((prev) => ({
      ...prev,
      [variable]: hex,
      [bgVar]: hex,
    }));
  };

  const resetThemeAndLogo = () => {
    localStorage.removeItem("custom-logo");
    setLogoPreview(null);
    window.dispatchEvent(new Event("logo-updated"));

    Object.entries(defaultColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    setColors(defaultColors);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const { theme, changeTheme } = useTheme();

  const handleThemeChange = async (t) => {
    try {
      await changeTheme(t);
      const url = new URL(window.location.href);
      url.searchParams.set("theme", t);
      toast.success(`Theme changed to ${t}!`);
      setTimeout(() => {
        window.location.href = url.toString();
      }, 200);
    } catch (err) {
      toast.error("Failed to change theme");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[var(--rv-bg-black-light)] z-40 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isOpen ? 0 : "100%" }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 right-0 h-screen w-full md:w-96 bg-[var(--rv-bg-surface)] text-[var(--rv-text)] z-50 shadow-2xl p-4 border-l border-[var(--rv-border)] flex flex-col gap-5"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Theme Settings</h2>
            <FaTimes
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-5 h-full overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COLOR_VARIABLES.map((variable) => (
                <div key={variable} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--rv-text-muted)]">
                    {COLOR_LABELS[variable]}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={colors[variable] || "#000000"}
                      onChange={(e) =>
                        handleColorChange(variable, e.target.value)
                      }
                      className="w-14 h-10"
                    />
                    <input
                      type="text"
                      value={colors[variable] || "#000000"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                          handleColorChange(variable, val);
                        }
                      }}
                      className="w-full h-10 px-3 border rounded text-sm font-mono bg-[var(--rv-bg-page)] text-[var(--rv-text)] border-[var(--rv-border)]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="">
              <label className="text-sm font-medium mb-2 block text-[var(--rv-text-muted)]">
                Upload Logo
              </label>

              <div
                className="h-28 border-2 border-dashed rounded flex items-center justify-center cursor-pointer relative border-[var(--rv-border)]"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="text-[var(--rv-text-muted)] flex flex-col items-center">
                    <RiImageAddLine size={24} />
                    <span>Add Logo</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    localStorage.setItem("custom-logo", reader.result);
                    setLogoPreview(reader.result);
                    window.dispatchEvent(new Event("logo-updated"));
                  };
                  reader.readAsDataURL(file);
                }}
              />

              <button
                onClick={resetThemeAndLogo}
                className="mt-4 w-full py-2 rounded-full font-bold border border-[var(--rv-border)] hover:bg-[var(--rv-primary)] hover:text-[var(--rv-black)] transition"
              >
                Reset to Default Theme
              </button>
            </div>

            <div
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-1/2 -translate-y-1/2 right-full w-14 h-14 bg-[var(--rv-bg-surface)] border border-[var(--rv-border)] rounded-l-2xl flex items-center justify-center cursor-pointer"
            >
              <FiSettings
                size={28}
                className={`text-[var(--rv-text)] ${
                  isOpen ? "animate-spin" : ""
                }`}
              />
            </div>
            <div>
              <div className="flex flex-col gap-5">
                <h6 className="font-semibold text-[var(--rv-text)]">
                  Theme Selector
                </h6>

                <div className="relative w-full">
                  <div className="">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {themes.map((t) => {
                        const isActive = theme === t;

                        return (
                          <div
                            key={t}
                            className={`rounded-lg transition-colors ${
                              isActive
                                ? "bg-[var(--rv-primary)]"
                                : "bg-[var(--rv-secondary)]"
                            }`}
                          >
                            <button
                              onClick={() => handleThemeChange(t)}
                              className={`
                      w-full origin-top-left rounded-lg border bg-[var(--rv-bg-surface)] py-2 
                         font-medium transition-all md:text-base
                      ${
                        isActive
                          ? "-translate-y-1 border-[var(--rv-primary)] text-[var(--rv-primary)]"
                          : "border-[var(--rv-border)] text-[var(--rv-text-muted)] hover:-rotate-2"
                      }
                    `}
                            >
                              {t.toUpperCase()}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <ToastContainer position="top-right" autoClose={2000} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Colortheme;
