"use client";
import React from "react";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

const ServicecardTheme2 = ({ services }) => (
    <section className="w-full bg-[var(--rv-bg-black)] p-2 md:p-4 text-[var(--rv-white)] overflow-hidden">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-6">

            <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
                <Heading
                    align="start"
                    title="Our Services"
                    heading="Our Expert Services"
                />
                <Button
                    text="All Services"
                    link="/services"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services?.slice(0,6)?.map((service, i) => (
                    <div key={i} className="group relative h-full bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] hover:text-[var(--rv-black)] after:w-full after:h-1 z-10 after:absolute after:hover:h-full after:transition-all after:duration-300 after:z-0 after:bg-[var(--rv-bg-primary)] after:bottom-0 after:left-0 after:translate-y-0 rounded-xl p-6 overflow-hidden transition-all duration-300">
                        <div className="relative z-10 flex flex-col gap-5">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--rv-bg-black)]">
                                <img
                                    src={
                                        service?.icon?.status
                                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${service?.icon?.url}`
                                            : `${process.env.NEXT_PUBLIC_DATA_API}${service?.icon?.url}`
                                    }
                                    alt={service?.name}
                                    className="w-8 h-8 filter brightness-0 invert group-hover:invert-0 group-hover:brightness-150 transition"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <h5 className="font-semibold inline-block">
                                    {service?.name}
                                </h5>
                                <p
                                    className="opacity-80 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: service?.description }}
                                />

                                <Link
                                    href={`/services/${service?.link}`}
                                    className="inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                                >
                                    Learn More
                                    <IoIosArrowForward />
                                </Link>
                            </div>
                            <span className="absolute top-0 right-0 p-2 text-5xl font-bold opacity-20">
                                {String(i + 1).padStart(2, "0")}.
                            </span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default ServicecardTheme2;
