"use client";

import React from "react";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { motion } from "framer-motion";

const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

const cardsContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariant = {
  hidden: (custom) => ({
    opacity: 0,
    x: custom && custom.direction === "left" ? -40 : 40,
    y: 20,
  }),
  visible: (custom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.55,
      delay: custom ? custom.delay : 0,
      ease: "easeOut",
    },
  }),
};

const ServiceCard1 = ({ services }) => {
  return (
    <>
      <InnerPage title={"Services"} />
      <section className="px-4 bg-[var(--rv-bg-white)]">
        <div className="max-w-7xl mx-auto main-section text-center flex flex-col gap-5 md:gap-8">
          <motion.div
            variants={sectionFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <Heading
              heading={" Our Core Financial Services"}
              description={
                " Explore our range of investment and financial planning services designed to help you build, protect, and grow your wealth with confidence."
              }
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={cardsContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {services?.map((service, index) => {
              const direction = index % 2 === 0 ? "left" : "right";
              const delay = 0.1 + index * 0.08;

              return (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  custom={{ direction, delay }}
                >
                  <motion.div
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                      transition: { duration: 0.2 },
                    }}
                    className="bg-[var(--rv-bg-white)] rounded-xl shadow-md md:p-6 p-4 h-full flex flex-col gap-3 justify-between transition-all duration-300 text-left border border-[var(--rv-primary)]"
                  >
                    <motion.div
                      whileHover={{
                        rotate: -3,
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      className="bg-[var(--rv-bg-primary)] w-14 h-14 p-2 rounded-md flex items-center justify-center"
                    >
                      <img
                        src={
                          service?.icon?.status
                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${service?.icon?.url}`
                            : `${process.env.NEXT_PUBLIC_DATA_API}${service?.icon?.url}`
                        }
                        alt={service?.name}
                        className="w-full h-full filter brightness-0 invert"
                      />
                    </motion.div>

                    <h5 className="font-semibold text-[var(--rv-primary)]">
                      {service?.name}
                    </h5>

                    <p
                      className="text-[var(--rv-black)] line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: service?.description,
                      }}
                    />

                    <div className="pt-2">
                      <Button
                        link={`/services/${service?.link}`}
                        text="Learn More"
                        className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] hover:bg-[var(--rv-bg-secondary)] font-semibold"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServiceCard1;
