"use client";
import React from "react";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { motion } from "framer-motion";

const ServicesTheme3 = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-[var(--rv-bg-white)]">
      <InnerPage title={data?.name} />

      <main className="overflow-hidden px-4">
        <section className="main-section max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-5"
            >
              <h3 className="font-bold text-[var(--rv-secondary)]">
                {data?.name}
              </h3>

              <div
                className="text-[var(--rv-text-muted)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />

              <div className="flex gap-3 flex-wrap">
                <Button
                  link="/contact-us"
                  text="Get Started  "
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative md:pl-10"
            >
              <img
                src={
                  data?.image?.status
                    ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${data?.image?.url}`
                    : `${process.env.NEXT_PUBLIC_DATA_API}${data?.image?.url}`
                }
                alt={data?.name}
                className="w-full h-full object-contain rounded-3xl shadow-lg"
              />
            </motion.div>
          </div>
          {data?.benefits?.length > 0 && (
            <div className="main-section flex flex-col gap-10">
              <Heading
                title="Fund Types"
                heading="Explore Different Mutual Fund Options"
                highlight={'Mutual Fund Options'}
                description="Choose the right fund type that aligns with your financial goals."
              />

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                {data?.benefits?.map((b, i) => (
                  <motion.div
                    key={b._id}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--rv-bg-white)] text-[var(--rv-black)] p-6 rounded-xl border flex flex-col gap-4"
                  >
                    <div className="w-14 h-14">
                      <img
                        src={
                          b?.icon?.status
                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${b?.icon?.url}`
                            : `${process.env.NEXT_PUBLIC_DATA_API}${b?.icon?.url}`
                        }
                        alt={b.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <h5 className="font-semibold text-[var(--rv-secondary)]">
                      {b.title}
                    </h5>

                    <div
                      className="text-[var(--rv-text-muted)]"
                      dangerouslySetInnerHTML={{ __html: b.description }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {data?.features?.length > 0 && (
            <div className="">
              <div className="main-section-bottom flex flex-col gap-5 text-center">
                <Heading
                  title="Key Features"
                  heading="Why Choose This Service"
                  highlight={'Service'}
                  description="Smart features designed to give you confidence and clarity."
                />

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {data?.features?.map((item) => (
                    <motion.div
                      key={item._id}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[var(--rv-bg-white)] p-5 rounded-xl border text-left flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 p-2 rounded-xl bg-[var(--rv-bg-primary)]">
                          <img
                            src={
                              item?.icon?.status
                                ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${item?.icon?.url}`
                                : `${process.env.NEXT_PUBLIC_DATA_API}${item?.icon?.url}`
                            }
                            alt={item?.title}
                            className="w-full h-full filter brightness-0 invert"
                          />
                        </div>

                        <h6 className="font-semibold text-[var(--rv-primary)]">
                          {item?.title}
                        </h6>
                      </div>
                      <div
                        className="text-[var(--rv-text-muted)]"
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}


          <div
            className="main-section rounded-xl text-center text-[var(--rv-white)]
            bg-[var(--rv-bg-primary)] relative overflow-hidden"
          >
            <div className="flex flex-col gap-4 items-center relative z-10 px-10">
              <h2 className="text-2xl md:text-4xl font-bold">
                Secure Your Financial Future With Expert Guidance
              </h2>
              <p className="max-w-2xl text-[var(--rv-white)] opacity-90">
                From Mutual Funds to Insurance, Loans to Fixed Deposits —
                personalized solutions tailored for your goals.
              </p>

              <Button
                text="Plan With Us"
                link="/contact-us"
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ServicesTheme3;
