"use client";

import React from "react";
import Image from "next/image";
import Heading from "@/app/components/Heading/Heading";
import Link from "next/link";

const AppSectionTheme1 = ({ sitedata }) => {
  const playStoreUrl = sitedata?.appsplaystoreurl;
  const appStoreUrl = sitedata?.appsappleurl;

  return (
    <section
      className="relative w-full overflow-hidden bg-[var(--rv-bg-primary)] px-4 pt-10 lg:px-0 "
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center md:gap-5 gap-10">

        <div className="order-1 lg:order-2 text-[var(--rv-white)] max-w-xl mx-auto lg:mx-0 flex flex-col gap-8">
          <Heading align="start" variant="light" title={'Download Our Apps'} heading={' Get paid easily and securely with our payment gateway'} 
          description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.'}/>
        
          <div className="flex gap-4 flex-wrap">
            {playStoreUrl ? (
              <Link href={playStoreUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/gplay.png"
                  alt="Google Play"
                  width={160}
                  height={50}
                />
              </Link>
            ) : (
              <Image
                src="/images/gplay.png"
                alt="Google Play"
                width={160}
                height={50}
              />
            )}
            {appStoreUrl ? (
              <Link href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/appstore.png"
                  alt="App Store"
                  width={160}
                  height={50}
                />
              </Link>
            ) : (
              <Image
                src="/images/appstore.png"
                alt="App Store"
                width={160}
                height={50}
              />
            )}
          </div>
        </div>

        <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
          <Image
            src="/images/hand-mobile.png"
            alt="hand-mobile"
            width={500}
            height={800}
            priority
          />
        </div>

      </div>
    </section>
  );
};

export default AppSectionTheme1;
