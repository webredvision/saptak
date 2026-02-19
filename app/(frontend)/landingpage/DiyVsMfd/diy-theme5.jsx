"use client";

import { motion } from "framer-motion";
import React from "react";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { FaCheck, FaLongArrowAltRight, FaUserTie } from "react-icons/fa";

/**
 * Redesigned DIY vs MFD comparison
 * - Table-like rows with centered connector
 * - Icon badges, subtle shadows, hover lift
 * - Responsive: stacks on small screens, two-column rows on md+
 */

const DiyVsMfd5 = () => {
  const comparison = [
    {
      diy: "Self-research",
      mfd: "Guided by a certified MFD",
    },
    {
      diy: "Basic questionnaire",
      mfd: "Comprehensive risk profiling",
    },
    {
      diy: "Automated chatbot support",
      mfd: "Dedicated 1:1 advisor support",
    },
    {
      diy: "Higher chance of emotional decisions",
      mfd: "Periodic reviews & disciplined rebalancing",
    },
    {
      diy: "Manual portfolio tracking",
      mfd: "Regular portfolio check-ups & rebalancing",
    },
  ];

  return (
    <section className="bg-[var(--rv-bg-white)] px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-5">
        <Heading
          title={"DIY vs Guided Investing"}
          heading={"Why Choose an MFD ?"}
          highlight={'MFD'}
          description={
            "Choose between doing it yourself or partnering with an expert who helps you avoid mistakes and stay disciplined."
          }
        />

        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl border overflow-hidden">
              <div className="p-4 md:p-6 bg-[var(--rv-bg-primary)] text-[var(--rv-white)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[var(--rv-bg-white-light)] flex items-center justify-center">
                    <FaCheck className="w-5 h-5 text-[var(--rv-white)]" />
                  </div>
                  <div>
                    <h6 className="font-semibold">DIY Platforms</h6>
                    <p className="opacity-80 mt-1">
                      Tools & platforms for self-directed investors.
                    </p>
                  </div>
                </div>
              </div>

             
              <div className="p-4 md:p-6 bg-[var(--rv-bg-secondary)] text-[var(--rv-white)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[var(--rv-bg-white-light)] flex items-center justify-center">
                    <FaUserTie className="w-5 h-5 " />
                  </div>
                  <div>
                    <h6 className="font-semibold">With an MFD</h6>
                    <p className="opacity-80 mt-1">
                      Personalised advice, monitoring & behavioural discipline.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-2 md:p-4">
                <div className="space-y-4 md:space-y-6">
                  {comparison.map((row, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.36, delay: idx * 0.06 }}
                      className="relative grid grid-cols-1 md:grid-cols-2 border p-2 rounded items-center gap-4 md:gap-8">
                      <div className="flex items-center gap-3 md:justify-start">
                        <div className="w-3 h-3 rounded-full bg-[var(--rv-bg-primary)] shrink-0" />
                        <p className="">{row.diy}</p>
                      </div>
                      <div className="flex items-center gap-3 md:justify-start">
                        <div className="w-3 h-3 rounded-full bg-[var(--rv-bg-secondary)] shrink-0" />
                        <p className="">{row.mfd}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
        </div>

        <div className=" flex justify-center">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }}>
            <Button
              Icon={FaLongArrowAltRight}
              text="Invest With Us Today"
              link="/login"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiyVsMfd5;
