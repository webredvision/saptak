"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";

const TestimonialTheme1 = ({ testimonials }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <motion.section
      className="bg-[var(--rv-bg-white)] px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto main-section-top flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch">
        <motion.div
          className="w-full overflow-hidden"
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[var(--rv-bg-primary-light)] rounded-xl h-full flex flex-col justify-between p-4 sm:p-6 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
            >
              <Heading
                align="start"
                title={"Testimonials"}
                heading="Voices of Our Happy Clients"
                description="See how we’ve helped people achieve financial clarity and confidence."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Swiper
                modules={[Autoplay]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={1.1}
                breakpoints={{
                  640: { slidesPerView: 1.4 },
                }}
                className="!overflow-visible"
              >
                {testimonials.map((item, index) => (
                  <SwiperSlide key={index}>
                    <motion.div
                      className="bg-[var(--rv-bg-white)] rounded-xl p-4 md:p-6 h-full flex flex-col gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.35 }}
                    >
                      <FaQuoteLeft className="text-2xl text-[var(--rv-primary)]" />

                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[var(--rv-primary)]">
                        {item?.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item?.author || "Client"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center    text-[var(--rv-gray)]">
                            No Image
                          </div>
                        )}
                      </div>

                      <h5 className="font-semibold text-[var(--rv-primary)]">
                        {item?.author}
                      </h5>

                      <p
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      ></p>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-9 h-9 rounded-full bg-[var(--rv-bg-white)] flex items-center justify-center"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiArrowLeft className="text-[var(--rv-primary)]" />
              </motion.button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <motion.span
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeIndex
                        ? "bg-[var(--rv-primary)] w-4"
                        : "bg-[var(--rv-bg-white)] w-2"
                    }`}
                    layout
                  />
                ))}
              </div>

              <motion.button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="w-9 h-9 rounded-full bg-[var(--rv-bg-white)] flex items-center justify-center"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiArrowRight className="text-[var(--rv-primary)]" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialTheme1;
