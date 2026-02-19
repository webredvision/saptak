"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Button from "@/app/components/Button/Button";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackButton({ isDark = false }) {
    const [open, setOpen] = useState(false);

    const RotatedMessageCircle = (props) => (
        <MessageCircle {...props} className={`rotate-[90deg] ${props.className || ''}`} />
    );

    return (
        <>
            <div className="fixed top-[51.5%] right-0 -translate-y-1/2 rotate-[-90deg] origin-bottom-right z-40">
                <Button
                    onClick={() => setOpen(true)}
                    text="Feedback"
                    Icon={RotatedMessageCircle}
                    className="shadow-lg"
                />
            </div>

            {open && <FeedbackModal onClose={() => setOpen(false)} isDark={isDark} />}
        </>
    );
}
