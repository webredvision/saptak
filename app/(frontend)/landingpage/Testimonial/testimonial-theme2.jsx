"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";

const TestimonialTheme2 = ({ testimonials = [] }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-[var(--rv-bg-black)] px-4 text-[var(--rv-white)] ">
      <div className="max-w-5xl mx-auto main-section overflow-hidden flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Heading
            title={"Happy Clients"}
            heading="Voices of Our Happy Clients"
            highlight="Clients"
            description="See how we’ve helped people achieve financial clarity and confidence."
          />
        </motion.div>

        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            loop
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            slidesPerView={1.1}
            breakpoints={{
              768: { slidesPerView: 1 },
              0: { slidesPerView: 1 },
            }}
            className="!overflow-visible"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-[var(--rv-bg-secondary)] rounded-xl p-5 w-full py-12 h-full "
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="max-w-2xl mx-auto text-center flex flex-col gap-3">
                    <div className="w-20 h-20 absolute z-20 top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[var(--rv-bg-black)] flex items-center justify-center rounded-full">
                      <FaQuoteLeft className="text-4xl rotate-180 text-[var(--rv-primary)]" />
                    </div>
                    <p
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item?.content }}
                    />
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--rv-primary)]">
                        {item?.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item?.author || "Client"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center   ">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>

                    <h5 className="font-semibold text-[var(--rv-primary)]">
                      {item?.author}
                    </h5>
                    <div className="flex items-center justify-center gap-2">
                      {testimonials.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-2 rounded-full transition-all ${
                            idx === activeIndex
                              ? "bg-[var(--rv-primary)] w-4"
                              : "bg-[var(--rv-bg-white)] w-2"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex items-center justify-between gap-4 w-full absolute z-10 top-1/2 -translate-y-1/2 left-0">
            <motion.button
              type="button"
              onClick={() => {
                if (!swiperRef.current) return;
                swiperRef.current.slidePrev();
                swiperRef.current.autoplay.start();
              }}
              className="w-9 h-9 -ml-3 rounded-full bg-[var(--rv-bg-black)] flex items-center justify-center"
            >
              <FiArrowLeft className="text-[var(--rv-primary)]" />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                if (!swiperRef.current) return;
                swiperRef.current.slideNext();
                swiperRef.current.autoplay.start();
              }}
              className="w-9 h-9 -mr-3 rounded-full bg-[var(--rv-bg-black)] flex items-center justify-center"
            >
              <FiArrowRight className="text-[var(--rv-primary)]" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialTheme2;
