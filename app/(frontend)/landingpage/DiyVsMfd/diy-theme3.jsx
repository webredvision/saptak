"use client";
import { motion } from "framer-motion";
import React from "react";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";

const DiyVsMfd3 = () => {
  const comparison = [
    {
      diy: "Self-research",
      middle: "Fund Selection",
      mfd: "A qualified MFD assists your investing",
    },
    {
      diy: "Basic Questionnaire",
      middle: "Risk Profiling",
      mfd: "Professional Risk Profile",
    },
    {
      diy: "Chatbot",
      middle: "After-sales Support",
      mfd: "1:1 Grievance Solving",
    },
    {
      diy: "High chance of emotional decisions",
      middle: "Discipline",
      mfd: "Regular check-ins & Disciplined Investing",
    },
    {
      diy: "Manual",
      middle: "Regular Portfolio Checkup",
      mfd: "Portfolio Check-ups & Rebalancing",
    },
  ];

  return (
    <section className="bg-[var(--rv-bg-white)] px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto main-section text-center flex flex-col gap-5 md:gap-8">
        <div>
          <Heading heading={'Why Choose an MFD?'} description={'You can choose funds on your own — or work with someone who does this every day and helps you avoid big mistakes.'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
          <div className="flex flex-col gap-4">
            <h6 className="text-[var(--rv-primary-dark)]">
              DIY Platforms
            </h6>
            {comparison.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="border border-[var(--rv-secondary)] text-[var(--rv-priamry-dark)] py-3 px-2 rounded-xl bg-[var(--rv-bg-white)]"
              >
                {item.diy}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="text-[var(--rv-black)]">
              Comparison
            </h6>
            {comparison.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-[var(--rv-secondary)] py-3 px-2 rounded-xl  font-semibold bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-secondary)] text-[var(--rv-white)] shadow-md"
              >
                {item.middle}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="text-[var(--rv-primary-dark)]">
              With an MFD
            </h6>
            {comparison.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="border border-[var(--rv-secondary)] text-[var(--rv-priamry-dark)] py-3 px-2 rounded-xl bg-[var(--rv-bg-white)]"
              >
                {item.mfd}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mx-auto">
          <Button text="Invest With Us Today" link="/login" />
        </div>
      </div>
    </section>
  );
};

export default DiyVsMfd3;
