import React from "react";
import Link from "next/link";

const Button1 = ({
  text = "Click Me",
  onClick,
  type = "button",
  Icon,
  className = "",
  link,
  disabled = false,
}) => {
  const baseClasses = `
    ${className}
    relative overflow-hidden w-fit
    after:absolute after:w-full after:h-full
    after:bg-[var(--rv-bg-secondary)]
    after:-bottom-full after:hover:bottom-0
    after:-z-10 z-10
    after:transition-all after:duration-300
    bg-[var(--rv-bg-primary)]
    border border-[var(--rv-primary)]
    text-[var(--rv-secondary)]
    hover:text-[var(--rv-white)]
    px-5 py-2 rounded-lg
    transition-all duration-300
    flex items-center justify-center
    ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none bg-[var(--rv-gray-light)] border-[var(--rv-gray-light)] text-[var(--rv-gray-dark)]" : ""}
  `;

  const content = (
    <>
      {text}
      {Icon && <Icon className="ml-2 w-4 h-4" />}
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

export default Button1;
