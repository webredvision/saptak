"use client";

import React from "react";
import Image from "next/image";
import Heading from "@/app/components/Heading/Heading";
import { FiZap } from "react-icons/fi";
import { FaShield } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";
import Link from "next/link";

const AppSectionTheme5 = ({ sitedata }) => {
  const playStoreUrl = sitedata?.appsplaystoreurl;
  const appStoreUrl = sitedata?.appsappleurl;

  return (
    <div>
      <section className="relative w-full p-4 md:p-0 overflow-hidden bg-[var(--rv-secondary)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
          <div className="relative">
            <Image
              src="/images/hand-mobile.png"
              alt="Mobile UI"
              width={500}
              height={800}
              className="w-full h-full"
            />
          </div>

          <div className="text-[var(--rv-white)] md:main-section flex flex-col gap-5">
            <Heading
              variant="light"
              align="start"
              title={"DOWNLOAD OUR APPS"}
              description={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
              }
              heading={"Get paid easily and securely with our payment gateway"}
              highlight={"our payment"}
            />
            <div className="space-y-4">
              {[
                { icon: FiZap, text: "Lightning-fast transactions" },
                { icon: FaShield, text: "Bank-level security" },
                { icon: FaStar, text: "Exclusive app-only rewards" },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="bg-[var(--rv-bg-primary)] p-2 rounded-lg">
                    <feature.icon className="w-5 h-5 " />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex  flex-col gap-2">
                <div className="rounded p-1 text-[var(--rv-white)]">
                  <BsQrCode size={70} />
                </div>
                <div>
                  <p className="font-bold">Scan to Download</p>
                  <p className="">Available for Android & iOS</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
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
                      className=""
                    />
                  </Link>
                ) : (
                  <Image
                    src="/images/gplay.png"
                    alt="Google Play"
                    width={160}
                    height={50}
                    className=""
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
                      className=""
                    />
                  </Link>
                ) : (
                  <Image
                    src="/images/appstore.png"
                    alt="App Store"
                    width={160}
                    height={50}
                    className=""
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppSectionTheme5;
