"use client";

import React from "react";
import Heading from "@/app/components/Heading/Heading";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import Button from "@/app/components/Button/Button";
import { FaLongArrowAltRight } from "react-icons/fa";

const StatCard = ({ stat, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const rawNumber = stat?.statsNumber || "0";
  const numericValue = parseInt(rawNumber.replace(/[^\d]/g, ""), 10) || 0;
  const hasPlus = rawNumber.includes("+");
  const hasPercent = rawNumber.includes("%");

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center justify-center gap-1">
        <h3 className="font-bold text-[var(--rv-primary)]">
          {inView ? (
            <CountUp end={numericValue} duration={2} separator="," className="text-3xl sm:text-4xl md:text-5xl" />
          ) : (
            0
          )}
          {hasPlus && "+"}
          {hasPercent && "%"}
        </h3>

        {stat?.subtitle && (
          <h6 className="">{stat.subtitle}</h6>
        )}
      </div>

      <p className="mt-2 font-semibold text-[var(--rv-gray-dark)]">{stat?.title}</p>
    </motion.div>
  );
};

const AboutTheme1 = ({ aboutData, stats }) => {
  return (
    <section
      className="
        relative overflow-hidden bg-[var(--rv-white)]
        rounded-3xl
        px-4
      "
    >
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col gap-6">
            <Heading align="start" title={'ABOUT US'} heading={aboutData?.[0]?.title || ""} description={aboutData?.[0]?.description} />
          </div>

          <div className="relative flex items-start w-full overflow-hidden gap-5">
            <div className="flex flex-col gap-5 w-full">
              <div className="w-full h-[280px] rounded-xl overflow-hidden">
                <img
                  src={aboutData[0]?.image?.url}
                  alt={aboutData[0]?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Button
                  link="/about-us"
                  text="Learn More"
                  Icon={FaLongArrowAltRight}
                />
              </div>
            </div>
            <div className="w-full h-[350px] hidden md:block rounded-xl overflow-hidden">
              <img
                src={aboutData[0]?.image?.url}
                alt={aboutData[0]?.title}
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </motion.div>
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heading align="start" heading="Our Impact in Numbers" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats?.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTheme1;
