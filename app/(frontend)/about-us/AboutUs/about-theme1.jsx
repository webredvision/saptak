"use client";

import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

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
              <h3 className="text-2xl font-semibold text-[var(--rv-primary-dark)]">
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
                  className="bg-[var(--rv-primary)]/10 p-2 rounded-full text-[var(--rv-primary)]"
                >
                  <FaFacebook size={18} />
                </a>
              )}
              {member?.twitter && (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--rv-primary)]/10 p-2 rounded-full text-[var(--rv-primary)]"
                >
                  <FaTwitter size={18} />
                </a>
              )}
              {member?.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--rv-secondary)]/10 p-2 rounded-full text-[var(--rv-secondary)]"
                >
                  <FaInstagram size={18} />
                </a>
              )}
              {member?.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--rv-secondary)]/10 p-2 rounded-full text-[var(--rv-secondary)]"
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

const AboutTheme1 = ({
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

      <section className="px-4 bg-[var(--rv-bg-white)]">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-10 items-center">
            <motion.div
              ref={trustRef}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
              className="relative rounded-3xl overflow-hidden"
            >
              <img
                src={aboutData[0]?.image?.url}
                alt="Mutual Fund Investment Insights"
                className="object-cover w-full h-full"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute bottom-1 right-1 md:bottom-5 md:right-5 scale-75 md:scale-100 bg-[var(--rv-bg-white)] rounded-xl p-4 shadow-xl"
              >
                <p>Years of Trust</p>
                <span className="md:text-5xl font-bold text-[var(--rv-primary)]">
                  {trustInView ? (
                    <CountUp
                      className="text-3xl md:text-4xl"
                      start={0}
                      end={15}
                      duration={2}
                      separator=","
                    />
                  ) : (
                    "0"
                  )}{" "}
                  +
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.1}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <h5 className="leading-relaxed text-[var(--rv-primary)]">
                  {aboutData[0]?.title}
                </h5>
                <p
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: aboutData[0]?.description || "",
                  }}
                ></p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={fadeUp}
                  custom={0.2}
                  className="flex flex-col gap-1"
                >
                  <h6 className="text-[var(--rv-primary)]">
                    15+ Years of Experience
                  </h6>
                  <p>
                    Proven track record of success and stability in the
                    financial sector.
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  custom={0.3}
                  className="flex flex-col gap-1"
                >
                  <h6 className="text-[var(--rv-primary)]">
                    Wealth-Building Focus
                  </h6>
                  <p>
                    Committed to helping clients achieve long-term financial
                    growth.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {statsData?.map((stat, index) => {
              const { ref, inView } = useInView({
                triggerOnce: true,
                threshold: 0.3,
              });

              const number = parseInt(stat?.statsNumber);

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  variants={scaleIn}
                  custom={index * 0.1}
                  className="text-center"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-[var(--rv-primary)]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>

                  <div className="flex items-center gap-1 justify-center mb-2">
                    <h3 className="font-extrabold text-[var(--rv-primary-dark)] text-3xl">
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
                      <span className="text-[var(--rv-primary-dark)] text-2xl">
                        {stat?.subtitle}
                      </span>
                    )}
                  </div>

                  <p className="text-[var(--rv-primary-dark)] font-semibold">
                    {stat?.title}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section
        className="px-4 bg-[var(--rv-bg-primary)]"
        style={{
          backgroundImage: "url('/images/vector.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className=" max-w-7xl mx-auto main-section text-center flex flex-col gap-5 md:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Heading
              variant="light"
              heading={"Our Mission, Vision & Values"}
              description={
                "Discover what drives us forward — our mission to empower, our vision for the future, and the values that define every step we take."
              }
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {items.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.15}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                className="border border-[var(--rv-white-light)] rounded-xl p-5 md:p-8 flex flex-col gap-2 items-center text-center hover:shadow-lg transition-all duration-300 bg-[var(--rv-bg-white-light)] backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-[var(--rv-primary)] p-4 rounded-full">
                  <Image
                    src={item.img}
                    alt={item.heading}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full mx-auto brightness-150 filter invert"
                  />
                </div>
                <h4 className="font-semibold text-[var(--rv-white)]">
                  {item.heading}
                </h4>
                <p
                  className="text-[var(--rv-white)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.para }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 bg-[var(--rv-bg-white)]">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Heading
              heading={"Meet Our Expert Leadership"}
              description={
                "Our team of financial and technology professionals is dedicated to helping clients grow, protect, and manage their wealth with confidence and care."
              }
            />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {teamData?.slice(0, 4)?.map((member, index) => (
              <motion.div
                key={index}
                className="group bg-[var(--rv-bg-white)] border border-[var(--rv-gray)] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => openMemberModal(member)}
                onKeyDown={(e) => e.key === "Enter" && openMemberModal(member)}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index * 0.1}
                whileHover={{
                  y: -6,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.1)",
                }}
              >
                <div className="relative">
                  <img
                    src={member?.image?.url}
                    alt={member?.name}
                    className="w-full h-72 object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--rv-black)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
                    <div className="flex gap-3">
                      <a
                        href={member?.facebook || "#"}
                        onClick={(e) => e.stopPropagation()}
                        className=" bg-[var(--rv-bg-white-light)] hover:bg-[var(--rv-bg-white-light)] p-2 rounded-full transition"
                      >
                        <FaFacebook
                          className=" text-[var(--rv-white)]"
                          size={18}
                        />
                      </a>
                      <a
                        href={member?.twitter || "#"}
                        onClick={(e) => e.stopPropagation()}
                        className=" bg-[var(--rv-bg-white-light)] hover:bg-[var(--rv-bg-white-light)] p-2 rounded-full transition"
                      >
                        <FaTwitter
                          className=" text-[var(--rv-white)]"
                          size={18}
                        />
                      </a>
                      <a
                        href={member?.instagram || "#"}
                        onClick={(e) => e.stopPropagation()}
                        className=" bg-[var(--rv-bg-white-light)] hover:bg-[var(--rv-bg-white-light)] p-2 rounded-full transition"
                      >
                        <FaInstagram
                          className=" text-[var(--rv-white)]"
                          size={18}
                        />
                      </a>
                      <a
                        href={member?.linkedin || "#"}
                        onClick={(e) => e.stopPropagation()}
                        className=" bg-[var(--rv-bg-white-light)] hover:bg-[var(--rv-bg-white-light)] p-2 rounded-full transition"
                      >
                        <FaLinkedin
                          className=" text-[var(--rv-white)]"
                          size={18}
                        />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 text-center flex flex-col gap-2">
                  <h6 className="font-semibold text-[var(--rv-primary-dark)] ">
                    {member?.name}
                  </h6>
                  <p className="text-[var(--rv-primary)] font-medium">
                    {member?.designation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mx-auto">
            <Button link={'/teams'} text={'All Teams'} />
          </div>
        </div>
      </section>

      <section className="px-4 bg-[var(--rv-bg-white)]">
        <div className=" max-w-7xl mx-auto main-section-bottom text-center flex flex-col gap-5 md:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Heading
              heading={"Trusted by India’s Leading Financial Institutions"}
              description={
                "We collaborate with reputed and reliable financial partners to provide our clients with the best investment solutions and long-term value."
              }
            />
          </motion.div>
          <div className="gap-6 items-center justify-center">
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
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
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
      </section>

      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={closeMemberModal}
      />
    </div>
  );
};

export default AboutTheme1;
