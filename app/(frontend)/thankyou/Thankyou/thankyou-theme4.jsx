"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaSmileBeam, FaArrowRight } from "react-icons/fa";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";

const ThankyouTheme4 = ({ message = "Thank you for your submission!", subMessage = "We appreciate your interest and will get back to you shortly." }) => {
    return (
        <>
            <InnerPage title={'Thank you'} />
            <section className="bg-[var(--rv-bg-white)] text-[var(--rv-white)] px-4">
                <div className="main-section flex items-center justify-center ">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-[var(--rv-bg-secondary)] rounded-xl overflow-hidden p-4 md:p-8 flex flex-col items-center gap-5 text-center w-full max-w-lg border border-[var(--rv-border)] relative z-10"
                    >
                        <div className="bg-[var(--rv-primary)] p-5 rounded-full shadow-lg">
                            <FaSmileBeam className="text-5xl" />
                        </div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="font-bold text-[var(--rv-primary)]"
                        >
                            {message}
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className=""
                        >
                            {subMessage}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Button text={'Go Back Home'} link={'/'}/>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default ThankyouTheme4;
