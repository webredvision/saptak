"use client";

import React from "react";
import Image from "next/image";
import Heading from "@/app/components/Heading/Heading";
import Link from "next/link";
import { BsQrCodeScan } from "react-icons/bs";

const AppSectionTheme2 = ({ sitedata }) => {
  const playStoreUrl = sitedata?.appsplaystoreurl;
  const appStoreUrl = sitedata?.appsappleurl;

  return (
    <section className="w-full bg-[var(--rv-bg-black)] text-[var(--rv-white)] p-2 md:p-4 relative">
      <div className="relative w-full rounded-xl bg-[var(--rv-bg-secondary)] overflow-hidden">
        <div className="max-w-7xl mx-auto main-section grid grid-cols-1 lg:grid-cols-3 items-center gap-5 lg:gap-12">
          <div className="relative flex justify-center items-center">
            <div className="relative rounded-xl">
              <Image
                src="/images/phone.png"
                alt="Mobile UI"
                width={300}
                height={400}
                className=""
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-10 col-span-2">
            <Heading
              variant=""
              align="start"
              title={"DOWNLOAD OUR APPS"}
              heading={"Get paid easily and securely with our payment gateway"}
              description={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
              }
            />
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div className="rounded shadow-md p-1 ">
                  <BsQrCodeScan size={70} />
                </div>
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
      </div>
    </section>
  );
};

export default AppSectionTheme2;
