"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

/* ================= MODAL ================= */

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

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-64 md:h-auto">
            <img
              src={member?.image?.url || "/profile.jpg"}
              alt={member?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-2/3 p-6 flex flex-col gap-3">
            <h3 className="text-2xl font-semibold text-[var(--rv-primary)]">
              {member?.name}
            </h3>
            <p className="font-medium text-[var(--rv-gray-dark)]">
              {member?.designation}
            </p>

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

/* ================= TEAM GRID ================= */

const TeamsTheme2 = ({ teamData = [] }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openMemberModal = (member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const closeMemberModal = () => {
        setSelectedMember(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <InnerPage title={'Teams'} />
            <section className="px-4">
                <div className="main-section max-w-7xl mx-auto flex flex-col gap-5 md:gap-10">
                    <Heading
                        title={"Team"}
                        heading={"Meet Our Expert Leadership"}
                        description={
                            "Our team of financial and technology professionals is dedicated to helping clients grow, protect, and manage their wealth with confidence and care."
                        }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                        {teamData?.map((member, index) => (
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
                </div>
            </section>

            <TeamMemberModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={closeMemberModal}
            />
        </>
    );
};

export default TeamsTheme2;
