import React from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import Heading from '@/app/components/Heading/Heading';
import Button from '@/app/components/Button/Button';
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
      className="flex items-center flex-wrap gap-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-1 ">
        <h3 className="font-extrabold">
          {inView ? (
            <CountUp
              className="sm:text-3xl text-2xl md:text-4xl lg:text-5xl"
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

      <p className="">{stat?.title}</p>
    </motion.div>
  );
};

const AboutTheme5 = ({ aboutData, stats }) => {
  return (
    <div className="bg-[var(--rv-bg-white)] px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 items-center">
          <div className='flex flex-col gap-4 items-start md:col-span-2'>
            <Heading align="start" title={'ABOUT US'} heading={aboutData?.[0]?.title || ""} description={aboutData?.[0]?.description} />
            <Button text="Read More" link="/contact-us" Icon={FaLongArrowAltRight} />
          </div>
          <div className="relative w-full">
            <div className="rounded-xl shadow-2xl">
              <img
                src={aboutData[0]?.image?.url || '/images/client.jpg'}
                alt="Business Expert"
                className="md:w-full h-[420px] object-cover rounded-xl"
              />
            </div>
          </div>
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading align="start" title={"Our Stats"} />

            <div className="grid grid-cols-1 gap-5 md:gap-10">
              {stats?.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutTheme5;
