"use client";
import React from "react";
import Button from "@/app/components/Button/Button";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const words = [
  "Help Analyze",
  "Analyze Support",
  "Data Analysis",
  "Evaluate Help",
];


const StatCard = ({ stat, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const rawNumber = stat?.statsNumber || "0";
  const numericValue = parseInt(rawNumber.replace(/[^\d]/g, ""), 10) || 0;
  const hasPlus = rawNumber.includes("+");
  const hasPercent = rawNumber.includes("%");

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-start"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center">
        <h3 className="font-light">
          {inView ? (
            <CountUp
              className="sm:text-3xl text-2xl md:text-4xl lg:text-5xl xl:text-6xl"
              start={0}
              end={numericValue}
              duration={2}
              separator=","
            />
          ) : (
            "0"
          )}
          {hasPlus && "+"}
          {hasPercent && "%"}
        </h3>

        {stat?.subtitle && <h6 className="">{stat.subtitle}</h6>}
      </div>

      <p className="font-medium text-[var(--rv-secondary)]">{stat?.title}</p>
    </motion.div>
  );
};

const HeroTheme5 = ({ stats }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--rv-white)] main-section-top flex items-center justify-center">
      <section className="px-4 w-full">

        <div className="absolute inset-0 pointer-events-none">
          <span className="circle circle-1 bg-[var(--rv-blue)]" />
          <span className="circle circle-2 bg-[var(--rv-blue)]" />
          <span className="circle circle-3 bg-[var(--rv-pink)]" />
          <span className="circle circle-4 bg-[var(--rv-yellow)]" />
          <span className="circle circle-5 bg-[var(--rv-green)]" />
          <span className="circle circle-6 bg-[var(--rv-purple)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 justify-center text-center w-full h-full max-w-7xl mx-auto main-section">

          <h6 className="uppercase tracking-widest font-medium animate-subtitle">
            Improve Your
          </h6>

          <div className="w-full h-[80px] sm:h-[120px] md:h-[140px] lg:h-[150px] xl:h-[160px] relative overflow-hidden">
            <Swiper
              direction="vertical"
              slidesPerView={1}
              loop
              mousewheel={{ forceToAxis: true }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              modules={[Mousewheel, Autoplay]}
              className="h-full"
            >
              {words.map((word, i) => (
                <SwiperSlide key={i}>
                  <h1 className="flex items-center justify-center h-full text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold">
                    {word}
                  </h1>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute w-full h-full top-0 left-0 bg-[var(--rv-bg-black-light)] z-10"></div>
          </div>

          <p className="max-w-xl text-[var(--rv-gray-dark)]">
            We develop the relationships that underpin the next phase in your
            organisation’s growth.
          </p>

          <Button text="Get Consultant" link="/contact-us" />



          <div className="w-full mt-10">
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats?.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
        .circle {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.8;
        }

        .circle-1 {
          top: 10%;
          left: 5%;
          animation: move1 28s infinite alternate;
        }

        .circle-2 {
          top: 15%;
          right: 5%;
          animation: move2 30s infinite alternate;
        }

        .circle-3 {
          bottom: 15%;
          left: 30%;
          animation: move3 26s infinite alternate;
        }

        .circle-4 {
          bottom: 10%;
          right: 25%;
          animation: move4 32s infinite alternate;
        }

        .circle-5 {
          top: 20%;
          left: 10%;
          animation: move5 28s infinite alternate;
        }

        .circle-6 {
          top: 20%;
          right: 10%;
          animation: move6 28s infinite alternate;
        }

        @keyframes move1 {
          to { transform: translate(60vw, 30vh); }
        }
        @keyframes move2 {
          to { transform: translate(-10vw, 40vh); }
        }
        @keyframes move3 {
          to { transform: translate(90vw, -40vh); }
        }
        @keyframes move4 {
          to { transform: translate(-10vw, -30vh); }
        }
        @keyframes move3 {
          to { transform: translate(10vw, 10vh); }
        }
        @keyframes move4 {
          to { transform: translate(-80vw, 70vh); }
        }

        .animate-subtitle {
          animation: fadeUp 1.3s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </section>
    </section>
  );
};

export default HeroTheme5;
