// components/FundCategoryTabs.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { FundCategorySkeleton } from "@/app/components/skeletons/performanceSkeleton";
import {
  TrendingUp,
  Banknote,
  Scale,
  Shield,
  MoreHorizontal,
  Building2,
  BarChart3,
  Sprout,
  FileText,
  Droplets,
  Coins,
  Activity,
  Pill,
  Laptop,
  Landmark,
  Car,
  ShoppingCart,
  HardHat,
  PieChart,
  Percent,
  Tag,
  Target,
  Layers,
  Zap,
  Globe,
  Home,
  Leaf,
  Factory
} from "lucide-react";

export default function FundCategoryTabs() {
  const [activeTab, setActiveTab] = useState("Equity");
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [loadingMain, setLoadingMain] = useState(true);

  const tabs = ["Equity", "Debt", "Hybrid", "Sol Oriented", "Others"];
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

  const fetchSchemes = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/fund-performance/fpsub-category?categorySchemes=${category}`
      );
      if (response.status === 200) {
        setSchemes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when tab changes
  useEffect(() => {
    if (activeTab) {
      fetchSchemes(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    // Simulate fetch delay or trigger when actual data is ready
    const timer = setTimeout(() => {
      setLoadingMain(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (category) => {
    setActiveTab(category); // let useEffect handle fetch
  };

  const getSlug = (item) =>
    item
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleCategoryClick = (item) => {
    const dataToStore = {
      schemeName: item,
      timestamp: Date.now(),
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToStore),
      SECRET_KEY
    ).toString();

    localStorage.setItem("encryptedscheme", encrypted);
  };

  const getTabIcon = (tabName, isActive) => {
    const iconProps = {
      size: 24,
      className: "text-[var(--rv-primary)]"
    };

    switch (tabName) {
      case "Equity": return <TrendingUp {...iconProps} />;
      case "Debt": return <Banknote {...iconProps} />;
      case "Hybrid": return <Layers {...iconProps} />;
      case "Sol Oriented": return <Shield {...iconProps} />;
      case "Others": return <MoreHorizontal {...iconProps} />;
      default: return <TrendingUp {...iconProps} />;
    }
  };

  const getFundIcon = (fundName) => {
    const name = fundName.toLowerCase();
    const props = { size: 24, className: "text-[var(--rv-white)]" };

    if (name.includes("flexi")) return <Scale {...props} />;
    if (name.includes("large") && name.includes("mid")) return <PieChart {...props} />;
    if (name.includes("large")) return <Building2 {...props} />;
    if (name.includes("mid")) return <BarChart3 {...props} />;
    if (name.includes("small")) return <Sprout {...props} />;
    if (name.includes("contra")) return <Zap {...props} />;
    if (name.includes("value")) return <Tag {...props} />;
    if (name.includes("elss")) return <FileText {...props} />;
    if (name.includes("pharma") || name.includes("health")) return <Pill {...props} />;
    if (name.includes("bank") || name.includes("financial")) return <Landmark {...props} />;
    if (name.includes("infra")) return <HardHat {...props} />;
    if (name.includes("consumption")) return <ShoppingCart {...props} />;
    if (name.includes("tech") || name.includes("digital")) return <Laptop {...props} />;
    if (name.includes("dividend")) return <Percent {...props} />;
    if (name.includes("index") || name.includes("etf")) return <Activity {...props} />;
    if (name.includes("gold")) return <Coins {...props} />;
    if (name.includes("liquid") || name.includes("overnight")) return <Droplets {...props} />;
    if (name.includes("auto") || name.includes("transport")) return <Car {...props} />;
    if (name.includes("energy") || name.includes("power")) return <Zap {...props} />;
    if (name.includes("esg") || name.includes("sustain")) return <Leaf {...props} />;
    if (name.includes("manufacturing")) return <Factory {...props} />;
    if (name.includes("international") || name.includes("global")) return <Globe {...props} />;
    if (name.includes("housing") || name.includes("real estate")) return <Home {...props} />;
    if (name.includes("focused")) return <Target {...props} />;

    // Default fallback based on active tab could be better, but generic for now
    if (name.includes("debt") || name.includes("bond")) return <Banknote {...props} />;
    if (name.includes("hybrid")) return <Layers {...props} />;

    return <TrendingUp {...props} />;
  };

  return (
    <div className=" ">
      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 md:px-10">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`group flex items-center gap-2 p-3 rounded-t-xl text-[20px] font-semibold transition-all duration-300 ${activeTab === tab
              ? "bg-[var(--rv-primary)] text-[var(--rv-white)] shadow-lg"
              : "bg-[var(--rv-secondary-light)] hover:bg-[var(--rv-primary)] hover:text-[var(--rv-white)] mb-1"
              }`}
            onClick={() => handleCategorySelect(tab)}
          >
            <div>
              <div className="bg-[var(--rv-bg-white)] w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full p-2 shadow-sm">
                {getTabIcon(tab, activeTab === tab)}
              </div>
            </div>
            <h6> {tab}</h6>
          </button>
        ))}
      </div>

      <div className="bg-[var(--rv-secondary-light)] rounded-xl p-6 border border-[var(--rv-white-light)] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {loadingMain ? (
            <FundCategorySkeleton />
          ) : (
            schemes.map((item, idx) => (
              <Link
                key={idx}
                href={`/performance/fund-performance/${getSlug(item)}`}
                className="group flex items-center justify-between rounded-lg hover:scale-105 transition-all cursor-pointer"
                onClick={() => handleCategoryClick(item)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--rv-secondary-dark)] rounded-full w-12 h-12 flex items-center justify-center p-2 shadow-inner group-hover:bg-[var(--rv-primary)] transition-colors">
                    {getFundIcon(item)}
                  </div>
                  <div className="text-sm font-semibold text-[var(--rv-text)] group-hover:text-[var(--rv-primary)] transition-colors">
                    {item}
                  </div>
                </div>

                <div className="p-2 rounded-full transition-all group-hover:bg-[var(--rv-primary)] group-hover:-rotate-45">
                  <FaArrowRight className="text-[var(--rv-primary)] group-hover:text-[var(--rv-white)] transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
