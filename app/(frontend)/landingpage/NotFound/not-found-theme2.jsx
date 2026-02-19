"use client";

import React, { useState, useEffect } from "react";
import { FiAlertTriangle, FiHome } from "react-icons/fi";
import Button from "@/app/components/Button/Button";

const NotFoundTheme2 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative bg-[var(--rv-bg-black)] text-[var(--rv-white)] overflow-hidden flex items-center justify-center px-4">
      <div className={`relative z-10 max-w-2xl w-full transition-all duration-1000 transform main-section`}>
        <div className="backdrop-blur-xl bg-[var(--rv-secondary)] border border-[var(--rv-white-light)] rounded-3xl p-5 md:p-10 shadow-2xl flex flex-col gap-5 items-center justify-center text-center">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-secondary)] blur-2xl opacity-50 rounded-full scale-150" />
            <div className="relative md:w-24 w-16 md:h-24 h-16 rounded-full bg-gradient-to-br from-[var(--rv-primary)] to-[var(--rv-secondary)] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <FiAlertTriangle className="md:w-12 md:h-12 w-8 h-8" strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center">
            <h1
              className="md:text-9xl sm:text-8xl text-7xl font-black bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-primary-dark)] bg-clip-text text-transparent mb-2 ">
              404
            </h1>
            <div className="h-1 w-32 md:w-52 bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-primary-dark)] mx-auto rounded-full mb-6" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Lost in Space
          </h2>
          <p className="text-lg leading-relaxed max-w-md mx-auto">
            The page you're searching for has drifted into the digital void. Let's navigate you back home.
          </p>

          <Button text={'Back to Home'} link={'/'} />
        </div>

        <p className="text-center mt-6 text-sm">
          Error Code: 404 • Page Not Found
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundTheme2;
