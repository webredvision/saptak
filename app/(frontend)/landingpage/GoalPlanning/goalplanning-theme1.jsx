"use client";

import React from "react";
import Image from "next/image";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { FaLongArrowAltRight } from "react-icons/fa";
import Button from "@/app/components/Button/Button";
import Link from "next/link";

const GoalPlanningTheme1 = () => {
  const data = [
    {
      title: "Retirement Planning",
      description: "Secure your post-retirement lifestyle with a strong financial strategy.",
      icon: "/images/icons/retirement.svg",
    },
    {
      title: "Education Planning",
      description: "Build the right corpus for your children's education journey.",
      icon: "/images/icons/education.svg",
    },
    {
      title: "Marriage Planning",
      description: "Plan for wedding expenses and future responsibilities.",
      icon: "/images/icons/marriage.svg",
    },
    {
      title: "Car Planning",
      description: "Make smart decisions for your next car purchase.",
      icon: "/images/icons/car.svg",
    },
    {
      title: "House Planning",
      description: "Save and invest wisely to buy your dream home.",
      icon: "/images/icons/house.svg",
    },
    {
      title: "Vacation Planning",
      description: "Plan dream vacations without breaking the bank.",
      icon: "/images/icons/vacation.svg",
    },
    {
      title: "Life Planning",
      description: "Protect your family with the right life insurance plan.",
      icon: "/images/icons/insurance.svg",
    },
  ];

  return (
    <section className="w-full px-4 z-10 relative bg-[var(--rv-bg-secondary)] text-[var(--rv-white)]
        before:content-['']
        before:absolute before:inset-0
        before:bg-[url('/images/footer-vector.png')]
        before:bg-cover before:bg-center
        before:brightness-0 before:invert before:opacity-[0.05]
        before:-z-10">
      <div className="max-w-7xl mx-auto main-section grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3 items-start"
        >
          <Heading
            align="start"
            variant="light"
            title="Goal-Based Investing"
            heading="Your Goals Deserve a Smarter Investment Plan"
            highlight="SMARTER"
            description="From buying your first home to planning retirement, we help you invest with clarity, confidence, and a clear roadmap."
          />

          <Button
            text="Explore Goal Planning"
            Icon={FaLongArrowAltRight}
            link="/login"
          />
        </motion.div>


        <div className="md:col-span-2">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={true}
            spaceBetween={24}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 2 },
            }}
            className=""
          >
            {data.map((item, i) => (
              <SwiperSlide key={i}>
                <div
                  className="group relative h-full bg-[var(--rv-bg-white-light)] backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[var(--rv-primary)] overflow-hidden transition-all duration-300">
                  <span className="absolute left-0 top-0 h-full w-1 bg-[var(--rv-primary)] transition-all duration-300" />
                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="w-16 h-16 bg-[var(--rv-primary)] rounded-xl flex items-center justify-center">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain brightness-0 invert-0"
                      />
                    </div>

                    <h6 className="font-bold text-[var(--rv-primary)]">
                      {item.title}
                    </h6>

                    <p className="leading-relaxed text-lg">
                      {item.description}
                    </p>

                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 font-semibold text-[var(--rv-primary)] transition-all group-hover:gap-3"
                    >
                      Start Planning
                      <FaLongArrowAltRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>

            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default GoalPlanningTheme1;
