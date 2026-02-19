"use client";
import React from "react";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";


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
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center">
        <h3 className="font-extrabold">
          {inView ? (
            <CountUp
              className="sm:text-3xl text-2xl md:text-4xl"
              start={0}
              end={numericValue}
              duration={2}
              separator=","
            />
          ) : (
            "0"
          )}
          {hasPlus && "+"}
          {hasPercent && "%"}
        </h3>

        {stat?.subtitle && <h6 className="">{stat.subtitle}</h6>}
      </div>

      <p className="font-semibold text-[var(--rv-primary)]">{stat?.title}</p>
    </motion.div>
  );
};

const AboutTheme4 = ({ aboutData, stats }) => {
  return (
    <section className="relative bg-[var(--rv-bg-white)] px-4 text-[var(--rv-black)] overflow-hidden">
      <div className="main-section border-b">
        <div className="relative max-w-7xl mx-auto flex flex-col gap-5 md:gap-8">
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-8">
            <div className="flex flex-col gap-6">
              <Heading align="start" title={'ABOUT US'} heading={aboutData?.[0]?.title || ""} description={aboutData?.[0]?.description} />
              <div>
                <Button text={'Start Your Journey'} link="/contact-us" className={'border border-[var(--rv-primary)]'} />
              </div>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  {stats?.map((stat, index) => (
                    <StatCard key={index} stat={stat} index={index} />
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl shadow-2xl w-full h-full">
              <img
                src={aboutData[0]?.image?.url || '/images/client.jpg'}
                alt="Business Expert"
                className="md:w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTheme4;
