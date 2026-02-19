"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaSmileBeam, FaArrowRight } from "react-icons/fa";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";

const ThankyouTheme3 = ({ message = "Thank you for your submission!", subMessage = "We appreciate your interest and will get back to you shortly." }) => {
    return (
        <>
            <InnerPage title={'Thank you'} />
            <section className="bg-[var(--rv-bg-white)] px-4">
                <div className="main-section flex items-center justify-center ">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-[var(--rv-bg-primary-light)] rounded-xl max-w-xl w-full p-4 md:p-7 text-center flex flex-col items-center gap-6"
                    >
                        <div className="bg-[var(--rv-primary)] text-[var(--rv-white)] p-5 rounded-full shadow-lg">
                            <FaSmileBeam className="text-5xl" />
                        </div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="font-bold text-[var(--rv-primary-dark)]"
                        >
                            {message}
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-[var(--rv-gray-dark)]  md:text-base"
                        >
                            {subMessage}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Button text={'Go Back Home'} link={'/'} Icon={FaArrowRight} />
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default ThankyouTheme3;
