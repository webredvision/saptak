"use client";

import { format } from "date-fns";
import Button from "@/app/components/Button/Button";

const timeZone = "Asia/Kolkata";
const getNowInTimeZone = () =>
  new Date(new Date().toLocaleString("en-US", { timeZone }));

export default function SlotGrid({ slots, onBookClick, selectedDate }) {
  if (!slots?.length)
    return (
      <p className="text-center text-[var(--rv-secondary)] italic">
        No slots available.
      </p>
    );

  const now = getNowInTimeZone();
  const todayInTz = format(now, "yyyy-MM-dd");
  const isPastDate = selectedDate < todayInTz;

  return (
    <div className="flex flex-wrap md:grid md:grid-cols-3 gap-3 mb-4">
      {slots.map((slot) => (
        <div>
          {(() => {
            let isPastTime = false;
            if (selectedDate === todayInTz) {
              const [time, modifierRaw] = slot.time.split(" ");
              let [hours, minutes] = time.split(":").map(Number);
              const modifier = modifierRaw?.toUpperCase();
              if (modifier === "PM" && hours !== 12) hours += 12;
              if (modifier === "AM" && hours === 12) hours = 0;
              const currentHours = now.getHours();
              const currentMinutes = now.getMinutes();
              isPastTime =
                hours < currentHours ||
                (hours === currentHours && minutes <= currentMinutes);
            }
            const disabled = slot.booked || isPastDate || isPastTime;
            return (
              <button
                key={slot.time}
                disabled={disabled}
                onClick={() => onBookClick(slot)}
                className={`w-full px-1 h-12 rounded-xl bg-[var(--rv-bg-secondary-light)] hover:bg-[var(--rv-bg-secondary-light)] text-[var(--rv-text-muted)] hover:text-[var(--rv-text)] transition-all border border-[var(--rv-border)] flex items-center justify-center ${
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              >
                {slot.time}
              </button>
            );
          })()}
        </div>
      ))}
    </div>
  );
}
