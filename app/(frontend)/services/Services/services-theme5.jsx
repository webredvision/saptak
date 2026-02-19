"use client";
import React from "react";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { FaLongArrowAltRight } from "react-icons/fa";
const ServicesTheme5 = ({ data }) => {
  if (!data) return null;
  return (
    <div>
      <InnerPage title={data?.name} />
      <main className="overflow-hidden">
        <section className="relative bg-[var(--rv-bg-white)] px-4">
          <div className="max-w-7xl mx-auto main-section flex flex-col gap-10 md:gap-20">
            <div className="grid md:grid-cols-2 gap-g md:gap-8 items-center justify-center w-full h-full">
              <div className="w-full h-full flex flex-col gap-4 items-start justify-center">
                <h1
                  className="font-bold"
                >
                  {data?.name}
                </h1>
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                />
                <Button
                  link={'/contact-us'}
                  text={"Get Started"}
                />

              </div>
              <div className="w-full h-full">
                <img
                  src={
                    data?.image?.status
                      ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${data?.image?.url}`
                      : `${process.env.NEXT_PUBLIC_DATA_API}${data?.image?.url}`
                  }
                  alt={data?.name}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </div>

            {data?.features?.length > 0 && (
              <div className="flex flex-col gap-5 md:gap-8">
                <Heading
                  title="Key Features"
                  heading="Why Choose This Service"
                  description="Explore the unique advantages this service provides."
                />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {data?.features?.map((item) => (
                    <div
                      key={item._id}
                      className="bg-[var(--rv-bg-white)] p-5 flex flex-col items-start text-start gap-3 rounded-xl shadow-sm border"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 p-2 rounded-md bg-[var(--rv-bg-secondary)]">
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
                        <h6 className="font-semibold text-[var(--rv-secondary)]">
                          {item?.title}
                        </h6>
                      </div>
                      <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.benefits?.length > 0 && (
              <div className="flex flex-col gap-5 md:gap-8">
                <Heading
                  title="Fund Types"
                  heading="Explore Different Mutual Fund Options"
                  description="Each type offers distinct benefits for various investment goals."
                />
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {data?.benefits?.map((b) => (
                    <div
                      key={b._id}
                      className="bg-[var(--rv-bg-white)] p-5 flex flex-col items-start text-start gap-3 rounded-xl shadow-sm border"
                    >
                      <div className="w-12 h-12">
                        <img
                          src={
                            b?.icon?.status
                              ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${b?.icon?.url}`
                              : `${process.env.NEXT_PUBLIC_DATA_API}${b?.icon?.url}`
                          }
                          alt={data?.name}
                          className="w-full h-full mix-blend-multiply"
                        />
                      </div>
                      <h5 className="font-semibold text-[var(--rv-secondary)]">
                        {b.title}
                      </h5>
                      <div
                        className="text-[var(--rv-gray-dark)] text-sm"
                        dangerouslySetInnerHTML={{ __html: b.description }}
                      />
                    </div>
                  ))}
                </div>
              </div>

            )}
            <div className="p-10 bg-[var(--rv-bg-secondary)] border border-[var(--rv-black-light)] text-center rounded-xl">
              <div className="flex flex-col items-center gap-5 md:gap-8 p-4">
                <Heading
                  variant="light"
                  heading={"Ready to take control of your financial future?"}
                  description={
                    "Contact us today to learn more about our expert financial planning services and to schedule a consultation with one of our experienced planners."
                  } />
                <div>
                  <Button link={'/contact-us'} variant={'light'} text={"Get in touch"} Icon={FaLongArrowAltRight} className={''} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesTheme5;
