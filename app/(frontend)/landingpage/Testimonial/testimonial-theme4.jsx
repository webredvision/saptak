"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";

const TestimonialTheme4 = ({ testimonials = [] }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="px-4 bg-[var(--rv-bg-white)] text-[var(--rv-white)]">
      <div className=" main-section border-b">
        <div className="max-w-5xl mx-auto flex flex-col gap-5 md:gap-8 ">
          <Heading
            title="COMMUNITY VOICES"
            heading="Trusted by progressive wealth creators"
            description="Stories from the Saptak  community across India."
          />

          <div>
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) =>
                setActiveIndex(swiper.realIndex)
              }
              className="w-full relative z-10 bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] rounded-xl"
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-center p-4">
                    <div className="w-fit">
                      <div className="w-72 h-72 rounded-xl overflow-hidden relative">
                        <img
                          src={item?.image?.url}
                          alt={item?.author}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-5 ">
                      <div className="">
                        <FaQuoteRight className="text-3xl" />
                      </div>
                      <p
                        className="font-bold leading-relaxed "
                        dangerouslySetInnerHTML={{
                          __html: item?.content
                        }}
                      ></p>
                      <div className="flex items-center justify-between gap-5">
                        <div>
                          <h4 className=" font-semibold">
                            {item?.author}
                          </h4>
                          <p className="text-[var(--rv-primary)]">{item?.designation}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {testimonials.map((_, dotIndex) => (
                            <div
                              key={dotIndex}
                              onClick={() =>
                                swiperRef.current.slideToLoop(dotIndex)
                              }
                              className={`transition-all duration-300 cursor-pointer ${activeIndex === dotIndex
                                ? "border border-[var(--rv-bg-primary)] p-1 rounded-full"
                                : ""
                                }`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${activeIndex === dotIndex
                                  ? "bg-[var(--rv-bg-primary)]"
                                  : "bg-[var(--rv-bg-primary)]"
                                  }`}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialTheme4;
