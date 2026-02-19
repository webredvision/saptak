"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/app/components/Button/Button";
import { X, Star } from "lucide-react";

export default function FeedbackModal({ onClose, isDark = false }) {
    const [form, setForm] = useState({
        experience: "",
        rating: 0,
        likedThings: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/user-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            setMessage(data.message || data.error);

            if (res.ok) setTimeout(onClose, 2000);
        } catch (error) {
            setMessage("Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    };

    const experienceOptions = [
        { label: "Bad", value: "bad" },
        { label: "Good", value: "good" },
        { label: "Excellent", value: "excellent" },
    ];


    return (
        <div className="fixed inset-0 bg-[var(--rv-bg-black)]/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--rv-secondary-light)] relative bg-[var(--rv-bg-white)]`}
                >
                    <div className="bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-secondary-dark)] p-5 flex justify-between items-center text-[var(--rv-white)]">
                        <h2 className="text-lg font-semibold">Your Feedback Matters 💬</h2>
                        <button
                            onClick={onClose}
                            className="text-[var(--rv-white-dark)] hover:text-[var(--rv-white)] transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-[var(--rv-bg-white)]">
                        <div>
                            <label className="block mb-2 font-medium text-[var(--rv-black)]">
                                How was your experience?
                            </label>
                            <div className="flex justify-between gap-2">
                                {experienceOptions.map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => setForm({ ...form, experience: opt.value })}
                                        className={`flex-1 py-3 rounded-xl text-center font-medium transition-all border-2
                    ${form.experience === opt.value
                                                ? "bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-secondary-dark)] text-[var(--rv-white)] shadow-[0_3px_10px_rgba(0,0,0,0.3)]"
                                                : "bg-[var(--rv-secondary-light)] hover:bg-[var(--rv-secondary)] hover:text-[var(--rv-white)] text-[var(--rv-black)] border-[var(--rv-secondary)]"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-[var(--rv-primary-dark)]">
                                Rate us
                            </label>
                            <div className="flex justify-center gap-3 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        type="button"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setForm({ ...form, rating: star })}
                                        className={`relative p-2 rounded-full transition-all duration-200`}
                                    >
                                        <Star
                                            size={36}
                                            className={`transition-all duration-300 drop-shadow-md ${form.rating >= star
                                                ? "fill-[var(--rv-secondary)] stroke-[var(--rv-secondary-dark)]"
                                                : "fill-[var(--rv-secondary-light)] stroke-[var(--rv-secondary)]"
                                                }`}
                                        />
                                        {/* 3D Glow Effect */}
                                        {form.rating >= star && (
                                            <motion.span
                                                layoutId="glow"
                                                className="absolute inset-0 blur-md rounded-full bg-[var(--rv-secondary)] opacity-50 -z-10"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-[var(--rv-primary-dark)]">
                                What did you like most?
                            </label>
                            <div
                                className="relative border-2 border-[var(--rv-secondary)] bg-[var(--rv-secondary-light)] rounded-xl focus-within:border-[var(--rv-secondary-dark)]
                transition-all overflow-hidden"
                            >
                                <textarea
                                    rows="3"
                                    value={form.likedThings}
                                    placeholder="Tell us something that made your experience special..."
                                    onChange={(e) =>
                                        setForm({ ...form, likedThings: e.target.value })
                                    }
                                    className="w-full bg-transparent outline-none p-3 resize-none text-[var(--rv-black)] placeholder-[var(--rv-secondary)]"
                                />
                            </div>
                        </div>

                 
                        <div>
                            <Button
                                type="submit"
                                disabled={loading}
                                text={loading ? "Submitting..." : "Submit Feedback 🚀"}
                                className=" shadow-lg"
                            />
                        </div>

                        {message && (
                            <p
                                className={`text-center text-sm mt-3 font-medium ${message.includes("success")
                                    ? "text-[var(--rv-green-dark)]"
                                    : "text-[var(--rv-red)]"
                                    }`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

