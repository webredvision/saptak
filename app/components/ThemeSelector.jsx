"use client";

import { useTheme } from "@/app/ThemeProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const themes = ["theme1", "theme2", "theme3", "theme4", "theme5"];

export default function ThemeSelector() {
  const { theme, changeTheme } = useTheme();

  const handleThemeChange = async (t) => {
    try {
      await changeTheme(t);
      toast.success(`Theme changed to ${t}!`);
    } catch (err) {
      toast.error(`Failed to change theme: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h6 className="font-semibold">Theme Selector</h6>

      <div className="relative w-full">
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-5">
            {themes.map((t) => {
              const isActive = theme === t;

              return (
                <div
                  key={t}
                  className={`rounded-lg transition-colors ${isActive
                    ? "bg-[var(--rv-primary)]"
                    : "bg-[var(--rv-primary)]"
                    }`}
                >
                  <button
                    onClick={() => handleThemeChange(t)}
                    className={`
                      w-full origin-top-left rounded-lg border bg-[var(--rv-bg-white)] py-3 
                         font-medium transition-all md:text-base
                      ${isActive
                        ? "-translate-y-1 border-[var(--rv-primary)] text-[var(--rv-primary)]"
                        : "border-[var(--rv-secondary)]  hover:-rotate-2"
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

      <p className="mt-2 text-center">
        Current Theme:{" "}
        <span className="font-semibold text-[var(--rv-primary)]">{theme}</span>
      </p>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
