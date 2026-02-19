"use client";

import React from "react";
import Image from "next/image";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "@/app/components/Button/Button";

const NotFoundTheme3 = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--rv-bg-white)] px-4">
      <div className="main-section w-full">
        <div className="max-w-7xl mx-auto bg-[var(--rv-bg-white)] rounded-xl border overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">

            <div className="relative w-full h-72 md:h-full bg-[var(--rv-bg-primary-light)] flex items-center justify-center">
              <Image
                src="/images/page-not-found.png"
                alt="404 Illustration"
                width={450}
                height={400}
                className="object-contain w-full h-full"
                priority
              />
            </div>

            <div className="p-4 sm:p-8 md:p-12 text-[var(--rv-black)] flex flex-col text-center items-center justify-center gap-4">
              <h1 className="font-extrabold tracking-wide lg:text-9xl md:text-8xl sm:text-7xl text-6xl">
                404
              </h1>

              <h3 className="font-semibold">
                Page Not Found
              </h3>

              <p className="opacity-80">
                The page you are trying to access might have been removed,
                renamed, or is temporarily unavailable.
                Let’s get you back to safety.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button
                  link="/"
                  text="Back to Home"
                />
              </div>

              <p className="opacity-70">
                Error code: 404 — Resource not found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundTheme3;
