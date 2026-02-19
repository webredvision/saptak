"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/app/components/Heading/Heading";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Button from "@/app/components/Button/Button";
import { FaLongArrowAltRight } from "react-icons/fa";

const ServicecardTheme1 = ({ services = [] }) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (services.length > 0) {
      setActiveId(services[0]._id);
    }
  }, [services]);

  return (
    <section className="px-4 bg-[var(--rv-bg-white)]">
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-10">
        <Heading
          title="Services"
          heading="Our Core Financial Services"
          description="Explore our range of investment and financial planning services designed to help you build, protect, and grow your wealth with confidence."
        />

        <div className="hidden lg:flex gap-4 h-[500px]">
          {services?.slice(0, 6).map((service, index) => {
            const isActive = service._id === activeId;
            const imageUrl = service?.image?.status
              ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${service?.image?.url}`
              : `${process.env.NEXT_PUBLIC_DATA_API}${service?.image?.url}`;

            return (
              <motion.div
                key={service._id}
                onClick={() => setActiveId(service._id)}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`cursor-pointer rounded-xl overflow-hidden border transition-all duration-500
                  ${isActive
                    ? "flex-[4] bg-gradient-to-tr from-[var(--rv-bg-primary)] to-[var(--rv-bg-primary-dark)]"
                    : "flex-[1] bg-[var(--rv-bg-white)]"
                  }`}
              >
                {isActive ? (
                  <div className="p-6 h-full flex flex-col justify-between text-[var(--rv-white)]">
                    <div className="flex flex-col gap-4">

                      <span className="w-10 h-10 rounded-full bg-[var(--rv-bg-white)] text-[var(--rv-black)] font-semibold flex items-center justify-center">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h4 className="font-bold text-xl">
                        {service?.name}
                      </h4>

                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={imageUrl || "images/icons/vacation.jpg"}
                          alt={service?.name}
                          className="w-full h-56 object-cover"
                        />
                      </div>

                      <div
                        className="opacity-90 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: service?.description,
                        }}
                      />
                    </div>

                    <Link
                      href={`/services/${service?.link}`}
                      className="inline-flex items-center gap-2 font-semibold"
                    >
                      Know More <FiArrowRight />
                    </Link>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-between py-6 text-[var(--rv-primary)]">
                    <span className="w-10 h-10 rounded-full bg-[var(--rv-bg-primary)] text-[var(--rv-white)] flex items-center justify-center font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h6 className="rotate-90 whitespace-nowrap font-semibold">
                      {service?.name}
                    </h6>

                    <span />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {services.map((service) => {
            const imageUrl = service?.image?.status
              ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${service?.image?.url}`
              : `${process.env.NEXT_PUBLIC_DATA_API}${service?.image?.url}`;

            return (
              <Link
                key={service._id}
                href={`/services/${service?.link}`}
                className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-xl p-5 flex flex-col gap-3"
              >
                <h4 className="font-bold">{service?.name}</h4>

                <div
                  className="text-sm opacity-90 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: service?.description,
                  }}
                />

                <img
                  src={imageUrl}
                  alt={service?.name}
                  className="rounded-xl object-cover h-48 w-full"
                />
              </Link>
            );
          })}
        </div>
        <Button text={'All Services'} link={'/services'} Icon={FaLongArrowAltRight}/>
      </div>
    </section>
  );
};

export default ServicecardTheme1;
