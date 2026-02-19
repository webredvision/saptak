import Link from "next/link";
import React from "react";
import { FaHome } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";

const InnerTheme2 = ({ title }) => {
  return (
    <section className="bg-[var(--rv-bg-black)] p-2 md:p-4 text-[var(--rv-white)] overflow-hidden">
      <div className="bg-[var(--rv-bg-secondary)] rounded-xl overflow-hidden relative z-10 before:content-[''] before:absolute before:inset-0 before:bg-[url('/images/innerpage.webp')] before:bg-cover before:bg-center before:-z-10">
        <div className="w-full h-full bg-black/70 px-4 relative">
          <div className="absolute -bottom-72 right-1/4 w-96 h-96 rounded-full bg-[var(--rv-bg-primary)] blur-[100px]"></div>
          <div className="w-full md:p-28 px-4 py-20 text-center text-[var(--rv-white)] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <h1>{title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-2 bg-[var(--rv-bg-white-light)] w-fit px-2 p-1 rounded-full">
                <Link href={"/"}>
                  <div className="flex items-center gap-2">
                    <FaHome />
                    <p className=" ">Home</p>
                    <MdArrowForwardIos />
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <p className=" ">{title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnerTheme2;
