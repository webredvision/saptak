"use client";
import React from "react";
import Button from "@/app/components/Button/Button";

const WelcomeSection = ({ onStart }) => {
  return (
    <div className="w-full flex flex-col items-center gap-5 md:gap-7">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--rv-primary-light)] border border-[var(--rv-primary)]">
        <span className="text-[var(--rv-text-muted)] font-bold capitalize tracking-widest">
          Intelligence Assessment
        </span>
      </div>
      <h2 className="   font-bold text-[var(--rv-text)] leading-tight">
        Check Your Financial Health
      </h2>
      <p className="text-[var(--rv-text-muted)] leading-relaxed font-medium">
        Your financial health is a reflection of how prepared you are for life's
        opportunities and challenges. A strong foundation allows you to manage
        daily expenses, save for the future, and handle emergencies with
        confidence.
        <br />
        <br />
        By assessing your health today, you gain the clarity needed to optimize
        investments, reduce stress, and build lasting security for a brighter
        tomorrow.
      </p>
      <Button text="Start Your Assessment Now" onClick={onStart} />
    </div>
  );
};

export default WelcomeSection;
