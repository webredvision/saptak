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
import { useInView } from "react-intersection-observer";
import Button from "@/app/components/Button/Button";

const TeamMemberModal = ({ member, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative bg-[var(--rv-bg-white)] rounded-2xl w-full max-w-3xl mx-4 overflow-hidden shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--rv-bg-red)] text-[var(--rv-white)] shadow"
        >
          ✕
        </button>

        <div className="flex flex-col p-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img
                src={member?.image?.url || "/profile.jpg"}
                alt={member?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[var(--rv-primary)]">
                {member?.name}
              </h3>
              <p className="font-medium text-[var(--rv-gray-dark)]">
                {member?.designation}
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div
              className="text-sm text-[var(--rv-gray-dark)]"
              dangerouslySetInnerHTML={{
                __html: member?.description || "",
              }}
            />

            <div className="flex gap-3 mt-2">
              {member?.facebook && (
                <a href={member.facebook} target="_blank">
                  <FaFacebook size={18} />
                </a>
              )}
              {member?.twitter && (
                <a href={member.twitter} target="_blank">
                  <FaTwitter size={18} />
                </a>
              )}
              {member?.instagram && (
                <a href={member.instagram} target="_blank">
                  <FaInstagram size={18} />
                </a>
              )}
              {member?.linkedin && (
                <a href={member.linkedin} target="_blank">
                  <FaLinkedin size={18} />
                </a>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              {member?.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="px-4 py-2 bg-[var(--rv-primary)] text-[var(--rv-white)] rounded-md text-sm"
                >
                  Contact
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-sm"
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

const AboutTheme3 = ({
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

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  };

  const closeMemberModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <div>
      <InnerPage title={"About Us"} />

      <section className="bg-[var(--rv-bg-white)] px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col">
          <div className="flex flex-col gap-5 md:gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex gap-4 relative">
                <div className="w-full rounded-xl bg-[var(--rv-bg-red)] h-[350px] overflow-hidden">
                  <Image
                    src={aboutData[0]?.image.url}
                    width={500}
                    height={800}
                    className="w-full h-full object-cover object-left"
                    alt="image"
                  />
                </div>
                <div className="w-full hidden md:block rounded-xl bg-[var(--rv-bg-red)] h-[450px] overflow-hidden">
                  <Image
                    src={aboutData[0]?.image.url}
                    width={500}
                    height={800}
                    className="w-full h-full object-cover object-right"
                    alt="image"
                  />
                </div>

                <div className="absolute bottom-8 md:bottom-20 border p-2 py-4 rounded-md md:w-[60%] w-[80%] bg-[var(--rv-bg-white)] md:left-[20%] left-[10%]">
                  <div className="flex gap-3 items-center flex-col">
                    <div className="flex items-center">
                      <div className="w-10 h-10 -ml-2 rounded-full overflow-hidden bg-[var(--rv-primary)]">
                        <img
                          src="/images/1.png"
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="w-10 h-10 -ml-2 rounded-full overflow-hidden bg-[var(--rv-secondary)]">
                        <img
                          src="/images/2.png"
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="w-10 h-10 -ml-2 rounded-full overflow-hidden bg-[var(--rv-primary)]">
                        <img
                          src="/images/3.png"
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full overflow-hidden bg-[var(--rv-primary)]">
                        <p className="text-3xl text-[var(--rv-white)]">+</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-[var(--rv-black)]">
                        <b>20k+</b> Customer World wide
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5 items-start">
                <h2 className="font-medium text-[var(--rv-primary)]">
                  {aboutData[0]?.title}
                </h2>

                <p
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: aboutData[0]?.description || "",
                  }}
                ></p>

                <Button link={'/login'} text="Start Investment" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full border-t py-4 ">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-[var(--rv-primary)] mb-1 flex items-center justify-center">
                    <h1 className="font-medium">{stat.statsNumber} </h1>
                    <span className="text-xl font-bold">{stat?.subtitle}</span>
                  </div>
                  <div className="">{stat.title}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center flex flex-col gap-5 md:gap-8 main-section">
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
                  className="bg-[var(--rv-white)] text-[var(--rv-black)] rounded-xl border p-5 md:p-8 flex flex-col gap-2 items-center text-center transition-all duration-300"
                >
                  <div>
                    <div className="w-20 h-20 bg-[var(--rv-bg-primary)] p-3 rounded-full">
                      <Image
                        src={item.img}
                        alt={item.heading}
                        width={400}
                        height={400}
                        className="object-contain w-full h-full mx-auto filter invert brightness-100"
                      />
                    </div>
                  </div>
                  <h4 className="font-semibold text-[var(--rv-primary)]">
                    {item.heading}
                  </h4>
                  <p
                    className=" leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.para }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <Heading
              title="Team"
              heading="Meet Our Expert Leadership"
              highlight="Meet Our"
              description="Our experts are here to guide your financial journey."
            />

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamData?.slice(0, 4)?.map((member, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer rounded-xl overflow-hidden border"
                  whileHover={{ y: -6 }}
                  onClick={() => openMemberModal(member)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    openMemberModal(member)
                  }
                >
                  <img
                    src={member?.image?.url}
                    alt={member?.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h6 className="font-semibold">{member?.name}</h6>
                    <p className="text-sm text-[var(--rv-gray-dark)]">
                      {member?.designation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mx-auto">
              <Button link={'/teams'} text="All Team Member" />
            </div>
          </div>
          <div className="text-center flex flex-col gap-5 md:gap-8 main-section-top">
            <Heading
              title={"Our Partners"}
              heading={"Trusted by India’s Leading Financial Institutions"}
              highlight={"Trusted by India’s"}
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

export default AboutTheme3;
