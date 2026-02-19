"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX, FiSearch } from "react-icons/fi";
import Button from "@/app/components/Button/Button";
import useLogoSrc from "@/hooks/useLogoSrc";
import SmartSearch from "@/app/components/SmartSearch";
import { HiSearch } from "react-icons/hi";
import {
  NAV_AUTH,
  NAV_PAGES,
  NAV_TOOLS,
  NAV_TOP,
} from "@/lib/Navbar/navConfig";

const NavbarTheme5 = ({ services, roboUser }) => {
  const logoSrc = useLogoSrc();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const mobileMenuRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const names = [
    "Ajay",
    "Sumit",
    "Harsh",
    "Anuj",
    "Sundram",
    "Akash",
    "Rohit",
    "Karan",
    "Deepak",
    "Vikram",
  ];

  const tools = NAV_TOOLS;
  const navTop = NAV_TOP;
  const auth = NAV_AUTH;

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
        setOpenMobileDropdown(null);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) setFilteredNames([]);
    else {
      setFilteredNames(
        names.filter((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery]);

  const handleSelectName = (name) => {
    alert(`You selected: ${name}`);
    setSearchQuery(name);
    setFilteredNames([]);
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full p-4 transition-all ${isSticky ? "bg-[var(--rv-bg-white)] backdrop-blur-md" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          {logoSrc ? (
            <Image src={logoSrc} alt="logo" width={120} height={50} priority />
          ) : (
            <h1 className="text-[var(--rv-primary)]  font-bold">Logo</h1>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-medium">
          {navTop
            .filter((item) => item.link !== "/contact-us")
            .map((item) => (
              <Link key={item.link} href={item.link}>
                {item.name}
              </Link>
            ))}

          <div className="relative group">
            <button className="flex items-center gap-1">
              Services <FiChevronDown />
            </button>
            <div className="absolute hidden group-hover:block pt-2">
              <div className="bg-[var(--rv-bg-white)] rounded-xl shadow-lg p-2 w-48">
                {services?.map((s, i) => (
                  <Link
                    key={i}
                    href={`/services/${s.link}`}
                    className="block px-3 py-2 rounded hover:bg-[var(--rv-bg-gray-light)]"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1">
              Tools <FiChevronDown />
            </button>
            <div className="absolute hidden group-hover:block pt-2">
              <div className="bg-[var(--rv-bg-white)] rounded-xl shadow-lg p-2 w-48">
                {tools.map((t, i) => (
                  <Link
                    key={i}
                    href={t.link}
                    className="block px-3 py-2 rounded hover:bg-[var(--rv-bg-gray-light)]"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1">
              Pages <FiChevronDown />
            </button>
            <div className="absolute hidden group-hover:block pt-2">
              <div className="bg-[var(--rv-bg-white)] rounded-xl shadow-lg p-2 w-48">
                {NAV_PAGES.map((t, i) => (
                  <Link
                    key={i}
                    href={t.link}
                    className="block px-3 py-2 rounded hover:bg-[var(--rv-bg-gray-light)]"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navTop
            .filter((item) => item.link === "/contact-us")
            .map((item) => (
              <Link key={item.link} href={item.link}>
                {item.name}
              </Link>
            ))}

          <div className="relative flex justify-end">
            <div className="relative w-full">
              <HiSearch
                className="cursor-pointer text-xl hover:text-[var(--rv-primary)]"
                onClick={() => setSearchOpen(true)}
              />
              <SmartSearch
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
              />
            </div>
          </div>

          <Button className="bg-[var(--rv-bg-secondary)] text-[var(--rv-white)]" link={auth.login.link} text={auth.login.name} />
          {roboUser && (
            <Button
              link={auth.signup.link}
              text={auth.signup.name}
            />
          )}
        </nav>

        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden">
          ☰
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-screen w-72 bg-[var(--rv-bg-white)] z-50 p-5"
            >
              <div className="flex justify-between mb-4">
                <Image src={logoSrc} alt="logo" width={90} height={40} />
                <FiX size={24} onClick={() => setIsMobileMenuOpen(false)} />
              </div>

              <div className="relative mb-4">
                <div className="flex items-center gap-2 bg-[var(--rv-bg-gray-light)] rounded-xl px-4 py-3">
                  <FiSearch className="text-[var(--rv-gray)]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search people..."
                    className="bg-transparent outline-none w-full"
                  />
                </div>

                <AnimatePresence>
                  {filteredNames.length > 0 && (
                    <motion.ul className="absolute mt-2 w-full bg-[var(--rv-bg-white)] rounded-xl shadow-lg border">
                      {filteredNames.map((name, i) => (
                        <li
                          key={i}
                          onClick={() => handleSelectName(name)}
                          className="px-4 py-3 hover:bg-[var(--rv-bg-gray-light)] cursor-pointer"
                        >
                          {name}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <nav className="flex flex-col gap-3">
                {navTop
                  .filter((item) => item.link !== "/contact-us")
                  .map((item) => (
                    <Link key={item.link} href={item.link}>
                      {item.name}
                    </Link>
                  ))}

                <MobileDropdown
                  id="services"
                  label="Services"
                  open={openMobileDropdown}
                  setOpen={setOpenMobileDropdown}
                >
                  {services?.map((s, i) => (
                    <MobileLink
                      key={i}
                      href={`/services/${s.link}`}
                      onClick={setIsMobileMenuOpen}
                    >
                      {s.name}
                    </MobileLink>
                  ))}
                </MobileDropdown>

                <MobileDropdown
                  id="tools"
                  label="Tools"
                  open={openMobileDropdown}
                  setOpen={setOpenMobileDropdown}
                >
                  {tools.map((t, i) => (
                    <MobileLink
                      key={i}
                      href={t.link}
                      onClick={setIsMobileMenuOpen}
                    >
                      {t.name}
                    </MobileLink>
                  ))}
                </MobileDropdown>

                <MobileDropdown
                  id="pages"
                  label="Pages"
                  open={openMobileDropdown}
                  setOpen={setOpenMobileDropdown}
                >
                  {NAV_PAGES.map((t, i) => (
                    <MobileLink
                      key={i}
                      href={t.link}
                      onClick={setIsMobileMenuOpen}
                    >
                      {t.name}
                    </MobileLink>
                  ))}
                </MobileDropdown>

                {navTop
                  .filter((item) => item.link === "/contact-us")
                  .map((item) => (
                    <Link key={item.link} href={item.link}>
                      {item.name}
                    </Link>
                  ))}
                <Link href={auth.login.link}>{auth.login.name}</Link>
                {roboUser && (
                  <Link href={auth.signup.link}>{auth.signup.name}</Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarTheme5;

const MobileDropdown = ({ label, id, open, setOpen, children }) => (
  <div className="mt-2">
    <button
      onClick={() => setOpen(open === id ? null : id)}
      className="flex w-full items-center justify-between"
    >
      {label}
      <FiChevronDown
        className={`transition ${open === id ? "rotate-180" : ""}`}
      />
    </button>
    <AnimatePresence>
      {open === id && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          className="ml-3 mt-2 flex flex-col gap-2 overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MobileLink = ({ href, onClick, children }) => (
  <Link href={href} onClick={() => onClick(false)} className="block">
    {children}
  </Link>
);
