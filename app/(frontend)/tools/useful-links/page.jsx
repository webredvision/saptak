"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { motion } from "framer-motion";
import { Skeleton } from "@/app/components/ui/skeleton";

const UsefulLinksPage = () => {
  const [usefulLink, setUsefulLink] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/useful-links`,
      );
      if (res.ok) {
        const data = await res.json();
        setUsefulLink(data);
      }
    } catch (error) {
      console.error("Error fetching useful links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div>
      <InnerPage title="Useful Links" />
      <div className="bg-[var(--rv-bg-page)] text-[var(--rv-text)] py-20 min-h-[70vh]">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="  font-bold text-[var(--rv-text)] mb-4 uppercase tracking-tight">
              RESOURCES & QUICK LINKS
            </h2>
            <p className="text-[var(--rv-text-muted)] max-w-2xl mx-auto    uppercase tracking-[0.2em] leading-relaxed">
              Access important external resources, regulatory platforms and
              institutional portals in one place.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
              ))}
            </div>
          ) : usefulLink.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {usefulLink.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col h-full bg-[var(--rv-bg-surface)] border border-[var(--rv-border)] p-6 rounded-3xl hover:bg-[var(--rv-bg-secondary-light)] hover:border-[var(--rv-border)] transition-all shadow-xl group relative overflow-hidden text-left"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--rv-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="mb-4">
                        <span className="text-[var(--rv-text-muted)] font-bold uppercase tracking-[0.2em] mb-2 block">
                          Resource
                        </span>
                        <h4 className="text-lg font-bold text-[var(--rv-text)] group-hover:text-[var(--rv-primary)] transition-colors line-clamp-2">
                          {link.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[var(--rv-text-muted)] group-hover:text-[var(--rv-text)] transition-colors    font-bold uppercase ">
                        Visit Site
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-[var(--rv-secondary)] border border-dashed border-[var(--rv-secondary-light)] rounded-3xl">
              <p className="text-xl">No resources found at this moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsefulLinksPage;
