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

/* ================= TEAM GRID ================= */

const TeamsTheme4 = ({ teamData = [] }) => {
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
                <div className="max-w-7xl mx-auto main-section">
                    <div className="flex flex-col gap-20">
                        <Heading
                            title={"Team"}
                            heading={"Meet Our Expert Leadership"}
                            description={
                                "Our team of financial and technology professionals is dedicated to helping clients grow, protect, and manage their wealth with confidence and care."
                            }
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 gap-y-20 md:gap-7">
                            {teamData?.map((member, index) => (
                                <div
                                    key={index}
                                    className="group rounded-xl bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] p-2 relative border border-[var(--rv-primary)]"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openMemberModal(member)}
                                    onKeyDown={(e) => e.key === "Enter" && openMemberModal(member)}
                                >
                                    <div className="h-32 border-8 border-[var(--rv-bg-secondary)] bg-[var(--rv-bg-secondary-light)] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 rounded-full overflow-hidden">
                                        <img
                                            src={member?.image?.url}
                                            alt={member?.name}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="w-full h-16"></div>

                                    <div className="p-3 pl-5 flex flex-col items-center text-center justify-between gap-4">
                                        <div className="flex flex-col gap-1">
                                            <h6 className="font-semibold text-[var(--rv-primary)] ">
                                                {member?.name}
                                            </h6>
                                            <p className="text-[var(--rv-white)] font-medium">
                                                {member?.designation}
                                            </p>
                                            <p
                                                className="leading-relaxed line-clamp-3 mt-2 text-[var(--rv-white)] opacity-90"
                                                dangerouslySetInnerHTML={{ __html: member?.description }}
                                            ></p>
                                        </div>
                                        <div className="flex items-center justify-center">
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

export default TeamsTheme4;
