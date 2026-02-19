import React from "react";
import Link from "next/link";

const  Button5 = ({
  text = "Click Me",
  onClick,
  type = "button",
  Icon,
  className,
  link,
  variant = "dark",
  disabled = false,
}) => {
  const content = (
    <>
      {text}
      {Icon && <Icon className="ml-2" />}
    </>
  );

  const baseClasses = `${className} ${variant === "light" ? "after:bg-[var(--rv-bg-secondary-light)] hover:text-[var(--rv-black)] " : "after:bg-[var(--rv-bg-secondary)]"} after:w-full after:h-full after:absolute relative after:bg-[var(--rv-bg-secondary)] after:-bottom-full after:hover:bottom-0 after:-z-10 z-10 after:duration-300 after:transition-all overflow-hidden bg-[var(--rv-bg-primary)] text-[var(--rv-white)] px-8 py-2.5 rounded-full duration-300 transition-all flex items-center justify-center w-fit ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none bg-[var(--rv-gray-light)] text-[var(--rv-gray-dark)]" : ""}`;

  if (link) {
    return disabled ? (
      <span className={baseClasses} aria-disabled="true">
        {content}
      </span>
    ) : (
      <Link href={link} className={baseClasses}>
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
    >
      {content}
    </button>
  );
};

export default Button5;
