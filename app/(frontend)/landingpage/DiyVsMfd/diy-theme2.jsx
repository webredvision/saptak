"use client";
import { motion } from "framer-motion";
import React from "react";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";

const DiyVsMfd2 = () => {
  const comparison = [
    {
      diy: "Self-research",
      mfd: "A qualified MFD assists your investing",
    },
    {
      diy: "Basic questionnaire",
      mfd: "Deep, professional risk profiling",
    },
    {
      diy: "Chatbot support",
      mfd: "1:1 human support & grievance solving",
    },
    {
      diy: "Emotional decision-making",
      mfd: "Regular check-ins & disciplined investing",
    },
    {
      diy: "Manual tracking & rebalancing",
      mfd: "Proactive portfolio reviews & rebalancing",
    },
  ];

  return (
    <section className="bg-[var(--rv-bg-black)] text-[var(--rv-white)] px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto main-section-bottom flex flex-col gap-5 md:gap-8">
        <Heading
          title="DIY vs Guided Investing"
          heading="DIY Platforms vs Investing With an MFD"
          highlight="MFD"
          description="Control is powerful — but guidance protects you from costly mistakes, emotional bias, and poor asset allocation."
        />

        <div className="relative flex flex-col gap-5 md:gap-8">
          <div className="absolute left-1/2 top-[12%] -translate-x-1/2 h-[90%] border-l border-dashed border-[var(--rv-primary)] hidden md:block" />

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 bg-[var(--rv-bg-white-light)] rounded-full px-4 py-2">
              <p className="">
                DIY Platforms
              </p>
              <div className="w-8 h-8 bg-[var(--rv-white)] text-[var(--rv-black)] font-semibold rounded-full flex items-center justify-center">
                vs
              </div>
              <p className="text-[var(--rv-primary)]">
                With an MFD
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {comparison.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6"
              >
                <div className="relative rounded-xl bg-[url('/images/svg2.svg')] p-4 bg-cover bg-center">
                  <p className="uppercase opacity-60 mb-1">DIY</p>
                  <p className="font-medium">{row.diy}</p>
                </div>

                <div className="relative md:flex justify-center hidden">
                  <div className="h-14 w-14 rounded-full bg-[var(--rv-primary)] text-[var(--rv-black)] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(191,255,0,0.6)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="relative rounded-xl bg-[url('/images/svg1.svg')] p-4 pl-8 bg-cover bg-center">
                  <p className="uppercase text-[var(--rv-primary)] mb-1">
                    With an MFD
                  </p>
                  <p className="font-medium ">
                    {row.mfd}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mx-auto">
          <Button text="Start Guided Investing" link="/login" />
        </div>
      </div>
    </section>
  );
};

export default DiyVsMfd2;
