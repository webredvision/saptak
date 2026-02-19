"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const AppSectionTheme4 = ({ sitedata }) => {
  const playStoreUrl = sitedata?.appsplaystoreurl;
  const appStoreUrl = sitedata?.appsappleurl;

  return (
    <div>
      <section className="relative w-full p-4 overflow-hidden bg-[var(--rv-bg-white)]">
        <div className="main-section border-b">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-5 text-[var(--rv-black)]">
              <p className="tracking-widest text-[var(--rv-secondary)] ">
                DOWNLOAD OUR APPS
              </p>

              <h1 className="font-bold">
                Get paid easily and securely with our payment gateway
              </h1>

              <p className="">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </p>

              <div className="flex gap-4 flex-wrap">
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
            <div className="relative border border-[var(--rv-primary)] z-10 bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-xl overflow-hidden">
              <div className="relative">
                <Image
                  src="/images/hand-mobile.png"
                  alt="Mobile UI"
                  width={500}
                  height={500}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppSectionTheme4;
