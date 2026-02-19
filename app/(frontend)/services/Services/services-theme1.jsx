"use client";
import React from "react";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

const ServicesTheme1 = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <InnerPage title={data?.name} />
      <main className="overflow-hidden">
        <section className="relative bg-[var(--rv-bg-white)] px-4 md:p-10 py-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
            >
              <h1 className="font-bold mb-4">{data?.name}</h1>
              <div
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
              <div className="flex gap-2 items-center flex-wrap mt-4">
                <Button
                  link={"/contact-us"}
                  className={`bg-[var(--rv-bg-primary)] text-[var(--rv-white)] hover:bg-[var(--rv-bg-secondary)]`}
                  text={"Talk to an Expert"}
                />
              </div>
            </motion.div>

            <motion.div
              className="relative md:p-10"
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.1}
            >
              <img
                src={
                  data?.image?.status
                    ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${data?.image?.url}`
                    : `${process.env.NEXT_PUBLIC_DATA_API}${data?.image?.url}`
                }
                alt={data?.name}
                className="w-full h-full object-contain rounded-2xl"
              />
            </motion.div>
          </div>
        </section>

        {data?.benefits?.length > 0 && (
          <section
            className="px-4 bg-[var(--rv-bg-primary)]"
            style={{
              backgroundImage: "url('/images/vector.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                custom={0}
              >
                <Heading
                  variant="light"
                  heading="Explore Different Mutual Fund Options"
                  description="Each type offers distinct benefits for various investment goals."
                />
              </motion.div>

              <motion.div
                className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {data?.benefits?.map((b, index) => (
                  <motion.div
                    key={b._id}
                    variants={fadeUp}
                    custom={0.1 + index * 0.1}
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    className="bg-[var(--rv-bg-white-light)] p-5 rounded-xl flex flex-col gap-3 text-left transition shadow-sm hover:shadow-lg"
                  >
                    <div className="w-16 h-16 bg-[var(--rv-bg-white-light)] p-2 rounded-xl">
                      <img
                        src={
                          b?.icon?.status
                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${b?.icon?.url}`
                            : `${process.env.NEXT_PUBLIC_DATA_API}${b?.icon?.url}`
                        }
                        alt={data?.name}
                        className="w-full h-full brightness-0 filter invert"
                      />
                    </div>
                    <h6 className="font-semibold text-[var(--rv-white)]">
                      {b.title}
                    </h6>
                    <div
                      className="text-[var(--rv-white)] text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: b.description }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {data?.features?.length > 0 && (
          <section className="px-4 bg-[var(--rv-bg-white)]">
            <div className="max-w-7xl mx-auto text-center main-section flex flex-col gap-5 md:gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                custom={0}
              >
                <Heading
                  heading="Why Choose This Service"
                  description="Explore the unique advantages this service provides."
                />
              </motion.div>

              <motion.div
                className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {data?.features?.map((item, index) => (
                  <motion.div
                    key={item._id}
                    variants={fadeUp}
                    custom={0.1 + index * 0.1}
                    whileHover={{
                      y: -6,
                      boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
                      transition: { duration: 0.2 },
                    }}
                    className="bg-[var(--rv-bg-white)] p-5 flex flex-col items-start text-start gap-3 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 p-2 rounded-md bg-[var(--rv-bg-primary)]">
                        <img
                          src={
                            item?.icon?.status
                              ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${item?.icon?.url}`
                              : `${process.env.NEXT_PUBLIC_DATA_API}${item?.icon?.url}`
                          }
                          alt={data?.name}
                          className="w-full h-full filter brightness-0 invert"
                        />
                      </div>
                      <h6 className="font-semibold text-[var(--rv-primary)]">
                        {item?.title}
                      </h6>
                    </div>
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ServicesTheme1;
