"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX, FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import useLogoSrc from "@/hooks/useLogoSrc";
import { HiSearch } from "react-icons/hi";
import SmartSearch from "@/app/components/SmartSearch";
import Button from "@/app/components/Button/Button";
import {
  NAV_AUTH,
  NAV_PAGES,
  NAV_TOOLS,
  NAV_TOP,
} from "@/lib/Navbar/navConfig";

const NavbarTheme4 = ({ services = [], roboUser }) => {
  const pathname = usePathname();
  const logoSrc = useLogoSrc();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mobileRef = useRef(null);

  const tools = NAV_TOOLS;
  const navTop = NAV_TOP;
  const auth = NAV_AUTH;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
        setMobileDropdown(null);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  const isActive = (href) => pathname === href;
  const isServicesActive = pathname.startsWith("/services");
  const isToolsActive = pathname.startsWith("/tools");

  return (
    <>
      <div className="lg:p-3 sticky top-0 w-full z-50">
        <header className="lg:rounded-xl transition-all p-4 bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] shadow-lg">
          <div className="flex items-center justify-between">
            <Link href="/">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt="logo"
                  width={120}
                  height={50}
                  priority
                />
              ) : (
                <h1 className="text-[var(--rv-primary)]  font-bold">Logo</h1>
              )}
            </Link>

            <nav className="hidden lg:flex gap-5 xl:gap-8 font-medium text-[var(--rv-white)] items-center">
              {navTop
                .filter((item) => item.link !== "/contact-us")
                .map((item) => (
                  <NavLink
                    key={item.link}
                    href={item.link}
                    active={isActive(item.link)}
                  >
                    {item.name}
                  </NavLink>
                ))}

              <Dropdown label="Services" active={isServicesActive}>
                {services.map((s, i) => (
                  <DropdownItem
                    key={i}
                    href={`/services/${s.link}`}
                    active={pathname === `/services/${s.link}`}
                  >
                    {s.name}
                  </DropdownItem>
                ))}
              </Dropdown>

              <Dropdown label="Tools" active={isToolsActive}>
                {tools.map((t, i) => (
                  <DropdownItem
                    key={i}
                    href={t.link}
                    active={pathname === t.link}
                  >
                    {t.name}
                  </DropdownItem>
                ))}
              </Dropdown>

              <Dropdown label="Pages" active={NAV_PAGES.some(p => pathname === p.link)}>
                {NAV_PAGES.map((p, i) => (
                  <DropdownItem
                    key={i}
                    href={p.link}
                    active={pathname === p.link}
                  >
                    {p.name}
                  </DropdownItem>
                ))}
              </Dropdown>

              {navTop
                .filter((item) => item.link === "/contact-us")
                .map((item) => (
                  <NavLink
                    key={item.link}
                    href={item.link}
                    active={isActive(item.link)}
                  >
                    {item.name}
                  </NavLink>
                ))}
            </nav>
            <div className="hidden lg:flex gap-3 font-medium text-[var(--rv-white)] items-center">
              <div className="flex items-center gap-2">
                <HiSearch
                  className="cursor-pointer text-xl hover:text-[var(--rv-primary-light)]"
                  onClick={() => setSearchOpen(true)}
                />
                <SmartSearch
                  isOpen={searchOpen}
                  onClose={() => setSearchOpen(false)}
                />
              </div>

              <Button link={auth.login.link} text={auth.login.name} />
              {roboUser && (
                <Button link={auth.signup.link} text={auth.signup.name} />
              )}
            </div>
            <button
              className="lg:hidden text-[var(--rv-white)] text-2xl"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
          </div>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.aside
              ref={mobileRef}
              className="fixed top-0 right-0 w-full h-screen bg-[var(--rv-bg-secondary-dark)] z-50 p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
            >
              <div className="flex justify-between mb-6 text-[var(--rv-white)]">
                <span className="font-bold">Menu</span>
                <FiX size={26} onClick={() => setMobileOpen(false)} />
              </div>

              {navTop
                .filter((item) => item.link !== "/contact-us")
                .map((item) => (
                  <MobileLink
                    key={item.link}
                    href={item.link}
                    onClick={setMobileOpen}
                  >
                    {item.name}
                  </MobileLink>
                ))}

              <MobileDropdown
                id="services"
                label="Services"
                open={mobileDropdown}
                setOpen={setMobileDropdown}
              >
                {services.map((s, i) => (
                  <MobileLink
                    key={i}
                    href={`/services/${s.link}`}
                    onClick={setMobileOpen}
                  >
                    {s.name}
                  </MobileLink>
                ))}
              </MobileDropdown>

              <MobileDropdown
                id="tools"
                label="Tools"
                open={mobileDropdown}
                setOpen={setMobileDropdown}
              >
                {tools.map((t, i) => (
                  <MobileLink key={i} href={t.link} onClick={setMobileOpen}>
                    {t.name}
                  </MobileLink>
                ))}
              </MobileDropdown>

              <MobileDropdown
                id="pages"
                label="Pages"
                open={mobileDropdown}
                setOpen={setMobileDropdown}
              >
                {NAV_PAGES.map((p, i) => (
                  <MobileLink key={i} href={p.link} onClick={setMobileOpen}>
                    {p.name}
                  </MobileLink>
                ))}
              </MobileDropdown>
              {navTop
                .filter((item) => item.link === "/contact-us")
                .map((item) => (
                  <MobileLink
                    key={item.link}
                    href={item.link}
                    onClick={setMobileOpen}
                  >
                    {item.name}
                  </MobileLink>
                ))}
              <MobileLink href={auth.login.link} onClick={setMobileOpen}>
                {auth.login.name}
              </MobileLink>
              {roboUser && (
                <MobileLink href={auth.signup.link} onClick={setMobileOpen}>
                  {auth.signup.name}
                </MobileLink>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NavbarTheme4;

const NavLink = ({ href, active, children }) => (
  <Link
    href={href}
    className={`transition ${active
        ? "text-[var(--rv-primary-light)]"
        : "hover:text-[var(--rv-primary-light)]"
      }`}
  >
    {children}
  </Link>
);

const Dropdown = ({ label, active, children }) => (
  <div className="relative group">
    <div
      className={`flex items-center gap-1 cursor-pointer transition ${active
          ? "text-[var(--rv-white)]"
          : "hover:text-[var(--rv-primary-light)]"
        }`}
    >
      {label}
      <FiChevronDown className="transition group-hover:rotate-180" />
    </div>

    <div className="absolute left-0 top-full z-50 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-[var(--rv-bg-white)] text-[var(--rv-black)] rounded-md shadow-lg min-w-[220px] p-2 mt-2">
      {children}
    </div>
  </div>
);

const DropdownItem = ({ href, active, children }) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md transition ${active
        ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)]"
        : "hover:bg-[var(--rv-bg-primary)] hover:text-[var(--rv-white)]"
      }`}
  >
    {children}
  </Link>
);

const MobileDropdown = ({ label, id, open, setOpen, children }) => (
  <div className="mt-4">
    <button
      onClick={() => setOpen(open === id ? null : id)}
      className="flex justify-between w-full text-[var(--rv-white)]"
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
          className="ml-4 mt-2 flex flex-col gap-2 overflow-hidden"
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
    className="block mt-3 text-[var(--rv-white)] hover:text-[var(--rv-primary)] transition"
  >
    {children}
  </Link>
);
