"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import CalculatorHeader from "@/app/components/calculators/CalculatorHeader";
import { calculator } from "@/data/calculators";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function Page({ isDark = false }) {
  const router = useRouter();
  const [primaryColor, setPrimaryColor] = useState("124a7b");
  const [secondaryColor, setSecondaryColor] = useState("f0d310");
  const [bgColor, setBgColor] = useState("f5f7ff");
  const [loading, setLoading] = useState(true);
  const [sitedata, setSiteData] = useState();

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`,
        );
        if (res.status === 200) {
          setSiteData(res.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSiteData();
  }, []);

  useEffect(() => {
    const rgbToHex = (color) => {
      if (!color) return null;
      if (color.startsWith("#")) return color.replace("#", "");
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        return (
          (1 << 24) +
          (parseInt(rgb[0]) << 16) +
          (parseInt(rgb[1]) << 8) +
          parseInt(rgb[2])
        )
          .toString(16)
          .slice(1);
      }
      return color;
    };

    const rootStyle = getComputedStyle(document.documentElement);
    const primary = rootStyle.getPropertyValue("--rv-primary").trim();
    const secondary = rootStyle.getPropertyValue("--rv-secondary").trim();

    // Attempt to get dark background if in dark mode, else default
    let background = "f5f7ff";
    if (isDark) {
      // Try to get --rv-secondary-dark or fallback to a known dark hex
      const darkBg = rootStyle.getPropertyValue("--rv-secondary-dark").trim();
      background = rgbToHex(darkBg) || "1a0b1c";
    }

    setPrimaryColor(rgbToHex(primary) || "124a7b");
    setSecondaryColor(rgbToHex(secondary) || "f0d310");
    setBgColor(background);
  }, [isDark]);

  const iframeSrc = `https://www.redvisiontechnologies.com/iframe/calculator/calculator.php?apikey=&primarycolor=${primaryColor}&secondarycolor=${secondaryColor}&primaryactive=111111&bgcolo=${bgColor}`;

  return (
    <div>
      <InnerPage title={"Tax Calculator"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <CalculatorHeader
            title="Tax Calculator"
            subtitle="Tax Saving & Planning"
            activeCalculator="Tax Calculator"
            // No download button for iframe-based calculator, or it's inside the iframe
          />

          <div className="mt-5 min-h-[600px] relative rounded-2xl overflow-hidden border border-[var(--rv-primary)] bg-[var(--rv-bg-surface)] shadow-xl">
            {loading && (
              <div className="absolute inset-0 z-10 p-5 space-y-4 animate-pulse bg-[var(--rv-bg-surface)]">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-[500px] w-full" />
              </div>
            )}
            <iframe
              src={iframeSrc}
              className="w-full h-[600px] md:h-[800px] lg:h-[900px]"
              title="Financial Calculator"
              allowFullScreen
              onLoad={() => setLoading(false)}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
