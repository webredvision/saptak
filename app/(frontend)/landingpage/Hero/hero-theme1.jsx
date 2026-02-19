"use client";
import { motion } from "framer-motion";
import Button from "@/app/components/Button/Button";
import { FaLongArrowAltRight } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import { useState } from "react";
import { BsLightningFill } from "react-icons/bs";

const HeroTheme1 = ({ amcLogosData = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const logos = amcLogosData.concat(amcLogosData);

  return (
    <section
      className="
        relative w-full z-10 px-4 flex items-center justify-center
        overflow-hidden text-[var(--rv-white)]
        bg-[var(--rv-bg-secondary)]
        before:content-['']
        before:absolute before:inset-0
        before:bg-[url('/images/vector1.png')]
        before:bg-cover before:bg-center
        before:brightness-0 before:invert before:opacity-[0.05]
        before:-z-10
      "
    >
      <div className="main-section-top w-full">
        <div className="max-w-7xl mx-auto w-full main-section flex flex-col gap-10 md:gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
            <motion.div
              className="flex flex-col gap-3 sm:gap-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                className="inline-flex items-center gap-2 font-semibold tracking-[0.15em] bg-[var(--rv-bg-white-light)] w-fit px-4 py-1 rounded-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                <BsLightningFill className="text-[var(--rv-primary)]" />  Start With a Dream
              </motion.span>

              <motion.h1
                className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
              >
                Your Journey to 
              </motion.h1>
              <motion.h1
                className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl -mt-3 text-[var(--rv-primary)]"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
              >
                Wealth Starts 
              </motion.h1>
              <motion.h1
                className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl -mt-3"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
              >
                Here
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Whether you're investing for freedom, family, or your future —
                it starts with a goal. Pick what matters most, and we'll build a
                personalized plan.
              </motion.p>

              <motion.div
                className="flex gap-3 items-center flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button
                  link="/login"
                  text="Let’s Start Planning"
                  Icon={FaLongArrowAltRight}
                />
              </motion.div>
            </motion.div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="md:hidden">
              <Heading title="Our Globally 20K+ Clients." variant="light" align="start" />
            </div>
            <div className="w-full p-5 py-6 border border-[var(--rv-white-light)] rounded-xl relative">
              <div className="w-fit hidden md:block rounded-full whitespace-nowrap absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--rv-bg-secondary)] px-4">
                <Heading title="Our Globally 20K+ Clients." variant="light" />
              </div>


              <div className="w-full flex flex-col gap-5 whitespace-nowrap overflow-hidden relative">
                <div className="absolute inset-0 z-10 flex justify-between">
                  <div className="w-20 bg-gradient-to-l from-transparent to-[var(--rv-bg-secondary)]" />
                  <div className="w-20 bg-gradient-to-r from-transparent to-[var(--rv-bg-secondary)]" />
                </div>

                <div className="slider-row animate-right-left flex items-center gap-5">
                  {logos.map((item, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="w-28 h-10 sm:w-32 sm:h-12 md:w-40 md:h-16 p-1 bg-[var(--rv-bg-white)] shadow-md border flex-shrink-0 rounded-lg"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_DATA_API}${item.logo}`}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroTheme1;
