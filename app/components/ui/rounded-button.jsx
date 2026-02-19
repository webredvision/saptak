"use client";
import React from "react";
import Link from "next/link";

const RoundedButton = ({ label, href, onClick, className = "" }) => {
  // Standardizing to the requested pinkish-red design with black text
  const baseStyles = `px-10 py-4 bg-[var(--rv-secondary)] hover:bg-[var(--rv-secondary)]/90 text-[var(--rv-white)] font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-[var(--rv-secondary)]/30 hover:-translate-y-0.5 inline-block text-center    md:text-sm ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {label}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={baseStyles}>
      {label}
    </button>
  );
};

export default RoundedButton;
