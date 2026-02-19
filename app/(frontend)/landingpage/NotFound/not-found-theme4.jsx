"use client";

import React from "react";
import Button from "@/app/components/Button/Button";

const NotFoundTheme4 = () => {
  return (
    <div className="flex items-center justify-center bg-[var(--rv-white)] text-[var(--rv-black)] px-4">
         <div className="main-section">
           <div className="relative w-full rounded-xl md:p-10 sm:p-7 p-4 text-center">
             <h1 className="relative z-10 font-extrabold tracking-wider mb-2 text-[100px] md:text-[150px] lg:text-[200px]">
               404
             </h1>
             <h2 className="relative z-10 font-semibold mb-3">
               Page Not Found
             </h2>
             <p className="relative z-10 mb-8 leading-relaxed">
               Oops! The page you are looking for doesn’t exist or has been moved.
             </p>
             <div className="relative z-10 flex justify-center">
               <Button  link={'/'} className={'border'} text={'Back to Home'}/>
             </div>
           </div>
         </div>
       </div>
  );
};

export default NotFoundTheme4;
