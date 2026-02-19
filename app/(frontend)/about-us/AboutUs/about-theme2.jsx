"use client";

import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Button from "@/app/components/Button/Button";

const TeamMemberModal = ({ member, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative bg-[var(--rv-bg-white)] rounded-2xl w-full max-w-3xl mx-4 md:mx-0 shadow-xl overflow-hidden"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--rv-bg-white-dark)] hover:bg-[var(--rv-bg-white)]"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-56 md:h-auto bg-[var(--rv-bg-gray-light)] overflow-hidden">
            <img
              src={member?.image?.url || "/profile.jpg"}
              alt={member?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-2/3 p-6 flex flex-col gap-3">
            <div>
              <h3 className="text-2xl font-semibold text-[var(--rv-black)]">
                {member?.name}
              </h3>
              <p className="text-[var(--rv-primary)] font-medium">
                {member?.designation}
              </p>
            </div>

            <div
              className="text-sm text-[var(--rv-gray-dark)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: member?.description || "" }}
            />

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {member?.facebook && (
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--rv-secondary)]/10 p-2 rounded-full text-[var(--rv-primary)]"
                >
                  <FaFacebook size={18} />
                </a>
              )}
              {member?.twitter && (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--rv-secondary)]/10 p-2 rounded-full text-[var(--rv-primary)]"
                >
                  <FaTwitter size={18} />
                </a>
              )}
              {member?.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--rv-secondary)]/10 p-2 rounded-full text-[var(--rv-primary)]"
                >
                  <FaInstagram size={18} />
                </a>
              )}
              {member?.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--rv-secondary)]/10 p-2 rounded-full text-[var(--rv-primary)]"
                >
                  <FaLinkedin size={18} />
                </a>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {member?.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-[var(--rv-secondary)] text-[var(--rv-white)] text-sm font-medium"
                >
                  Contact
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AboutTheme2 = ({
  teamData,
  aboutData,
  otherData,
  statsData,
  amcLogosData,
}) => {
  const items = [
    {
      heading: "Mission",
      img: "/images/mission.svg",
      para: otherData?.mission || "",
    },
    {
      heading: "Vision",
      img: "/images/vision.svg",
      para: otherData?.vision || "",
    },
    {
      heading: "Values",
      img: "/images/value.svg",
      para: otherData?.values || "",
    },
  ];

  const { ref: trustRef, inView: trustInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay, ease: "easeOut" },
    }),
  };

  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeMemberModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <div>
      <InnerPage title={"About Us"} />

      <section className="bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="main-section flex flex-col gap-5 md:gap-8">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-10 items-center">
              <div className="relative flex justify-center" ref={trustRef}>
                <div className="rounded-xl md:rounded-3xl overflow-hidden border p-1   border-[var(--rv-white-light)] shadow-2xl">
                  <img
                    src={aboutData[0]?.image?.url || "/images/client.jpg"}
                    alt="Business Expert"
                    className="md:w-full h-[420px] object-cover rounded-xl md:rounded-3xl"
                  />
                </div>

                <div className="absolute md:-top-10 -top-5 md:-right-5 -right-2 bg-[var(--rv-bg-black)] p-5 rounded-2xl shadow-xl border   border-[var(--rv-white-light)]">
                  <p className="mb-2">Years of Experience</p>
                  <h5 className="text-[var(--rv-primary)] font-semibold">
                    15+{" "}
                  </h5>
                </div>

                <div className="absolute bottom-8 md:left-8 bg-[var(--rv-bg-black)] px-4 py-2 rounded-full shadow-xl flex items-center gap-3 border   border-[var(--rv-white-light)]">
                  <div className="flex -space-x-2">
                    <img
                      className="w-9 h-9 rounded-full border border-[var(--rv-white-light)] object-cover"
                      src="/images/1.png"
                    />
                    <img
                      className="w-9 h-9 rounded-full border border-[var(--rv-white-light)] object-cover"
                      src="/images/2.png"
                    />
                    <div className="w-9 h-9 rounded-full bg-[var(--rv-bg-black)] border border-[var(--rv-white-light)] flex items-center justify-center">
                      1k+
                    </div>
                  </div>
                  <span className="">Happy Investors</span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <Heading
                  align="start"
                  title={"ABOUT US"}
                  heading={aboutData?.[0]?.title || ""}
                  description={aboutData?.[0]?.description}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <h6 className="text-[var(--rv-primary)]">
                      15+ Years of Experience
                    </h6>
                    <p>
                      Proven track record of success and stability in the
                      financial sector.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h6 className="text-[var(--rv-primary)]">
                      Wealth-Building Focus
                    </h6>
                    <p>
                      Committed to helping clients achieve long-term financial
                      growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsData?.map((stat, index) => {
                const { ref, inView } = useInView({
                  triggerOnce: true,
                  threshold: 0.3,
                });
                const number = parseInt(stat?.statsNumber);
                return (
                  <div
                    key={index}
                    ref={ref}
                    className="text-center border   border-[var(--rv-white-light)] py-4 p-2 rounded-xl"
                  >
                    <div className="flex items-center gap-1 justify-center mb-2">
                      <h3 className="font-extrabold text-3xl">
                        {inView ? (
                          <CountUp
                            className="sm:text-3xl text-2xl md:text-4xl"
                            start={0}
                            end={number}
                            duration={2}
                            separator=","
                          />
                        ) : (
                          "0"
                        )}
                        {stat?.statsNumber?.includes("+") && "+"}
                        {stat?.statsNumber?.includes("%") && "%"}
                      </h3>

                      {stat?.title && (
                        <span className="">{stat?.subtitle}</span>
                      )}
                    </div>

                    <p className="font-semibold">{stat?.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-center flex flex-col gap-5 md:gap-8">
            <Heading
              title={"About Us"}
              heading={"Our Mission, Vision & Values"}
              highlight={"Vision"}
              description={
                "Discover what drives us forward — our mission to empower, our vision for the future, and the values that define every step we take."
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border border-[var(--rv-white-light)] rounded-xl shadow-md p-5 md:p-8 flex flex-col gap-2 items-center text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-[var(--rv-bg-white)] p-3 rounded-full">
                    <Image
                      src={item.img}
                      alt={item.heading}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full mx-auto"
                    />
                  </div>
                  <h4 className="font-semibold">{item.heading}</h4>
                  <p
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.para }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="main-section flex flex-col gap-5 md:gap-10">
            <Heading
              title={"Team"}
              heading={"Meet Our Expert Leadership"}
              highlight={"Meet"}
              description={
                "Our team of financial and technology professionals is dedicated to helping clients grow, protect, and manage their wealth with confidence and care."
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
              {teamData?.slice(0,4)?.map((member, index) => (
                <div
                  key={index}
                  className="group rounded-xl border   border-[var(--rv-white-light)] p-2 grid grid-cols-1 md:grid-cols-2 overflow-hidden cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => openMemberModal(member)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && openMemberModal(member)
                  }
                >
                  <div className="relative h-56 md:h-full w-full rounded-xl overflow-hidden">
                    <img
                      src={member?.image?.url}
                      alt={member?.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3 pl-5 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <h6 className="font-semibold text-[var(--rv-primary)] ">
                        {member?.name}
                      </h6>
                      <p className="text-[var(--rv-primary-light)] font-medium">
                        {member?.designation}
                      </p>
                      <p
                        className="leading-relaxed line-clamp-5 mt-2"
                        dangerouslySetInnerHTML={{
                          __html: member?.description,
                        }}
                      ></p>
                    </div>
                    <div className="flex">
                      <div className="flex items-center gap-2">
                        <a
                          href={member?.facebook || "#"}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[var(--rv-primary)] p-2 rounded-full transition"
                        >
                          <FaFacebook size={18} />
                        </a>
                        <a
                          href={member?.twitter || "#"}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[var(--rv-primary)] p-2 rounded-full transition"
                        >
                          <FaTwitter size={18} />
                        </a>
                        <a
                          href={member?.instagram || "#"}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[var(--rv-primary)] p-2 rounded-full transition"
                        >
                          <FaInstagram size={18} />
                        </a>
                        <a
                          href={member?.linkedin || "#"}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[var(--rv-primary)] p-2 rounded-full transition"
                        >
                          <FaLinkedin size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-fit mx-auto">
              <Button link={'/teams'} text="Explore All Team" />
            </div>
          </div>
          <div className="text-center flex flex-col gap-5 md:gap-8">
            <Heading
              title={"Our Partners"}
              heading={"Trusted by India’s Leading Financial Institutions"}
              description={
                "We collaborate with reputed and reliable financial partners to provide our clients with the best investment solutions and long-term value."
              }
            />
            <div className=" gap-6 items-center justify-center">
              <Swiper
                spaceBetween={30}
                slidesPerView={5}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                loop={true}
                breakpoints={{
                  0: { slidesPerView: 2 },
                  640: { slidesPerView: 3 },
                  900: { slidesPerView: 4 },
                  1200: { slidesPerView: 5 },
                }}
              >
                {amcLogosData.map((logo, index) => (
                  <SwiperSlide key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-full h-20 bg-[var(--rv-bg-white)] rounded-md p-1">
                        <Link
                          href={logo.logourl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_DATA_API}${logo.logo}`}
                            alt={logo?.name}
                            className="object-contain h-full w-full"
                          />
                        </Link>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="main-section">
            <motion.div
              className="max-w-7xl mx-auto p-10 border   border-[var(--rv-white-light)] text-center rounded-xl md:rounded-3xl"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex flex-col items-center gap-5 md:gap-8 p-4">
                <Heading
                  variant="light"
                  heading={"Ready to take control of your financial future?"}
                  description={
                    "Contact us today to learn more about our expert financial planning services and to schedule a consultation with one of our experienced planners."
                  }
                />
                <div>
                  <Button link={'/contact-us'} text={"Get in touch"} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={closeMemberModal}
      />
    </div>
  );
};

export default AboutTheme2;
