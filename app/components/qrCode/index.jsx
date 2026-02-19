"use client";

import { useEffect, useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Link from "next/link";
import { LuQrCode } from "react-icons/lu";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCode({ sitedata }) {
    const [appLinkUrl, setAppLinkUrl] = useState(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || ""}/api/app-links`
    );

    useEffect(() => {
        setAppLinkUrl(`${window.location.origin}/api/app-links`);
    }, []);

    return (
        <div className="fixed bottom-[75px] right-[18px] z-20">
            <ul className="flex flex-col space-y-2">
                <li className="list-none p-1 rounded-l-full">
                    <div className="relative flex items-center group">
                        <div className="w-12 h-12 bg-[var(--rv-bg-surface)] text-[var(--rv-text)] border border-[var(--rv-border)] rounded-full cursor-pointer flex items-center justify-center shadow-lg">
                            <LuQrCode className="text-3xl" />
                        </div>

                        <div
                            className="
                absolute right-12 top-full flex flex-col items-center
                min-w-52 bg-[var(--rv-bg-surface)] text-[var(--rv-text)] border border-[var(--rv-border)] p-2 rounded-lg shadow-lg
                opacity-0 scale-90 -translate-y-full
                pointer-events-none
                transition-all duration-300 ease-in-out
                group-hover:opacity-100
                group-hover:scale-100
                group-hover:pointer-events-auto
              "
                        >
                            <p className="text-center text-sm font-light mb-2">
                                Scan to Download <br />
                                {sitedata?.websiteName} App
                            </p>

                            <div className="w-40 h-40 rounded-xl overflow-hidden border border-[var(--rv-border)] bg-[var(--rv-bg-white)] flex items-center justify-center p-2">
                                {appLinkUrl ? (
                                    <QRCodeCanvas
                                        value={appLinkUrl}
                                        size={144}
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
                            </div>

                            {(sitedata?.appsappleurl || sitedata?.appsplaystoreurl) && (
                                <div className="grid grid-cols-2 w-full items-center justify-center gap-3 mt-4">
                                    {sitedata?.appsappleurl && (
                                        <Link
                                            href={sitedata.appsappleurl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-[var(--rv-bg-black)] text-[var(--rv-white)] hover:bg-[var(--rv-bg-secondary)] hover:text-[var(--rv-white)] transition shadow-lg"
                                        >
                                            <FaApple size={25} />
                                        </Link>
                                    )}
                                    {sitedata?.appsplaystoreurl && (
                                        <Link
                                            href={sitedata.appsplaystoreurl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-[var(--rv-bg-black)] text-[var(--rv-white)] hover:bg-[var(--rv-bg-secondary)] hover:text-[var(--rv-white)] transition shadow-lg"
                                        >
                                            <FaGooglePlay size={25} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}
