import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const Button3 = ({
  text = "Click Me",
  onClick,
  type = "button",
  Icon = "",
  className = "",
  link,
  disabled = false,
}) => {
  const baseClasses = `w-fit
    ${className}
    bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-bg-secondary)]
    hover:to-[var(--rv-bg-primary)] hover:from-[var(--rv-bg-secondary)]
    text-[var(--rv-white)]
    px-6 py-2.5 rounded-lg
    duration-300 transition-all
    flex items-center justify-center gap-2
    ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
  `;

  const content = (
    <>
      {text}
      {Icon}
    </>
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

export default Button3;
