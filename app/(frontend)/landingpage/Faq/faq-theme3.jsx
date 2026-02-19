"use client";
import React, { useState } from "react";
import { FiPlus, FiMinus, FiArrowUpRight } from "react-icons/fi";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";

const FaqTheme3 = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section className="bg-[var(--rv-bg-white)] px-4  text-[var(--rv-secondary)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        <div className="flex flex-col gap-6 max-w-xl">
          <Heading align="start" title={'Frequently Asked Questions'} heading={'Everything you want to know cybersecurity'} description={'From service details to protection strategies, we provide clear explanations to help you make informed decisions.'} />
        </div>

        <div className="flex flex-col ">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq?.id ?? idx}
                className=""
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between px-6 py-3 border-b text-left font-semibold text-[var(--rv-primary)]"
                >
                  <span>
                    {idx + 1}. {faq?.question}
                  </span>

                  <span className="ml-4 flex-shrink-0">
                    <span className="w-8 h-8 rounded-md bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] flex items-center justify-center">
                      {isOpen ? <FiMinus /> : <FiPlus />}
                    </span>
                  </span>
                </button>

                <div
                  className={`px-6 pt-4 transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div
                    className="text-[var(--rv-black)] opacity-70 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq?.answer }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqTheme3;
