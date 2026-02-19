"use client";
import React from "react";
import Link from "next/link";
import Heading from "@/app/components/Heading/Heading";
import { FaLongArrowAltRight } from "react-icons/fa";
import Button from "@/app/components/Button/Button";

const ServicecardTheme5 = ({ services }) => (
  <section className="px-4 bg-[var(--rv-bg-white)] text-[var(--rv-black)]">
    <div className="max-w-7xl mx-auto text-center main-section flex flex-col items-center gap-5 md:gap-8">
      <Heading
        title={"Our Services"}
        heading={"Discover What We Offer"}
        highlight={'We Offer'}
        description={
          "Explore our range of services designed to help you achieve your financial and business goals."
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services?.slice(0, 4)?.map((s, i) => {
          const groupIndex = Math.floor(i / 2);
          const isImageRight = groupIndex % 2 === 1;

          return (
            <Link href={`/services/${s?.link}`} key={s?.id ?? i}>
              <div
                className={`
                  relative group border border-[var(--rv-black-light)] flex rounded-xl overflow-hidden
                  ${isImageRight ? "flex-row-reverse" : "flex-row"}
                `}
              >
                <img
                  src={
                    s?.image?.status
                      ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${s?.image?.url}`
                      : `${process.env.NEXT_PUBLIC_DATA_API}${s?.image?.url}`
                  }
                  alt={s?.name}
                  className={`w-40 md:h-40 h-52 object-cover group-hover:scale-105 transition-all duration-500 ${isImageRight ? "border-l" : "border-r"
                    } border-[var(--rv-black-light)]`}
                />

                <div
                  className="flex flex-col gap-3 justify-center p-6 text-left 
                        after:w-full after:h-full after:bg-[var(--rv-bg-primary)] 
                        after:-bottom-full after:right-0 relative z-10 after:-z-10 after:absolute 
                        group-hover:after:bottom-0 after:duration-300 after:transition-all"
                >
                  <h6 className="group-hover:text-[var(--rv-white)] line-clamp-1 font-medium">
                    {s?.name}
                  </h6>

                  <p
                    className="group-hover:text-[var(--rv-white)] line-clamp-2 leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: s?.description }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div>
        <Button link={'/services'} text="All Services" Icon={FaLongArrowAltRight} />
      </div>
    </div>
  </section>
);

export default ServicecardTheme5;
