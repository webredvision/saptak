"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX } from "react-icons/fi";
import { HiSearch } from "react-icons/hi";
import Button from "@/app/components/Button/Button";
import useLogoSrc from "@/hooks/useLogoSrc";
import SmartSearch from "@/app/components/SmartSearch";
import {
  NAV_AUTH,
  NAV_PAGES,
  NAV_TOOLS,
  NAV_TOP,
} from "@/lib/Navbar/navConfig";

const NavbarTheme2 = ({ services = [], roboUser }) => {
  const pathname = usePathname();
  const logoSrc = useLogoSrc();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const mobileRef = useRef(null);

  const tools = NAV_TOOLS;

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

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setSearchOpen(false);
    if (searchOpen) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [searchOpen]);

  const isActive = (href) => pathname === href;
  const isServicesActive = pathname.startsWith("/services");
  const isToolsActive = pathname.startsWith("/tools");
  const navTop = NAV_TOP;
  const auth = NAV_AUTH;

  return (
    <>
      <div className="px-2 pt-2 md:px-4 md:pt-4 bg-[var(--rv-bg-black)]">
        <header className="sticky top-0 z-50 rounded-xl bg-[var(--rv-bg-secondary)] px-4 py-3 shadow-lg">
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
            <nav className="hidden lg:flex gap-8 font-medium text-[var(--rv-white)]">
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
            <div className="flex items-center gap-5 text-[var(--rv-white)]">
              <HiSearch
                className="cursor-pointer text-xl"
                onClick={() => setSearchOpen(true)}
              />

              <div className="hidden lg:flex gap-4 items-center">
                <Link href={auth.login.link}>{auth.login.name}</Link>
                {roboUser && (
                  <Button link={auth.signup.link} text={auth.signup.name} />
                )}
              </div>

              <button
                className="lg:hidden text-2xl"
                onClick={() => setMobileOpen(true)}
              >
                ☰
              </button>
            </div>
          </div>
        </header>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              ref={mobileRef}
              className="fixed top-0 right-0 z-50 h-screen w-72 bg-[var(--rv-bg-secondary-dark)] p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
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
          </>
        )}
      </AnimatePresence>

      <SmartSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default NavbarTheme2;

const NavLink = ({ href, active, children }) => (
  <Link
    href={href}
    className={`transition ${active ? "text-[var(--rv-primary)]" : "hover:text-[var(--rv-primary)]"
      }`}
  >
    {children}
  </Link>
);

const Dropdown = ({ label, active, children }) => (
  <div className="relative group">
    <div
      className={`flex items-center gap-1 cursor-pointer transition ${active ? "text-[var(--rv-primary)]" : "hover:text-[var(--rv-primary)]"
        }`}
    >
      {label}
      <FiChevronDown className="transition group-hover:rotate-180" />
    </div>

    <div
      className="
        absolute left-0 top-full z-50
        invisible opacity-0 translate-y-2
        group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
        transition-all duration-200
        bg-[var(--rv-bg-surface)]
        border border-[var(--rv-border)]
        rounded-md shadow-lg
        min-w-[220px] p-2 mt-2
      "
    >
      <div className="">{children}</div>
    </div>
  </div>
);

const DropdownItem = ({ href, active, children }) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md transition text-[var(--rv-text)] ${active
        ? "text-[var(--rv-primary)] bg-[var(--rv-bg-secondary-light)]"
        : "hover:bg-[var(--rv-bg-secondary-light)] hover:text-[var(--rv-primary)]"
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
