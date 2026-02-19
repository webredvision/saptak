"use client";
import React from "react";
import Heading from "../../../components/Heading/Heading";

import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const ServiceCard3 = ({ services }) => {
    return (
        <>
            <InnerPage title={'Services'} />
            <section className="w-full bg-[var(--rv-bg-white)] px-4 text-[var(--rv-black)] overflow-hidden">
                <div className="max-w-7xl mx-auto main-section flex flex-col gap-6">

                    <Heading title={'Our Services'} heading={'Comprehensive Financial Solutions'} description={'Explore our range of investment and financial planning services designed to help you build, protect, and grow your wealth with confidence.'} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {services?.map((service, i) => (
                            <div key={i} className="group relative h-full bg-[var(--rv-bg-white)] text-[var(--rv-black)] hover:text-[var(--rv-white)] after:w-full after:h-0 z-10 after:absolute after:hover:h-full after:transition-all after:duration-500 after:z-0 after:bg-gradient-to-r after:from-[var(--rv-bg-primary)] after:to-[var(--rv-bg-secondary)] after:bottom-0 after:left-0 after:translate-y-0 rounded-xl p-6 overflow-hidden transition-all duration-300">
                                <div className="relative z-10">
                                    <div className="flex flex-col gap-20">
                                        <div className="flex flex-col gap-4">
                                            <div className="w-full flex items-center justify-between gap-5">
                                                <h6 className="font-semibold inline-block">
                                                    {service?.name}
                                                </h6>

                                                <Link
                                                    href={`/services/${service?.link}`}
                                                    aria-label={`View ${service?.name} service`}
                                                >
                                                    <div className="w-10 h-10 text-[var(--rv-white)] group-hover:text-[var(--rv-black)] group-hover:bg-[var(--rv-bg-white)] bg-[var(--rv-bg-secondary)] rounded-full flex items-center justify-center text-2xl">
                                                        <MdArrowOutward />
                                                    </div>
                                                </Link>

                                            </div>
                                            <div className="w-full h-[1px] bg-[var(--rv-bg-secondary)] group-hover:bg-[var(--rv-bg-white)]"></div>
                                            <p
                                                className="opacity-80 line-clamp-3"
                                                dangerouslySetInnerHTML={{ __html: service?.description }}
                                            />
                                        </div>



                                        <div className="w-16 h-16 flex items-center justify-center rounded-full group-hover:bg-[var(--rv-bg-white)] bg-[var(--rv-bg-secondary)]">
                                            <img
                                                src={
                                                    service?.icon?.status
                                                        ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${service?.icon?.url}`
                                                        : `${process.env.NEXT_PUBLIC_DATA_API}${service?.icon?.url}`
                                                }
                                                alt={service?.name}
                                                className="w-8 h-auto max-h-8 filter brightness-0 invert group-hover:invert-0 group-hover:brightness-150 transition"
                                            />
                                        </div>
                                    </div>
                                    <span
                                        aria-hidden="true"
                                        className="absolute bottom-1 right-1 text-5xl font-bold text-[var(--rv-black)] opacity-20"
                                    >
                                        {String(i + 1).padStart(2, "0")}.
                                    </span>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ServiceCard3;
