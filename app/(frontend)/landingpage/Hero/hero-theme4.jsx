import { useState } from "react";
import Button from "@/app/components/Button/Button";
import TypingText from "@/app/components/TypingText";

const HeroTheme4 = () => {
    const [email, setEmail] = useState("");

    return (
        <div className="lg:px-3 lg:rounded-xl overflow-hidden ">
            <section className="w-full flex items-center px-4 lg:rounded-xl overflow-hidden text-[var(--rv-white)] relative z-10 bg-gradient-to-tl from-[var(--rv-bg-primary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-secondary)]">
                <div className="max-w-7xl mx-auto main-section w-full">
                    <div className="flex flex-col md:gap-8 lg:gap-12 gap-5 z-10">
                        <div className="inline-flex items-center gap-2 bg-[var(--rv-bg-white-light)] w-fit backdrop-blur-sm px-5 py-2 rounded-full border border-[var(--rv-bg-white-light)]">
                            <div>
                                <div className="w-2 h-2 bg-[var(--rv-bg-primary)] rounded-full animate-pulse"></div>
                            </div>
                            <span className="font-light tracking-widest text-[var(--rv-white)] capitalize">50K+ Trusted Business</span>
                        </div>

                        <div className="">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight">
                                Your Financial Goal {" "}
                            </h1>
                            <div className="">
                                <TypingText
                                    words={[
                                        "Retirement",
                                        "Vacation.",
                                        "Marriage.",
                                        "Child’s Education.",
                                        "Wealth Creation.",
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="w-full bg-[var(--rv-bg-white-light)] backdrop-blur-sm p-5 rounded-xl">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <h2 style={{
                                            backgroundImage:
                                                "var(--rv-bg-gradient)",
                                        }} className="font-bold bg-clip-text text-transparent">50K+</h2>
                                        <div className="">Active Users</div>

                                    </div>
                                    <div className='w-full h-px bg-[var(--rv-bg-primary)] opacity-30'></div>
                                    <div className="flex items-center">
                                        <div className="md:w-12 md:h-12 w-10 h-10 -ml-2 overflow-hidden rounded-full border-2">
                                            <img src="/images/1.png" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="md:w-12 md:h-12 w-10 h-10 -ml-2 overflow-hidden rounded-full border-2">
                                            <img src="/images/2.png" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="md:w-12 md:h-12 w-10 h-10 -ml-2 overflow-hidden rounded-full border-2">
                                            <img src="/images/3.png" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="md:w-12 md:h-12 w-10 h-10 -ml-2 overflow-hidden rounded-full border-2">
                                            <img src="/images/1.png" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="md:w-12 md:h-12 w-10 h-10 -ml-2 overflow-hidden rounded-full border-2">
                                            <img src="/images/2.png" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="md:w-12 md:h-12 w-10 h-10 -ml-2 overflow-hidden rounded-full border-2">
                                            <img src="/images/3.png" className="w-full h-full object-cover" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-[var(--rv-bg-white-light)] backdrop-blur-sm p-5 rounded-xl">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <h2
                                            style={{ backgroundImage: "var(--rv-bg-gradient)" }}
                                            className="font-bold bg-clip-text text-transparent"
                                        >
                                            4.9 ★
                                        </h2>
                                        <p className="">App Rating</p>
                                    </div>

                                    <h6 className="">
                                        Based on 12,000+ verified reviews
                                    </h6>
                                </div>
                            </div>

                            <div className="w-full lg:col-span-2 flex flex-col gap-5 md:gap-8">
                                <p className="">
                                    Retire early. Fund your child’s dream education. Plan the perfect vacation or a secure marriage.
                                    We help you turn life goals into a clear, achievable financial plan.
                                </p>
                                <div className="w-full rounded-full pr-1 overflow-hidden border border-[var(--rv-bg-white-light)] bg-[var(--rv-bg-secondary-dark)] shadow-[0_0_10px_var(--rv-primary)] flex items-center">
                                    <input className="w-full h-full p-4 bg-transparent text-[var(--rv-white)] placeholder-white/80 md:px-6 outline-none" placeholder="Email Address" />
                                    <div className="flex-shrink-0 hidden sm:block">
                                        <Button text={'Get Started'} link="/login" />
                                    </div>
                                </div>
                                <div className="flex-shrink-0 sm:hidden block">
                                    <Button text={'Get Started'} link="/login" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroTheme4;
