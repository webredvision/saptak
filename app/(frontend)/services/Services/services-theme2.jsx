"use client";
import React from "react";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";

const ServicesTheme2 = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <InnerPage title={data?.name} />
      <main className="overflow-hidden">
        <div className="relative bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 main-section gap-10 items-center">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src={
                    data?.image?.status
                      ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${data?.image?.url}`
                      : `${process.env.NEXT_PUBLIC_DATA_API}${data?.image?.url}`
                  }
                  alt={data?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="font-bold">
                  {data?.name}
                </h1>
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                />
                <div className="flex gap-2 items-center flex-wrap">
                  <Button
                    link={'/contact-us'}
                    text={"Read More"}
                  />
                </div>
              </div>
            </div>

            {data?.benefits?.length > 0 && (
              <div className="flex flex-col gap-10 md:gap-16">
                <Heading
                  title="Fund Types"
                  heading={`Explore Different ${data?.name} Options`}
                  highlight={`Different`}
                  description="Each type offers distinct benefits for various investment goals."
                />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                  {data?.benefits?.map((b) => (
                    <div
                      key={b._id}
                      className="p-5 pt-12 rounded-xl flex flex-col gap-3 text-left transition relative group border   border-[var(--rv-white-light)]"
                    >
                      <div className="md:w-16 w-12 md:h-16 h-12 absolute top-0 left-0 translate-x-1/2 -translate-y-1/2 group-hover:bg-[var(--rv-bg-white)] border   border-[var(--rv-white-light)] p-2 rounded-lg bg-[var(--rv-secondary)] duration-500 transition-all">
                        <img
                          src={
                            b?.icon?.status
                              ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${b?.icon?.url}`
                              : `${process.env.NEXT_PUBLIC_DATA_API}${b?.icon?.url}`
                          }
                          alt={data?.name}
                          className="w-full h-full filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                        />
                      </div>
                      <h6 className="font-semibold">
                        {b.title}
                      </h6>
                      <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: b.description }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.features?.length > 0 && (
              <div className="text-center main-section flex flex-col gap-10 md:gap-16">
                <Heading
                  title="Key Features"
                  heading="Why Choose This Service"
                  highlight={'Service'}
                  description="Explore the unique advantages this service provides."
                />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-12">
                  {data?.features?.map((b) => (
                    <div
                      key={b._id}
                      className="p-5 pt-12 rounded-xl flex flex-col gap-3 text-left transition relative group border   border-[var(--rv-white-light)]"
                    >
                      <div className="flex flex-col items-start gap-2">
                        <div className="md:w-16 w-12 md:h-16 h-12 absolute top-0 left-0 translate-x-1/2 -translate-y-1/2 group-hover:bg-[var(--rv-bg-white)] border   border-[var(--rv-white-light)] p-2 rounded-lg bg-[var(--rv-secondary)] duration-500 transition-all">
                          <img
                            src={
                              b?.icon?.status
                                ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${b?.icon?.url}`
                                : `${process.env.NEXT_PUBLIC_DATA_API}${b?.icon?.url}`
                            }
                            alt={data?.name}
                            className="w-full h-full filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                          />
                        </div>
                        <h6 className="font-semibold">
                          {b.title}
                        </h6>
                        <div
                          className=""
                          dangerouslySetInnerHTML={{ __html: b.description }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="main-section-bottom">
              <div
                className="max-w-7xl mx-auto p-10 border   border-[var(--rv-white-light)] text-center rounded-xl md:rounded-3xl"
              >
                <div className="flex flex-col items-center gap-5 md:gap-8 p-4">
                  <Heading
                    variant="light"
                    heading={"Ready to take control of your financial future?"}
                    description={
                      "Contact us today to learn more about our expert financial planning services and to schedule a consultation with one of our experienced planners."
                    } />
                  <div>
                    <Button link={'/contact-us'} text={"Get in touch"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicesTheme2;
