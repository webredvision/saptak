import React from "react";
import { motion } from "motion/react";

const Heading2 = ({
  title,
  heading,
  highlight,
  description,
  align = "center",
  variant = "dark",
}) => {
  const headingColor =
    variant === "light"
      ? "text-[var(--rv-white)]"
      : "text-[var(--rv-primary)]";

  return (
    <div className={`text-${align} flex flex-col gap-2`}>
      {title && (
        <p className={`${headingColor} font-semibold uppercase tracking-wider`}>
          {title}
        </p>
      )}

      {heading && (
        <h4 className={`font-bold leading-tight text-[var(--rv-white)] `}>
          {heading}
        </h4>
      )}

      {description && <p className={`text-[var(--rv-white)] opacity-80`} dangerouslySetInnerHTML={{ __html: description}}/>}

     
    </div>
  );
};

export default Heading2;


