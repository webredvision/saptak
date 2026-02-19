"use client";
import React from "react";
import Button from "@/app/components/Button/Button";
import { GiTrophyCup } from "react-icons/gi";

const HeroTheme2 = () => {
    return (
        <section className="relative z-10 w-full bg-[var(--rv-bg-black)] p-2 md:p-4 text-[var(--rv-white)] overflow-hidden">
            <div className="w-full overflow-hidden rounded-xl bg-[var(--rv-bg-secondary)] relative z-10 before:content-[''] before:absolute before:inset-0 before:bg-[url('/images/vector1.webp')] before:bg-cover before:bg-center before:-z-10">
                <div className="relative flex flex-col">
                    <div className="px-4 relative">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-10 w-full max-w-7xl mx-auto main-section">
                            <div className="w-full">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-bold">
                                    Your Journey  
                                </h1>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-bold">
                                   to Wealth
                                </h1>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] text-[var(--rv-primary)] font-bold">
                                    Starts Here
                                </h1>
                            </div>

                            <div className="flex flex-col gap-3 items-start w-full lg:w-fit">
                                <p className="max-w-xs leading-relaxed">
                                    Team of passionate tech experts delivering innovative IT solutions tailored to help businesses growth.
                                </p>
                                <Button text={'Get Started'} link="/login" />
                            </div>
                        </div>
                        <div className="absolute -bottom-72 right-1/4 w-96 h-96 rounded-full bg-[var(--rv-bg-primary)] blur-[100px]"></div>
                    </div>
                    <div className="relative w-full sm:h-96 h-72 md:h-[30rem] rounded-xl bg-[url('/images/hero-banner.webp')] bg-cover bg-center">
                        <div className="absolute md:top-0 top-4 md:right-60 sm:right-40 overflow-hidden p-2 bg-[var(--rv-bg-secondary)] rounded-full flex items-center justify-center right-2 lg:right-96 lg:w-48 md:w-40 sm:w-32 w-24 lg:h-48 md:h-40 sm:h-32 h-24 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-full h-full bg-[var(--rv-bg-black)] z-10 relative rounded-full flex items-center justify-center">
                                <div className="w-[90%] h-[90%] absolute top-[5%] right-[5%] animate-spin -z-10">
                                    <svg viewBox="0 0 200 200" className="w-full h-full uppercase" > <circle cx="100" cy="100" r="95" /> <defs> <path id="circlePath" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" /> </defs> <text fill="#fff" fontSize="20" fontWeight="900" letterSpacing="2" textAnchor="middle" className="" > <textPath href="#circlePath" startOffset="50%"> Highest AUM Growth Award ● 2025 ●</textPath> </text></svg>
                                </div>
                                <div className="md:w-20 w-12 md:h-20 h-12 rounded-full flex items-center justify-center bg-[var(--rv-bg-primary)]">
                                    <GiTrophyCup className="md:text-5xl text-3xl text-[var(--rv-bg-black)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroTheme2;
