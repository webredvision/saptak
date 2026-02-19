"use client";
import React, { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { BiMailSend, BiSolidMessage } from "react-icons/bi";

const FaqTheme5 = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 bg-[var(--rv-bg-white)]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-10">
        <Heading
          title="FAQs"
          heading="Investment Strategies & Market Trends"
          description="Explore expert insights, proven strategies, and market updates to make informed financial decisions."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 w-full">
          <div className="flex flex-col gap-4 md:col-span-2">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <motion.div
                  key={idx}
                  layout
                  initial={false}
                  className={`relative rounded-xl overflow-hidden border transition-all duration-300
                  ${isOpen
                      ? "bg-[var(--rv-bg-primary-light)] border-[var(--rv-primary)] shadow-lg"
                      : "bg-[var(--rv-bg-white)] border-[var(--rv-gray-light)] hover:shadow-md"
                    }`}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 transition-all duration-300
                    ${isOpen
                        ? "bg-[var(--rv-primary)]"
                        : "bg-transparent"
                      }`}
                  />

                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${isOpen
                            ? "bg-[var(--rv-primary)] text-[var(--rv-white)]"
                            : "bg-[var(--rv-bg-gray-light)] text-[var(--rv-gray-dark)]"
                          }`}
                      >
                        {idx + 1}
                      </span>

                      <span className="font-semibold text-base md:text-lg">
                        {faq.question}
                      </span>
                    </div>

                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-xl text-[var(--rv-primary)]"
                    >
                      {isOpen ? <FiMinus /> : <FiPlus />}
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-6 pb-6 text-sm md:text-base leading-relaxed text-[var(--rv-gray-dark)] [&_*]:leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <div className="w-full h-full bg-[var(--rv-bg-white)] border border-[var(--rv-primary)] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4">

            <BiSolidMessage  className="text-3xl sm:text-5xl md:text-6xl"/>

            <h3 className="font-semibold text-[var(--rv-black)]">
              Do you have more questions?
            </h3>

            <p className="text-[var(--rv-black)] opacity-70 leading-relaxed">
              End-to-end payments and financial management in a single solution.
              Meet the right platform to help realize.
            </p>
            <Button text={'Shoot a Direct Mail'} link="/contact-us" className={'rounded-lg'} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqTheme5;
