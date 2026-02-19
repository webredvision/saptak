"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";

export default function ThankyouTheme5({
  message = "Thank you! Your submission has been received.",
  subMessage = "Our team will review your details and connect with you shortly.",
}) {
  return (
    <>
      <InnerPage title={"Thank You"} />

      <section className="bg-[var(--rv-bg-white)] px-4">
        <div className="main-section flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-xl w-full p-6 md:p-10 rounded-2xl bg-[var(--rv-bg-white)] backdrop-blur-lg shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-[var(--rv-white)] flex flex-col items-center gap-6 text-center"
          >
            {/* Animated Gradient Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex items-center justify-center"
            >
              {/* <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-[var(--rv-bg-primary)] to-[var(--rv-bg-secondary)] opacity-20 blur-xl" /> */}

              <div className="w-24 h-24 flex items-center justify-center bg-[var(--rv-bg-primary-light)] rounded-full shadow-xl border border-[var(--rv-primary-dark)]/20">
                <FaCheckCircle className="text-5xl text-[var(--rv-primary)]" />
              </div>
            </motion.div>

            <motion.h4
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-bold text-[var(--rv-primary-dark)]"
            >
              {message}
            </motion.h4>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-[var(--rv-text-primary)] leading-relaxed max-w-md"
            >
              {subMessage}
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-3"
            >
              <Button
                text={"Back to Home"}
                link={"/"}
                className={
                  "bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-secondary)] py-3 px-6 text-[var(--rv-white)] font-semibold rounded-full shadow-lg transition-all flex items-center gap-2"
                }
                Icon={FaCheckCircle}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
