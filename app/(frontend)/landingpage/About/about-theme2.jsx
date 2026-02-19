"use client";
import React from "react";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { GiTrophyCup } from "react-icons/gi";

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
      className="p-4 flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div>
        <GiTrophyCup className="text-5xl text-[var(--rv-primary)]" />
      </div>
      <div className="flex items-center gap-1 justify-start">
        <h3 className="font-semibold">
          {inView ? (
            <CountUp
              className="sm:text-3xl text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-[var(--rv-white)]"
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
      <p className="font-semibold">{stat?.title}</p>
    </motion.div>
  );
};

const AboutTheme2 = ({ aboutData, otherData, stats }) => {
  return (
    <section className="bg-[var(--rv-bg-black)] p-2 md:p-4 text-[var(--rv-white)] overflow-hidden">
      <div className="relative ">
        <div className="relative grid lg:grid-cols-2 items-center">
          <div className="w-full h-full bg-[var(--rv-bg-black)] md:pr-5 pb-5 rounded-xl">
            <div className="w-full h-full">
              <img
                src={aboutData?.[0]?.image?.url || "/images/client.jpg"}
                alt="Business Expert"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          <div className="w-full bg-[var(--rv-bg-secondary)] rounded-t-xl p-3 md:pt-5 md:pl-5">
            <div className="max-w-[39rem] flex flex-col gap-5">
              <Heading align="start" title={'ABOUT US'} heading={aboutData?.[0]?.title || ""} description={aboutData?.[0]?.description}
              />
              <div className="w-fit">
                <Button link={'/contact-us'} className={'w-fit'} text={'Start Your Journey'} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[var(--rv-bg-black)] flex flex-col gap-2 p-3 rounded-xl text-[var(--rv-white)]">
                  <h6 className="text-[var(--rv-primary)]">Mission</h6>
                  <p>{otherData?.mission}</p>
                </div>
                <div className="bg-[var(--rv-bg-black)] flex flex-col gap-2 p-3 rounded-xl text-[var(--rv-white)]">
                  <h6 className="text-[var(--rv-primary)]">Vision</h6>
                  <p>{otherData?.vision}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative bg-[var(--rv-bg-secondary)] md:rounded-tl-xl rounded-b-xl p-3 md:p-5">
        <div className="relative main-section grid grid-cols-1 gap-5 md:gap-8 items-center">
          <div className="max-w-7xl mx-auto p-3 bg-[var(--rv-bg-black)] rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {stats?.map((stat, index) => (
              <div key={index} className={`w-full border-white/10 ${index ==1 ? "border-r-0 md:border-r": ""} ${index ==3 ? "md:border-0": "border-r"}`}>
                <StatCard key={index} stat={stat} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTheme2;
