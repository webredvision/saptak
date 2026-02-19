import React from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const Button4 = ({
  text = "Click Me",
  onClick,
  type = "button",
  className = "",
  link,
  disabled = false,
}) => {
  const baseClasses = `w-fit
    relative overflow-hidden
    flex items-center justify-center gap-4
    font-medium rounded-full group
    transition-all duration-500 
    ${disabled
      ? "opacity-40 cursor-not-allowed pointer-events-none bg-[var(--rv-primary)] text-[var(--rv-black)]"
      : "bg-[var(--rv-primary)] text-[var(--rv-white)] hover:text-[var(--rv-black)] hover:bg-[var(--rv-white)] border border-[var(--rv-primary)] hover:border-[var(--rv-black)]"}
    ${className}
  `;

  const content = (
    <div className="flex items-center gap-3 pl-5 p-1">
      <p className="">{text}</p>
      <div className="w-9 h-9 bg-[var(--rv-bg-white)] group-hover:bg-[var(--rv-bg-black)] group-hover:text-[var(--rv-white)] text-[var(--rv-black)] rounded-full flex items-center justify-center">
        <FaArrowRightLong className={!disabled ? "animate-bounce1" : ""} />
      </div>
    </div>
  );

  if (link) {
    return disabled ? (
      <span className={baseClasses} aria-disabled="true">
        {content}
      </span>
    ) : (
      <Link href={link} className={baseClasses} aria-label={text}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={baseClasses}
      aria-label={text}
    >
      {content}
    </button>
  );
};

export default Button4;
