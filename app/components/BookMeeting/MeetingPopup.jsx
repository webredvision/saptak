"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import SlotGrid from "./SlotGrid";
import BookingForm from "./BookingForm";
import Button from "@/app/components/Button/Button";
import { X } from "lucide-react";

export default function MeetingPopup({ onClose, isDark = false }) {
    const timeZone = "Asia/Kolkata";
    const getNowInTimeZone = () =>
        new Date(new Date().toLocaleString("en-US", { timeZone }));
    const getTodayInTimeZoneString = () =>
        format(getNowInTimeZone(), "yyyy-MM-dd");

    const [selectedDate, setSelectedDate] = useState(getTodayInTimeZoneString());
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [confirmedLink, setConfirmedLink] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState("");

    useEffect(() => {
        const fetchSlots = async () => {
            setSlotsLoading(true);
            setSlotsError("");
            try {
                const res = await fetch(`/api/slots?date=${selectedDate}`, {
                    cache: "no-store",
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.error || "Failed to fetch slots");
                }

                let fetchedSlots = Array.isArray(data?.slots) ? data.slots : [];
                const now = getNowInTimeZone();
                const todayInTz = format(now, "yyyy-MM-dd");

                if (selectedDate === todayInTz) {
                    const currentHours = now.getHours();
                    const currentMinutes = now.getMinutes();

                    fetchedSlots = fetchedSlots.map((slot) => {
                        const [time, modifier] = slot.time.split(" ");
                        let [hours, minutes] = time.split(":").map(Number);

                        const meridiem = modifier?.toUpperCase();
                        if (meridiem === "PM" && hours !== 12) hours += 12;
                        if (meridiem === "AM" && hours === 12) hours = 0;

                        if (
                            hours < currentHours ||
                            (hours === currentHours && minutes <= currentMinutes)
                        ) {
                            return { ...slot, booked: true };
                        }
                        return slot;
                    });
                }
                setSlots(fetchedSlots);
            } catch (error) {
                console.error("Failed to fetch slots:", error?.message || error);
                setSlots([]);
                setSlotsError("Unable to load slots. Please try again.");
            } finally {
                setSlotsLoading(false);
            }
        };
        fetchSlots();
    }, [selectedDate]);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            className="fixed inset-0 bg-[var(--rv-bg-black)]/50 backdrop-blur-sm flex justify-center items-center z-50"
        >
            <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`rounded-2xl shadow-2xl w-[95%] max-w-xl relative overflow-hidden bg-[var(--rv-bg-white)]`}
            >
                <div className="bg-gradient-to-r from-[var(--rv-primary-dark)] to-[var(--rv-secondary-dark)] text-[var(--rv-white)] px-6 py-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Schedule a Meeting</h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--rv-white-dark)] hover:text-[var(--rv-white)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {!bookingSuccess ? (
                        <>
                            <label className="block mb-2 font-medium text-[var(--rv-black)]">
                                Select Date
                            </label>
                            <input
                                type="date"
                                min={getTodayInTimeZoneString()}
                                className="border border-[var(--rv-secondary)] focus:border-[var(--rv-primary)] p-2 rounded w-full mb-4 outline-none transition-colors"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedSlot(null);
                                }}
                            />

                            <SlotGrid
                                slots={slots}
                                selectedDate={selectedDate}
                                onBookClick={setSelectedSlot}
                            />
                            {slotsLoading && (
                                <p className="text-center text-sm text-[var(--rv-gray-dark)] mt-2">
                                    Loading slots...
                                </p>
                            )}
                            {slotsError && (
                                <p className="text-center text-sm text-red-600 mt-2">
                                    {slotsError}
                                </p>
                            )}

                            {selectedSlot && (
                                <div className="mt-4 border-t border-[var(--rv-gray-light)] pt-4">
                                    <BookingForm
                                        date={selectedDate}
                                        slot={selectedSlot}
                                        onConfirm={(link) => {
                                            setConfirmedLink(link || null);
                                            setBookingSuccess(true);
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <h3 className="text-xl font-semibold mb-2 text-[var(--rv-black)]">
                                Meeting Booked Successfully!
                            </h3>
                            <p className="text-[var(--rv-gray-dark)] mb-3">
                                {confirmedLink
                                    ? "Your meeting has been booked. Use the link below to join at the scheduled time."
                                    : "Your meeting has been booked successfully."}
                            </p>

                            {confirmedLink && (
                                <a
                                    href={confirmedLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block text-sm font-semibold text-[var(--rv-secondary)] hover:text-[var(--rv-secondary-dark)] transition-colors"
                                >
                                    Open Meeting Link
                                </a>
                            )}

                            <div className="flex justify-center">
                                <Button
                                    onClick={onClose}
                                    text="Close"
                                    className="mt-4 shadow-md"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}


