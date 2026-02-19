"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const GoalPlanningTheme3 = () => {
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

  return (
    <motion.section
      className="bg-[var(--rv-bg-white)] px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            heading={"WHAT ARE YOU INVESTING FOR?"}
            highlight={'INVESTING'}
            description={
              "Plan your goals with clarity and purpose. Choose from various life events and start preparing today."
            }
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {data?.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0px 18px 45px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-[var(--rv-bg-white)] rounded-2xl p-6 shadow-sm border border-[var(--rv-primary)] flex flex-col gap-2 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4">
                <h6 className="font-bold text-[var(--rv-primary)]">
                  {item.title}
                </h6>

                <motion.button
                  className="rounded-full w-7 h-7 bg-[var(--rv-bg-primary)] flex items-center justify-center shadow-md"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.93, rotate: 0 }}
                >
                  <FiArrowRight className="text-[var(--rv-white)] text-lg" />
                </motion.button>
              </div>

              <p>{item.description}</p>

              {item.icon && (
                <div className="w-12 h-12 mt-3">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GoalPlanningTheme3;
