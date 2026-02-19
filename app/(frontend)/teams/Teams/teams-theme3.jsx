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

const TeamsTheme3 = ({ teamData = [] }) => {
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
                <div className="max-w-7xl mx-auto main-section flex flex-col gap-10">
                    <Heading
                        heading="Meet Our Expert Leadership"
                        description="Our team of professionals is dedicated to your success."
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

export default TeamsTheme3;
