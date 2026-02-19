"use client";

import React from "react";
import Sidebar from "@/app/(admin)/admin/Sidebar";
import Header from "@/app/(admin)/admin/Header";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

const LayoutContent = ({ children, sitedata }) => {
    const { sidebarOpen, isMobile } = useSidebar();

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sitedata={sitedata} />

            <div
                className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isMobile ? "w-full" : sidebarOpen ? "ml-0" : "ml-0"}
        `}
            >
                <Header />
                <main className="flex-1 overflow-y-auto bg-[var(--rv-bg-gray-light)] p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default function DefaultLayout({ children, sitedata }) {
    return (
        <SidebarProvider>
            <LayoutContent sitedata={sitedata}>{children}</LayoutContent>
        </SidebarProvider>
    );
}
