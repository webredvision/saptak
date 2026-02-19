"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/app/components/Button/Button";

const NotFoundTheme1 = () => {
  return (
    <div className="flex items-center bg-[var(--rv-bg-white)] px-4 overflow-hidden">
      
      <div className="main-section w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
          
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:flex justify-center hidden"
          >
            <Image
              src="/images/page-not-found.png"
              alt="404 Not Found"
              width={520}
              height={420}
              className="object-contain"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left text-[var(--rv-black)]"
          >
            <h1 className="text-[6rem] md:text-[7rem] font-extrabold leading-none text-[var(--rv-primary)]">
              404
            </h1>

            <h2 className="text-3xl font-semibold mb-4">
              Oops! Page Not Found
            </h2>

            <p className="max-w-md mx-auto lg:mx-0 text-base opacity-80 leading-relaxed mb-8">
              The page you’re trying to reach doesn’t exist or may have been moved.
              Please check the URL or return to the homepage.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                link="/"
                text="Go Back Home"
              />
              <Button
                link="/contact"
                text="Contact Support"
                className="border border-[var(--rv-primary)] bg-transparent text-[var(--rv-primary)] hover:bg-[var(--rv-bg-primary)] hover:text-[var(--rv-white)]"
              />
            </div>

            <p className="mt-6 text-sm opacity-60">
              Error code: 404
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default NotFoundTheme1;
