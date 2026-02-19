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

const TestimonialTheme5 = ({ testimonials }) => {
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
      <div className="max-w-7xl mx-auto main-section-top">
        <motion.div
          className="w-full overflow-hidden flex flex-col gap-5 md:gap-8"
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
          >
            <Heading
              align="start"
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
              slidesPerView={1}
              breakpoints={{
                1024: { slidesPerView: 3 },
                780: { slidesPerView: 2 },
                560: { slidesPerView: 1 },
              }}
              className="!overflow-visible"
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    className="bg-[var(--rv-bg-white)] border rounded-xl p-4 md:p-6 lg:p-8 h-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div>
                        <div className="md:w-24 md:h-24 sm:w-20 sm:h-20 w-16 h-16 rounded-full overflow-hidden">
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
                      </div>
                      <h5 className="font-semibold text-[var(--rv-primary)]">
                        {item?.author}
                      </h5>
                      <p
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      ></p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialTheme5;
