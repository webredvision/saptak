import React from "react";
import { RiLightbulbFlashFill } from "react-icons/ri";
const Heading4 = ({
  title,
  heading,
  description,
  align = "center",
  variant = "dark",
}) => {
  const headingColor =
    variant === "light"
      ? "text-[var(--rv-white)]"
      : "text-[var(--rv-black)]";


  return (
    <div className={`text-${align} flex flex-col items-${align} justify-${align} gap-2`}>
      {title && (
        <div
          className={`flex items-center gap-2 p-1 px-2 rounded-full backdrop-blur-sm bg-[var(--rv-bg-white-light)] 
    border border-[var(--rv-border)]`}
        >
          <RiLightbulbFlashFill className="text-[var(--rv-primary)]" />
          <p
            className={`font-light text-sm tracking-wider ${headingColor || "text-[var(--rv-black)]"
              }`}
          >
            {title}
          </p>
        </div>
      )}

      {heading && (
        <h2 className={`font-bold leading-tight text-2xl sm:text-3xl md:text-4xl ${headingColor}`}>
          {heading}
        </h2>
      )}

      {description && <p className={`${headingColor} opacity-80`} dangerouslySetInnerHTML={{ __html: description }} />}


    </div>
  );
};

export default Heading4;


