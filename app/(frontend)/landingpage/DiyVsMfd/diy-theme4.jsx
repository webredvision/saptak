"use client";

import React from "react";
import { motion } from "framer-motion";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { FiX, FiCheck } from "react-icons/fi";

const DiyVsMfd1 = () => {
  const comparison = [
    {
      diy: "Self-research",
      mfd: "Expert-curated funds aligned to your goals",
    },
    {
      diy: "Basic questionnaire",
      mfd: "Detailed professional risk assessment",
    },
    {
      diy: "Chatbot or email support",
      mfd: "Dedicated 1:1 relationship manager",
    },
    {
      diy: "Emotion-driven decisions",
      mfd: "Regular reviews & disciplined investing",
    },
    {
      diy: "Manual tracking",
      mfd: "Periodic rebalancing & optimization",
    },
  ];

  return (
    <section className="bg-[var(--rv-bg-white)] px-4 overflow-hidden">
      <div className="main-section border-b">
        <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center">
            <Heading
              heading="Why Work With an MFD?"
              description="You can invest on your own — or partner with an expert who helps you avoid costly mistakes and stay on track."
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            <div className="w-full bg-[var(--rv-bg-white)] text-center relative rounded-xl border border-[var(--rv-border)]">
              <div className="p-5 md:pt-16 pt-8">
                <div className="md:w-24 md:h-24 w-16 h-16 absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[var(--rv-bg-white)] p-2 border border-[var(--rv-border)] rounded-full">
                  <div className="w-full h-full rounded-full bg-[var(--rv-bg-primary)] p-4">
                    <img src="/images/diy.png" className="w-full h-full object-contain" alt="" />
                  </div>
                </div>
                <h5>DIY Platforms</h5>
              </div>
              <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                <p>Self-research</p>
              </div>
              <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                <p>Basic questionnaire</p>
              </div>
              <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                <p>Chatbot or email support</p>
              </div>
              <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                <p>Emotion-driven decisions</p>
              </div>
              <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                <p>Manual tracking</p>
              </div>
            </div>
            <div className="w-full text-[var(--rv-white)] text-center relative z-20">
              <div className="md:w-24 md:h-24 w-16 h-16 absolute z-20  top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[var(--rv-bg-white)] p-2 border border-[var(--rv-border)] rounded-full">
                <div className="w-full h-full rounded-full bg-[var(--rv-bg-primary)] p-3">
                  <img src="/images/mfd.png" className="w-full h-full object-contain" alt="" />
                </div>
              </div>
              <div className="w-full text-[var(--rv-white)] overflow-hidden rounded-xl border border-[var(--rv-border)] relative z-10  bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)]">
                <div className="p-5 md:pt-16 pt-8">
                  <h5>With an MFD</h5>
                </div>
                <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                  <p>Self-research</p>
                </div>
                <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                  <p>Basic questionnaire</p>
                </div>
                <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                  <p>Chatbot or email support</p>
                </div>
                <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                  <p>Emotion-driven decisions</p>
                </div>
                <div className="p-5 flex items-center text-center justify-center gap-3 border-t border-[var(--rv-border)]" >
                  <p>Manual tracking</p>
                </div>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Button
              text="Start Investing With Expert Guidance"
              className="border border-[var(--rv-bg-primary)]"
              link="/login"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiyVsMfd1;
