import React from "react";
const Heading4 = ({
  title,
  heading,
  description,
  align = "center",
  variant = "dark",
}) => {
  const headingColor =
    variant === "light" ? "text-[var(--rv-white)]" : "text-[var(--rv-black)]";

  const alignClasses = {
    center: "text-center items-center",
    start: "text-left items-start",
    end: "text-right items-end",
  };

  return (
    <div
      className={`flex flex-col justify-center gap-2 ${alignClasses[align]}`}
    >
      {title && (
        <div className="p-2 px-4 shadow-md w-fit rounded-full bg-[var(--rv-white)] flex gap-3 items-center">
          <div className="w-2 h-2 flex-shrink-0 bg-[var(--rv-bg-primary)] rounded-full"></div>
          <p
            className={`font-semibold    uppercase tracking-wider text-[var(--rv-black)]`}
          >
            {title}
          </p>
          <div className="w-2 h-2 flex-shrink-0 bg-[var(--rv-bg-primary)] rounded-full"></div>
        </div>
      )}
      {heading && <h4 className={`${headingColor} font-bold`}>{heading}</h4>}
      {description && (
        <p
          className={`${headingColor} opacity-90`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};

export default Heading4;
