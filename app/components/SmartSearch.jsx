"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CryptoJS from "crypto-js";

export default function SmartSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [activeSearchTab, setActiveSearchTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  useEffect(() => {
    if (isOpen && !dataFetched) {
      const fetchSchemes = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/open-apis/all-scheme-portfolio`,
          );
          if (response.status === 200) {
            const data = response.data.data || [];
            setAllResults(data);
            setDataFetched(true);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSchemes();
    }
  }, [isOpen, dataFetched]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelectScheme = (item) => {
    const dataToStore = {
      pcode: item.pcode,
      timestamp: Date.now(),
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToStore),
      SECRET_KEY,
    ).toString();

    localStorage.setItem("encryptedFundData", encrypted);
    localStorage.setItem("selectedFundPcode", item.pcode);

    // Reset and close
    setQuery("");
    if (onClose) onClose();
  };

  // Improved Search Algorithm: Token-based matching
  const filteredResults = allResults
    .filter((item) => {
      if (!query) return false;

      const searchTerms = query
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 0);
      const itemName = (item?.funddes || "").toLowerCase();

      // Check if ALL search terms are present in the fund name
      // This allows "HDFC Large" to match "HDFC Top 100 Large Cap"
      const nameMatch = searchTerms.every((term) => itemName.includes(term));

      return nameMatch;
    })
    .filter((item) => {
      if (activeSearchTab === "all") return true;
      const category = (item?.schemeCategory || "").toLowerCase();
      return category.includes(activeSearchTab);
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] w-full h-screen flex items-start justify-center pt-10 px-4 md:px-6 bg-black/60"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-3xl bg-[var(--rv-bg-surface)] rounded-3xl md:rounded-[2.5rem] border border-[var(--rv-border)] shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[var(--rv-text)]">
                SMART SEARCH
              </h3>
              <button
                onClick={() => {
                  setQuery("");
                  if (onClose) onClose();
                }}
                className="p-3 rounded-full hover:bg-[var(--rv-bg-secondary-light)] transition-colors text-[var(--rv-text)]"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6 md:mb-8 group">
              <div className="absolute inset-y-0 left-5 md:left-6 flex items-center pointer-events-none">
                <FaSearch className="text-[var(--rv-text-muted)] group-focus-within:text-[var(--rv-primary)] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search scheme name..."
                value={query}
                onChange={handleSearchChange}
                autoFocus
                className="w-full bg-[var(--rv-bg-secondary-light)] border border-[var(--rv-border)] rounded-2xl py-4 pl-12 md:pl-16 pr-6 text-base md:text-xl text-[var(--rv-text)] placeholder:text-[var(--rv-text-muted)] focus:border-[var(--rv-primary)]/50 focus:bg-[var(--rv-bg-surface)] outline-none transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-[var(--rv-text-muted)]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--rv-text)] mb-4"></div>
                  <p>Loading schemes...</p>
                </div>
              ) : query ? (
                filteredResults.length > 0 ? (
                  <div className="grid gap-3">
                    {filteredResults.map((item, index) => (
                      <Link
                        key={index}
                        href="/performance/single-fund"
                        onClick={() => handleSelectScheme(item)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--rv-bg-secondary-light)] hover:bg-[var(--rv-bg-primary-light)] border border-[var(--rv-border)] hover:border-[var(--rv-primary)]/30 transition-all text-left group"
                      >
                        <div className="flex flex-col">
                          <span className="text-[var(--rv-text)] font-bold group-hover:text-[var(--rv-primary)] transition-colors">
                            {item.funddes}
                          </span>
                          <span className="text-[var(--rv-text-muted)] uppercase tracking-widest mt-1">
                            {item.schemeCategory || "Mutual Fund"}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-[var(--rv-bg-secondary-light)] opacity-0 group-hover:opacity-100 transition-all">
                          <svg
                            className="w-5 h-5 text-[var(--rv-primary)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-[var(--rv-text-muted)]">
                    <FaSearch size={48} className="mb-4 opacity-10" />
                    <p className="text-lg font-medium">
                      No matches found for "{query}"
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-10">
                  <p className="text-[var(--rv-text-muted)] text-sm font-medium">
                    Start typing to see curated results...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
