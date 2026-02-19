"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
  NAV_TOOLS,
  NAV_TOP,
} from "@/lib/Navbar/navConfig";

const NavbarTheme3 = ({ services, roboUser }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const logoSrc = useLogoSrc();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileMenuRef = useRef(null);


  const tools = NAV_TOOLS;
  const navTop = NAV_TOP;
  const auth = NAV_AUTH;

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        setOpenMobileDropdown(null);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Sirf actual navigation ke baad
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setSearchOpen(false);
  }, [pathname, searchParams]);

  return (
    <header
      className={`top-0 z-50 w-full transition-all duration-300 px-4 py-3 fixed ${isSticky ? " shadow-2xl bg-[var(--rv-white)]" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between ">
        <Link href="/" className="flex items-center gap-2">
          {logoSrc ? (
            <img src={logoSrc} alt="logo" className="w-full sm:h-20 h-16 md:h-24" />
          ) : (
            <h1 className="text-[var(--rv-primary)]  font-bold">Logo</h1>
          )}
        </Link>
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navTop
            .filter((item) => item.link !== "/contact-us")
            .map((item) => (
              <Link
                key={item.link}
                className="hover:text-[var(--rv-primary)]"
                href={item.link}
              >
                {item.name}
              </Link>
            ))}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-[var(--rv-primary)] transition">
              Services{" "}
              <FiChevronDown className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 z-50 top-full hidden group-hover:block pt-2">
              <div className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-lg shadow-lg w-52 p-2">
                {services.map((s, i) => (
                  <Link
                    key={i}
                    href={`/services/${s.link}`}
                    className="block px-3 py-2  hover:bg-[var(--rv-bg-white-light)] rounded-md"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-[var(--rv-primary)] transition">
              Tools{" "}
              <FiChevronDown className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 z-50 top-full hidden group-hover:block pt-2">
              <div className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-lg shadow-lg w-52 p-2">
                {tools.map((s, i) => (
                  <Link
                    key={i}
                    href={s.link}
                    className="block px-3 py-2 hover:bg-[var(--rv-bg-white-light)] rounded-md"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navTop
            .filter((item) => item.link === "/contact-us")
            .map((item) => (
              <Link
                key={item.link}
                className="hover:text-[var(--rv-primary)]"
                href={item.link}
              >
                {item.name}
              </Link>
            ))}
          <HiSearch
            className="cursor-pointer text-xl hover:text-[var(--rv-primary)]"
            onClick={() => setSearchOpen(true)}
          />
          <SmartSearch
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
          <Button
            link={auth.login.link}
            text={auth.login.name}
            className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)]"
          />
          {roboUser && (
            <Button
              link={auth.signup.link}
              text={auth.signup.name}
              className="bg-[var(--rv-bg-secondary)] text-[var(--rv-white)]"
            />
          )}
        </nav>

        <div className="lg:hidden flex items-center gap-2">
          <Button
            link={auth.login.link}
            text={auth.login.name}
            className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)]"
          />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`
            ${isSticky ? " text-[var(--rv-black)]" : ""}
            `}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 h-screen w-full "
              ></motion.div>

              <motion.div
                ref={mobileMenuRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 right-0 md:w-72 w-full h-screen bg-[var(--rv-bg-primary)] shadow-2xl z-50 text-[var(--rv-gray-light)] font-semibold flex flex-col"
              >
                <div className="flex justify-between items-center p-5 border-b border-[var(--rv-white-light)]">
                  <Image
                    src={logoSrc}
                    alt="Logo"
                    width={100}
                    height={50}
                    className="object-contain filter brightness-0 invert"
                  />
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <FiX size={28} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="text-white flex items-center gap-1 cursor-pointer" onClick={() => setSearchOpen(true)}>
                    <HiSearch className="text-xl" />
                    <p>Search</p>
                  </div>
                  <SmartSearch
                    isOpen={searchOpen}
                    onClose={() => setSearchOpen(false)}
                  />
                  <nav className="flex flex-col space-y-3 mt-2">
                    {navTop
                      .filter((item) => item.link !== "/contact-us")
                      .map((item) => (
                        <Link
                          key={item.link}
                          href={item.link}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
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

                    {navTop
                      .filter((item) => item.link === "/contact-us")
                      .map((item) => (
                        <Link
                          key={item.link}
                          href={item.link}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    <Link
                      href={auth.login.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {auth.login.name}
                    </Link>
                    {roboUser && (
                      <Link
                        href={auth.signup.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {auth.signup.name}
                      </Link>
                    )}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default NavbarTheme3;

const MobileDropdown = ({ label, id, open, setOpen, children }) => (
  <div className="mt-3">
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
  <Link
    href={href}
    onClick={() => onClick(false)}
    className="block"
  >
    {children}
  </Link>
);
