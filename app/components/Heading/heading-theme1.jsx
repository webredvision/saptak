import React from "react";
import { IoMdArrowRoundUp } from "react-icons/io";

const Heading1 = ({
  title,
  heading,
  description,
  align = "center",
  variant = "dark",
}) => {
  const isDark = variant === "light";

  const alignClasses = {
    center: "text-center items-center",
    start: "text-left items-start",
    end: "text-right items-end",
  };

  return (
    <div className={`flex flex-col justify-center gap-3 ${alignClasses[align]}`}>
      {title && (
        <div
          className={`flex items-center justify-center gap-2 font-semibold capitalize 
            ${isDark
              ? "text-[var(--rv-white)] border-[var(--rv-white-light)] border px-3 py-1 rounded-full" : "text-[var(--rv-secondary)]"
            }
          `}
        >
          <div className="flex items-center ">
            <div className={`w-2 h-2 rounded-full -mr-1 ${isDark
              ? "bg-[var(--rv-bg-white)]" : "bg-[var(--rv-bg-secondary)]"
              }`}></div>
            <div className={`w-5 h-1 rounded-r-full ${isDark
              ? "bg-[var(--rv-bg-white)]" : "bg-[var(--rv-bg-secondary)]"
              }`}></div>
          </div>
          {title}
          <div className="flex items-center ">
            <div className={`w-5 h-1 rounded-l-full ${isDark
              ? "bg-[var(--rv-bg-white)]" : "bg-[var(--rv-bg-secondary)]"
              }`}></div>
            <div className={`w-2 h-2 rounded-full -ml-1 ${isDark
              ? "bg-[var(--rv-bg-white)]" : "bg-[var(--rv-bg-secondary)]"
              }`}></div>
          </div>
        </div>
      )}

      {heading && (
        <h5
          className={`font-bold leading-tight uppercase
            ${isDark ? "text-[var(--rv-white)]" : "text-[var(--rv-black)]"}
          `}
        >
          {heading}
        </h5>
      )}

      {description && <p className={`max-w-3xl opacity-85 ${isDark ? "text-[var(--rv-white)]" : "text-[var(--rv-black)]"} `} dangerouslySetInnerHTML={{ __html: description }} />}
    </div>
  );
};

export default Heading1;
