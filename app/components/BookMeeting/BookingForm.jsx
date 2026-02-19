"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/Button/Button";
import CaptchaRow from "@/app/components/Captcha/CaptchaRow";

export default function BookingForm({ date, slot, onConfirm }) {
    const [form, setForm] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaImage, setCaptchaImage] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");

    const generateCaptchaText = () =>
        Math.random().toString(36).substring(2, 8).toUpperCase();

    const createCaptchaSVG = (text) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="40" width="120">
      <rect width="100%" height="100%" fill="#f8d7c3"/>
      <text x="10" y="28" font-size="24" fill="#a30a00" font-family="monospace">${text}</text>
    </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    const refreshCaptcha = () => {
        const newCaptcha = generateCaptchaText();
        setCaptcha(newCaptcha);
        setCaptchaImage(createCaptchaSVG(newCaptcha));
        setCaptchaInput("");
    };

    useEffect(() => {
        refreshCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaInput.trim()) {
            alert("Please enter the captcha.");
            return;
        }
        if (captcha.trim().toUpperCase() !== captchaInput.trim().toUpperCase()) {
            alert("Captcha mismatch. Please try again.");
            refreshCaptcha();
            return;
        }
        setLoading(true);

        try {
            const res = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, time: slot.time, ...form }),
            });

            const data = await res.json();

            if (res.ok) {
                onConfirm(data.meetLink);
            } else {
                alert(data.error || "Something went wrong!");
            }
        } catch (error) {
            alert("Failed to book meeting. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-[var(--rv-gray-light)] pt-4 mt-4"
        >
            <h3 className="font-semibold text-lg mb-4 text-center text-[var(--rv-black)]">
                Booking for {slot.time}
            </h3>

            <input
                type="text"
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-[var(--rv-primary-light)] focus:border-[var(--rv-secondary-dark)] p-2 rounded-lg mb-3 outline-none transition-colors"
            />

            <input
                type="email"
                required
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[var(--rv-primary-light)] focus:border-[var(--rv-secondary-dark)] p-2 rounded-lg mb-4 outline-none transition-colors"
            />

            <div className="mb-4">
                <CaptchaRow
                    imageSrc={captchaImage}
                    onRefresh={refreshCaptcha}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    className="bg-[var(--rv-secondary-light)] border-[var(--rv-secondary)]"
                    inputClassName="border-[var(--rv-secondary)] focus:border-[var(--rv-secondary)]/50 bg-[var(--rv-secondary-light)] text-[var(--rv-black)]"
                    buttonClassName="bg-[var(--rv-secondary)] text-[var(--rv-white)]"
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                text={loading ? "Scheduling..." : "Confirm Meeting"}
                className="w-full shadow-md"
            />
        </form>
    );
}



