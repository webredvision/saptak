"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/**
 * WebPopup Component
 * Displays an active popup from the admin panel once per session.
 */
const WebPopup = ({ popups }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPopup, setCurrentPopup] = useState(null);

    useEffect(() => {
        if (popups && popups.length > 0) {
            // Check if popup has already been shown in this session
            const shown = sessionStorage.getItem("popupShown");
            if (!shown) {
                // Show the first active popup
                setCurrentPopup(popups[0]);
                setIsOpen(true);
            }
        }
    }, [popups]);

    const closePopup = () => {
        setIsOpen(false);
        // Mark as shown for this session
        sessionStorage.setItem("popupShown", "true");
    };

    if (!isOpen || !currentPopup) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all animate-in fade-in duration-300">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                    aria-label="Close popup"
                >
                    <X size={24} />
                </button>

                {/* Popup Image */}
                {currentPopup.image?.url && (
                    <div className="relative w-full aspect-[4/3] md:aspect-video bg-gray-100">
                        <Image
                            src={currentPopup.image.url}
                            alt={currentPopup.title || "Special Offer"}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                )}

                {/* Optional Title Overlay or Footer */}
                {currentPopup.title && !currentPopup.image?.url && (
                    <div className="p-10 text-center">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-secondary)] bg-clip-text text-transparent">
                            {currentPopup.title}
                        </h2>
                    </div>
                )}

                {currentPopup.title && currentPopup.image?.url && (
                    <div className="p-4 bg-[var(--rv-bg-surface)] text-center border-t border-[var(--rv-border)]">
                        <p className="font-semibold text-lg text-[var(--rv-text)]">{currentPopup.title}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebPopup;
