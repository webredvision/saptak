"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { FiSmartphone, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";
import { BsQrCodeScan } from "react-icons/bs";
import Heading from "@/app/components/Heading/Heading";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
const AppSectionTheme3 = ({ sitedata }) => {
  const playStoreUrl = sitedata?.appsplaystoreurl;
  const appStoreUrl = sitedata?.appsappleurl;

  const [appLinkUrl, setAppLinkUrl] = useState(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || ""}/api/app-links`
  );

  useEffect(() => {
    setAppLinkUrl(`${window.location.origin}/api/app-links`);
  }, []);

  return (
    <section className="relative bg-[var(--rv-bg-white)] text-[var(--rv-black)] z-10 px-4 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-20 items-center">
          <div className="flex flex-col gap-5">
            <Heading
              align="start"
              title={"Mobile App"}
              heading={"Experience Finance on the Go"}
              description={
                "Download our powerful app and unlock exclusive features, real-time insights, and special offers tailored just for you."
              }
            />

            <div className="space-y-4">
              {[
                { icon: FiZap, text: "Lightning-fast transactions" },
                { icon: FaShield, text: "Bank-level security" },
                { icon: FaStar, text: "Exclusive app-only rewards" },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] p-2 rounded-lg">
                    <feature.icon className="w-5 h-5 " />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                {appLinkUrl ? (
                  <QRCodeCanvas
                    value={appLinkUrl}
                    size={130}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/favicon.ico",
                      x: undefined,
                      y: undefined,
                      height: 28,
                      width: 28,
                      excavate: true,
                    }}
                  />
                ) : (
                  <LuQrCode className="text-9xl text-[var(--rv-text)]" />
                )}
                <div>
                  <p className="font-bold">Scan to Download</p>
                  <p className="">Available for Android & iOS</p>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap ">
                {playStoreUrl ? (
                  <Link
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/gplay.png"
                      alt="Google Play"
                      width={160}
                      height={50}
                      className="bg-[var(--rv-black)] rounded-xl"
                    />
                  </Link>
                ) : (
                  <Image
                    src="/images/gplay.png"
                    alt="Google Play"
                    width={160}
                    height={50}
                    className="bg-[var(--rv-black)] rounded-xl"
                  />
                )}
                {appStoreUrl ? (
                  <Link
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/appstore.png"
                      alt="App Store"
                      width={160}
                      height={50}
                      className="bg-[var(--rv-black)] rounded-xl"
                    />
                  </Link>
                ) : (
                  <Image
                    src="/images/appstore.png"
                    alt="App Store"
                    width={160}
                    height={50}
                    className="bg-[var(--rv-black)] rounded-xl"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-sm">
              <img
                src="/images/phone.png"
                alt="Mobile App Mockup"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppSectionTheme3;
