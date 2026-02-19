"use client";

import React from "react";
import { FiRefreshCcw } from "react-icons/fi";

const CaptchaRow = ({
  imageSrc,
  onRefresh,
  placeholder = "Enter code",
  value,
  onChange,
  name = "captcha",
  inputProps = {},
  input,
  className = "",
  imageClassName = "",
  inputClassName = "",
  buttonClassName = "",
  refreshAriaLabel = "Refresh captcha",
  buttonTitle = "Refresh Captcha",
}) => {
  const { ref: inputRef, ...restInputProps } = inputProps || {};

  return (
    <div
      className={`flex items-center gap-3 flex-nowrap bg-[var(--rv-bg-surface)] p-3 rounded-2xl border border-[var(--rv-border)] shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${className}`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Captcha"
          className={`h-10 w-28 rounded-lg object-cover bg-[var(--rv-bg-white)] border border-[var(--rv-border)] ${imageClassName}`}
        />
      )}
      <div className="flex-1 min-w-0">
        {input || (
          <input
            ref={inputRef}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            className={`h-10 w-full min-w-0 rounded-lg border border-[var(--rv-border)] bg-[var(--rv-bg-secondary-light)] text-[var(--rv-text)] px-3 text-sm placeholder:text-[var(--rv-text-muted)] focus:border-[var(--rv-primary)]/60 focus:ring-2 focus:ring-[var(--rv-primary)]/20 outline-none transition ${inputClassName}`}
            {...restInputProps}
          />
        )}
      </div>
      <button
        type="button"
        onClick={onRefresh}
        className={`shrink-0 h-10 w-10 rounded-lg bg-[var(--rv-primary)] text-[var(--rv-white)] flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition ${buttonClassName}`}
        aria-label={refreshAriaLabel}
        title={buttonTitle}
      >
        <FiRefreshCcw size={14} />
      </button>
    </div>
  );
};

export default CaptchaRow;
