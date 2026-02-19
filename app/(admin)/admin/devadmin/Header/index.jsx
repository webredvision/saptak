"use client";

import React, { useEffect, useState } from "react";
import DropdownUser from "./DropdownUser";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { useSidebar } from "@/context/SidebarContext";

const Header = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [sitedata, setSiteData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`,
      );
      const data = await res.json();
      setSiteData(data[0]);
    };
    fetchData();
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between bg-[var(--rv-bg-gray-light)] border-b border-[var(--rv-gray)] py-4 px-4 transition-all">
      <div className="flex items-center gap-5">
        <div
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-lg text-2xl cursor-pointer hover:bg-[var(--rv-bg-primary)] transition-colors"
        >
          {sidebarOpen ? (
            <MdKeyboardDoubleArrowLeft />
          ) : (
            <MdKeyboardDoubleArrowRight />
          )}
        </div>
        <h6 className="font-black">Dashboard</h6>
      </div>
      <DropdownUser />
    </header>
  );
};

export default Header;
