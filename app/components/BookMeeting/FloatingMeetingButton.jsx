"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import Button from "@/app/components/Button/Button";
import MeetingPopup from "./MeetingPopup";

export default function FloatingMeetingButton({ isDark = false }) {
    const [open, setOpen] = useState(false);

    const RotatedCalendar = (props) => (
        <Calendar {...props} className={`rotate-[90deg] ${props.className || ''}`} />
    );

    return (
        <>
            <div className="fixed top-[25%] right-0 -translate-y-1/2 rotate-[-90deg] origin-bottom-right z-40">
                <Button
                    onClick={() => setOpen(true)}
                    text="Book a Meeting"
                    Icon={RotatedCalendar}
                    className="shadow-lg"
                />
            </div>

            {open && <MeetingPopup onClose={() => setOpen(false)} isDark={isDark} />}
        </>
    );
}

