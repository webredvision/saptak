"use client";

import React from "react";
import Button from "@/app/components/Button/Button";
import { motion } from "framer-motion";

const NotFoundTheme5 = () => {
  const data = [4, 0, 4];

  return (
    <div className="relative flex items-center justify-center bg-[var(--rv-bg-white)] text-[var(--rv-black)] px-4 overflow-hidden">

      <div className="main-section relative z-10">
        <div className="max-w-xl w-full text-center flex flex-col gap-6">

          <div className="grid grid-cols-3 gap-4">
            {data.map((num, index) => (
              <motion.div
                key={index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="w-full p-4 bg-[var(--rv-bg-primary)] flex items-center justify-center rounded-xl shadow-xl"
              >
                <h1 className="lg:text-9xl md:text-8xl sm:text-7xl text-6xl font-extrabold text-[var(--rv-white)]">
                  {num}
                </h1>
              </motion.div>
            ))}
          </div>

          <h1 className="font-bold">
            Page Not Found
          </h1>

          <p className="opacity-80 leading-relaxed max-w-md mx-auto">
            Sorry, the page you are looking for doesn’t exist, has been removed,
            or the URL might be incorrect. Don’t worry — let’s get you back on track.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              link="/"
              className="rounded-xl px-6"
              text="Back to Home"
            />
            <Button
              link="/contact"
              className="rounded-xl px-6"
              text="Contact Support"
            />
          </div>

          <p className="text-sm opacity-60 pt-4">
            Error code: 404 • Resource not found
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundTheme5;
