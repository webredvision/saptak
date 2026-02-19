"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/app/components/Heading/Heading";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import Button from "@/app/components/Button/Button";

const ServicecardTheme4 = ({ services = [] }) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (services.length > 0) {
      setActiveId(services[0]._id);
    }
  }, [services]);

  return (
    <section className="px-4 bg-[var(--rv-bg-white)]">
      <div className="main-section border-b">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-10">
          <Heading
            title="Services"
            heading="Our Core Financial Services"
            description="Explore our range of investment and financial planning services designed to help you build, protect, and grow your wealth with confidence."
          />
          <div>
            <div className="w-full mx-auto hidden lg:block">
              <img src="/images/service-svg.svg" className="opacity mx-auto" alt="" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 3).map((service) => {
                const imageUrl = service?.icon?.status
                  ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${service?.icon?.url}`
                  : `${process.env.NEXT_PUBLIC_DATA_API}${service?.icon?.url}`;

                return (
                  <Link
                    key={service._id}
                    href={`/services/${service?.link}`}
                    className="relative">
                    <div className="relative border border-[var(--rv-primary)] z-10   bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-xl overflow-hidden p-5 md:p-8 flex flex-col items-center justify-center text-center gap-5">
                      <div className="w-20 h-20 bg-[var(--rv-bg-white)] p-3 rounded-full">
                        <img src={imageUrl} className="w-full h-full object-contain" alt="" />
                      </div>
                      <h5 className="font-light">{service?.name}</h5>
                      <div
                        className="opacity-90 line-clamp-3 font-light"
                        dangerouslySetInnerHTML={{
                          __html: service?.description,
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 z-20 left-1/2 translate-y-1/2 -translate-x-1/2">
                      <div className="w-10 h-10 border border-[var(--rv-primary)] bg-[var(--rv-bg-white)] group-hover:bg-[var(--rv-bg-black)] group-hover:text-[var(--rv-white)] text-[var(--rv-black)] rounded-full flex items-center justify-center">
                        <FaArrowRightLong className={"animate-bounce1"} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="mx-auto">
            <Button text="Explore All Services" link="/services" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicecardTheme4;
