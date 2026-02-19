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
      middle: "Fund Selection",
      mfd: "Expert-curated funds aligned to your goals",
    },
    {
      diy: "Basic questionnaire",
      middle: "Risk Profiling",
      mfd: "Detailed professional risk assessment",
    },
    {
      diy: "Chatbot or email support",
      middle: "After-sales Support",
      mfd: "Dedicated 1:1 relationship manager",
    },
    {
      diy: "Emotion-driven decisions",
      middle: "Discipline",
      mfd: "Regular reviews & disciplined investing",
    },
    {
      diy: "Manual tracking",
      middle: "Portfolio Review",
      mfd: "Periodic rebalancing & optimization",
    },
  ];

  return (
    <section className="bg-[var(--rv-bg-white)] px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-8 md:gap-12">

        {/* ================= HEADING ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Heading
            title="Advisor Advantage"
            heading="Invest Smarter With Professional Support"
            description="An experienced advisor brings clarity, discipline, and ongoing support—helping you avoid mistakes and invest with confidence."
          />
        </motion.div>

        <div className="overflow-x-auto bg-[var(--rv-bg-white)]">
          <div className="min-w-[900px] grid grid-cols-3 rounded-xl border bg-[var(--rv-bg-white)]">

            <div className="p-6 text-center font-semibold border-r">
              DIY Platforms
            </div>
            <div className="p-6 text-center font-semibold bg-[var(--rv-primary)] text-[var(--rv-white)] border-r">
              Key Difference
            </div>
            <div className="p-6 text-center font-semibold text-[var(--rv-primary)]">
              With an MFD
            </div>

            {comparison.map((item, i) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="p-5 flex items-center gap-3 border-t border-r"
                >
                  <FiX className="text-[var(--rv-primary)] shrink-0" />
                  <span>{item.diy}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="p-5 flex items-center justify-center border-t border-r bg-[var(--rv-primary-light)] font-semibold text-[var(--rv-primary)]"
                >
                  {item.middle}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="p-5 flex items-center gap-3 border-t"
                >
                  <FiCheck className="text-[var(--rv-green)] shrink-0" />
                  <span>{item.mfd}</span>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center pt-4"
        >
          <Button
            text="Start Investing With Expert Guidance"
            link="/login"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DiyVsMfd1;
