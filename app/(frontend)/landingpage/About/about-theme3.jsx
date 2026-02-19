"use client";
import React from "react";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";

const AboutTheme3 = ({ aboutData, otherData }) => {
  return (
    <section className="bg-[var(--rv-bg-white) px-4">
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
        <div className="">
          <Heading title={'About Us'} align="start" heading={aboutData?.[0]?.title} />

          <p
            className=""
            dangerouslySetInnerHTML={{ __html: aboutData?.[0]?.description }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 items-center">
          <div className="relative w-full h-full order-2 lg:order-1">
            <img
              src={aboutData?.[0]?.image?.url || "/images/client.jpg"}
              alt="About"
              className="rounded-2xl w-full h-full object-cover"
            />

            <div className="absolute -bottom-10 left-6 bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-bg-secondary)] text-[var(--rv-white)] rounded-xl overflow-hidden">
              <div className="px-6 py-4 text-4xl font-bold">
                {otherData?.experience || "23+"}
              </div>
              <div className="bg-gradient-to-r from-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] px-6 py-2 text-sm">
                Years of Experience
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5  order-1 lg:order-2">
            <div className="">
              <h6 className="font-semibold">Our Vision</h6>
              <p className="">
                {otherData?.vision}
              </p>
            </div>
            <div className="">
              <h6 className="font-semibold">Our Mission</h6>
              <p className="">
                {otherData?.mission}
              </p>
            </div>
            <div className="">
              <h6 className="font-semibold">Our Values</h6>
              <p
                className=""
                dangerouslySetInnerHTML={{ __html: otherData?.values }}
              />
            </div>
            <div>
              <Button link={'/about-us'} className={'w-fit'} text="Learn More" />
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default AboutTheme3;
