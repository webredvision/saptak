"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "./SidebarItem";
import { RxDashboard } from "react-icons/rx";
import { FaServicestack, FaStar, FaSignInAlt } from "react-icons/fa";
import { MdAnalytics, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { FaRobot } from "react-icons/fa6";
import { useSidebar } from "@/context/SidebarContext";
import useLogoSrc from "@/hooks/useLogoSrc";
export const menuGroups = [
  {
    name: "Main Menu",
    menuItems: [
      {
        icon: <RxDashboard />,
        label: "Dashboard",
        route: "/devadmin",
        permission: "dashboard",
      },
      {
        icon: <FaServicestack />,
        label: "Services",
        route: "/devadmin/manage-services",
        permission: "manage_services",
      },
      {
        icon: <FaStar />,
        label: "Features",
        route: "/devadmin/manage-features",
        permission: "manage_features",
      },
      {
        icon: <FaSignInAlt />,
        label: "Login Desk",
        route: "/devadmin/manage-login",
        permission: "manage_login",
      },
      {
        icon: <FaRobot />,
        label: "Software & Robo User",
        route: "/devadmin/manage-robo-users",
        permission: "software_robo_user",
      },
      {
        icon: <MdAnalytics />,
        label: "Analytics Settings",
        route: "/devadmin/manage-analytics",
        permission: "analytics_settings",
      },
      {
        icon: <BiLogOut />,
        label: "Logout",
        type: "logout",
        permission: "logout",
      },
    ],
  },
];

const Sidebar = ({}) => {
  const logoSrc = useLogoSrc();
  const [pageName, setPageName] = useState("dashboard");
  const { sidebarOpen, closeSidebar, isMobile } = useSidebar();

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-[var(--rv-bg-black)]"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`
          top-0 left-0 z-50 h-screen bg-[var(--rv-bg-gray-light)] border-r border-[var(--rv-gray)] shadow-xl
          transform transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed w-80 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `relative ${sidebarOpen ? "w-80" : "w-0 -ml-0"}`
          }
          flex flex-col
          overflow-hidden
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--rv-gray)]">
          <Link href="/admin" className="h-20">
           {logoSrc ? (
              <Image
                src={logoSrc}
                alt="logo"
                width={120}
                height={50} 
                priority
                className="w-full h-full object-cover"
              />
            ) : (
              <h1 className="text-[var(--rv-primary)]  font-bold">Logo</h1>
            )}
          </Link>

          {isMobile && (
            <button
              onClick={closeSidebar}
              className="w-8 h-8 flex items-center justify-center bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-lg text-2xl cursor-pointer hover:bg-[var(--rv-bg-primary)] transition-colors"
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {menuGroups?.map((group, gIdx) => (
            <div key={gIdx} className="mb-4">
              <p className="font-medium mb-3 uppercase">
                {group?.name}
              </p>
              <ul className="space-y-1">
                {group?.menuItems?.map((item, idx) => (
                  <SidebarItem
                    key={idx}
                    item={item}
                    pageName={pageName}
                    setPageName={setPageName}
                    isOpen={openIndex === `${gIdx}-${idx}`}
                    onToggle={() => handleToggle(`${gIdx}-${idx}`)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
