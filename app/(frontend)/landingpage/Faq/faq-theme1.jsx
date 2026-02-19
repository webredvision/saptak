"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import Heading from "@/app/components/Heading/Heading";
import { motion, AnimatePresence } from "framer-motion";

const FaqTheme1 = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-[var(--rv-primary-light)] px-4">
      <div className="max-w-7xl mx-auto main-section grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="">
            <Heading align="start" title={'FAQs'} heading={'Frequently Asked Questions'} description={' Everything you need to know about our investment services, processes, and long-term financial planning.'} />
          </div>
          <div className="w-full h-80">
            <img src="/images/faq.png" className="w-full h-full object-cover" alt="" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 md:col-span-2"
        >
          <AnimatePresence mode="wait">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[var(--rv-bg-white)] rounded-xl p-6 shadow-sm"
                >
                  <div className="w-3/4 h-5 bg-[var(--rv-bg-gray-light)] rounded mb-3" />
                  <div className="w-full h-4 bg-[var(--rv-bg-gray-light)] rounded" />
                </div>
              ))
              : faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <motion.div
                    key={idx}
                    layout
                    className={`bg-[var(--rv-bg-white)] rounded-2xl border transition-all
                ${isOpen
                        ? "border-[var(--rv-primary)]"
                        : "border-[var(--rv-black-light)]"
                      }
              `}>
                    <button
                      onClick={() => toggle(idx)}
                      className="w-full flex justify-between items-center px-6 py-5 text-left"
                    >
                      <span className="font-semibold">
                        {faq?.question}
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex items-center justify-center w-6 h-6 rounded-full
                      ${isOpen
                            ? "bg-[var(--rv-primary)] text-[var(--rv-white)]"
                            : "bg-[var(--rv-primary)] "
                          }`}
                      >
                        {isOpen ? <FiMinus /> : <FiPlus />}
                      </motion.span>
                    </button>

                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="px-6 pb-5 leading-relaxed overflow-hidden"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: faq?.answer || "",
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqTheme1;
