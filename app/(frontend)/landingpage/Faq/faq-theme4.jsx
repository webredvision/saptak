"use client";

import React, { useState } from "react";
import Heading from "@/app/components/Heading/Heading";
import { FiChevronDown } from "react-icons/fi";

const FaqTheme4 = ({ faqs }) => {
  const [active, setActive] = useState(0);

  return (
    <section className="relative px-4 bg-[var(--rv-bg-white)] text-[var(--rv-black)] overflow-hidden">
      <div className="main-section border-b">
        <div className="relative max-w-5xl mx-auto flex flex-col gap-14">
          <div className="text-center max-w-2xl mx-auto">
            <Heading
              title="Support"
              heading="Frequently Asked Questions"
              description="Clear answers to help you move forward with confidence."
            />
          </div>

          <div className="flex flex-col gap-6">
            {faqs?.map((faq, i) => {
              const isOpen = active === i;

              return (
                <div
                  key={i}
                  onClick={() => setActive(isOpen ? null : i)}
                  className="cursor-pointer rounded-xl border border-[var(--rv-border)] p-4 transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold">{faq.question}</p>

                    <span
                      className={`text-[var(--rv-primary)] text-2xl transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <FiChevronDown />
                    </span>
                  </div>

                  {isOpen && (
                    <div
                      className="mt-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqTheme4;
