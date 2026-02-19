"use client";

import React from "react";
import Image from "next/image";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const data = [
  {
    title: "Retirement Planning",
    description: "Secure your post-retirement lifestyle with a strong financial strategy.",
    icon: "/images/icons/retirement.svg",
  },
  {
    title: "Education Planning",
    description: "Build the right corpus for your children's education journey.",
    icon: "/images/icons/education.svg",
  },
  {
    title: "Marriage Planning",
    description: "Plan for wedding expenses and future responsibilities.",
    icon: "/images/icons/marriage.svg",
  },
  {
    title: "Car Planning",
    description: "Make smart decisions for your next car purchase.",
    icon: "/images/icons/car.svg",
  },
  {
    title: "Vacation Planning",
    description: "Plan dream vacations without breaking the bank.",
    icon: "/images/icons/vacation.svg",
  },
  {
    title: "House Planning",
    description: "Save and invest wisely to buy your dream home.",
    icon: "/images/icons/house.svg",
  },
  {
    title: "Life Planning",
    description: "Protect your family with the right life insurance plan.",
    icon: "/images/icons/insurance.svg",
  },
];

const GoalPlanningTheme4 = () => {
  return (
    <section className="bg-[var(--rv-bg-secondary)] px-4 text-[var(--rv-white)]">
      <div className="max-w-7xl mx-auto flex flex-col gap-5 md:gap-8">
        <Heading
          heading="What are you investing for?"
          description="Plan your goals with clarity and purpose. Choose from various life events and start preparing today."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl border border-[var(--rv-primary)]   md:p-6 p-4 hover:border-[var(--rv-primary)]"
            >
              <div className="relative z-10 flex flex-col h-full gap-2">
                <div className="flex items-center justify-between">
                  <h6 className="font-semibold text-[var(--rv-primary)]">
                    {item.title}
                  </h6>
                  <span className="w-12 h-12 rounded-full bg-[var(--rv-primary)]/10 flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={32}
                      height={32}
                    />
                  </span>
                </div>

                <p className="text-[var(--rv-white)] leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-[var(--rv-primary)]">
                  <span>Start Planning</span>
                  <FiArrowRight />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GoalPlanningTheme4;
