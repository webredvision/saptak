import React from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const Button2 = ({
  text = "Click Me",
  onClick,
  type = "button",
  className = "",
  link,
  disabled = false,
  variant,
}) => {
  const isChoice = variant === "choice" || variant === "choice-active";
  const isChoiceActive = variant === "choice-active";
  const baseClasses = `
    relative overflow-hidden
    flex items-center justify-center gap-4
    font-medium border
    transition-all duration-500
    ${disabled
      ? "opacity-40 cursor-not-allowed pointer-events-none bg-[var(--rv-primary)] text-[var(--rv-black)]"
      : isChoice
        ? `${isChoiceActive ? "bg-[var(--rv-primary)] text-[var(--rv-black)] border-[var(--rv-primary)]" : "bg-[var(--rv-bg-secondary-light)] text-[var(--rv-text)] border-[var(--rv-border)] hover:border-[var(--rv-primary)] hover:text-[var(--rv-primary)]"}`
        : "bg-[var(--rv-primary)] text-[var(--rv-black)] hover:text-[var(--rv-white)] border-[var(--rv-primary)]"}
    
    ${!disabled && `
      z-10
      after:content-[''] after:absolute after:top-1/2 after:right-0
      after:translate-x-1/2 after:-translate-y-1/2
      after:w-0 after:h-0 after:bg-[var(--rv-bg-black)] after:-z-10
      after:transition-all after:duration-500
      hover:after:w-[1000px] hover:after:h-[300px] after:rounded-full
    `}
    
    ${isChoice ? "rounded-xl" : "rounded-full"}
    ${className}
  `;

  const content = isChoice ? (
    <span className="px-5 py-2 text-center">{text}</span>
  ) : (
    <div className="flex items-center gap-3 pl-5">
      <p className="p-1">{text}</p>
      <div className="w-10 h-10 bg-[var(--rv-bg-black)] text-[var(--rv-white)] rounded-full flex items-center justify-center">
        <FaArrowRightLong className={!disabled ? "animate-bounce1" : ""} />
      </div>
    </div>
  );

  const choiceStyle = isChoice
    ? {
        clipPath:
          "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
      }
    : undefined;

  if (link) {
    return disabled ? (
      <span className={baseClasses} style={choiceStyle} aria-disabled="true">
        {content}
      </span>
    ) : (
      <Link href={link} className={baseClasses} style={choiceStyle} aria-label={text}>
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
      style={choiceStyle}
      aria-label={text}
    >
      {content}
    </button>
  );
};

export default Button2;
