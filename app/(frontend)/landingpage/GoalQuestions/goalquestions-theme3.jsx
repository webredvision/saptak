"use client";

import React, { useState } from "react";
import axios from "axios";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const goalQuestions = {
    Retirement: [
        { id: "q1", question: "At what age do you plan to retire?", type: "number" },
        { id: "q2", question: "What is your current monthly expense?", type: "number" },
        {
            id: "q3",
            question: "How much can you save monthly towards retirement?",
            type: "number",
        },
    ],
    "Child's Education": [
        {
            id: "q1",
            question:
                "How many years are left until your child starts higher education?",
            type: "number",
        },
        {
            id: "q2",
            question: "What is your estimated cost of education in today’s value?",
            type: "number",
        },
        {
            id: "q3",
            question: "How much have you already saved for this goal?",
            type: "number",
        },
    ],
    "Marriage Planning": [
        {
            id: "q1",
            question: "In how many years do you expect the wedding to take place?",
            type: "number",
        },
        {
            id: "q2",
            question: "What is your estimated wedding budget in today’s value?",
            type: "number",
        },
        {
            id: "q3",
            question: "How much can you save each month for this goal?",
            type: "number",
        },
    ],
    "House Planning": [
        {
            id: "q1",
            question: "When do you plan to buy your house? (in years)",
            type: "number",
        },
        {
            id: "q2",
            question: "What is the estimated cost of the house today?",
            type: "number",
        },
        {
            id: "q3",
            question: "How much have you saved for the down payment?",
            type: "number",
        },
    ],
    "Vacation Planning": [
        {
            id: "q1",
            question: "When do you plan to go on your vacation? (in years)",
            type: "number",
        },
        {
            id: "q2",
            question: "What is your estimated total vacation cost?",
            type: "number",
        },
        {
            id: "q3",
            question: "How much can you save monthly for it?",
            type: "number",
        },
    ],
    "Career Planning": [
        {
            id: "q1",
            question:
                "In how many years do you plan to switch careers or start a new course?",
            type: "number",
        },
        {
            id: "q2",
            question: "What is the estimated cost of training/education?",
            type: "number",
        },
        {
            id: "q3",
            question: "How much can you set aside monthly for this goal?",
            type: "number",
        },
    ],
    "Wealth Creation": [
        {
            id: "q1",
            question: "What is your target wealth amount in today’s value?",
            type: "number",
        },
        {
            id: "q2",
            question: "In how many years do you want to achieve it?",
            type: "number",
        },
        {
            id: "q3",
            question: "How much can you invest each month for this goal?",
            type: "number",
        },
    ],
};

const goalOptions = [
    { id: "wuif1", value: "Retirement", label: "Build a secure future" },
    {
        id: "wuif2",
        value: "Child's Education",
        label: "Save for child’s studies",
    },
    {
        id: "wuif3",
        value: "Marriage Planning",
        label: "Plan for wedding expenses",
    },
    { id: "wuif4", value: "House Planning", label: "Plan for dream home" },
    {
        id: "wuif5",
        value: "Vacation Planning",
        label: "Plan for travel and leisure",
    },
    {
        id: "wuif6",
        value: "Career Planning",
        label: "Invest in your career growth",
    },
    { id: "wuif7", value: "Wealth Creation", label: "Grow money over time" },
];

const GoalQuestionsTheme3 = () => {
    const [step, setStep] = useState(1);
    const [selectedValue, setSelectedValue] = useState("");
    const [answers, setAnswers] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        message: "",
    });

    const handleAnswerChange = (qid, value) => {
        setAnswers((prev) => ({ ...prev, [qid]: value }));
    };

    const handleFormChange = (field, value) => {
        if (field === "number") {
            if (!/^\d{0,10}$/.test(value)) return;
        }
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const allAnswered =
        selectedValue &&
        goalQuestions[selectedValue]?.every((q) => {
            const v = answers[q.id];
            return v !== undefined && v !== null && v.toString().trim() !== "";
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return; // avoid double submit

        if (formData.number.length !== 10) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return;
        }

        try {
            setLoading(true); // 🔁 start loading

            const payload = {
                username: formData.name,
                mobile: formData.number,
                email: formData.email,
                address: "N/A",
                message: `
Goal: ${selectedValue}
Answers:
${Object.entries(answers)
                        .map(
                            ([key, value]) =>
                                `${goalQuestions[selectedValue]?.find((q) => q.id === key)?.question ||
                                "Question"
                                }: ${value}`
                        )
                        .join("\n")}
User Message: ${formData.message || "N/A"}
`,
            };

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/leads`,
                payload
            );

            if (res.status === 201) {
                const siteName =
                    process.env.NEXT_PUBLIC_SITE_NAME || "Our Investment Platform";
                const siteEmail =
                    process.env.NEXT_PUBLIC_SITE_EMAIL || "support@example.com";

                const formattedAnswers = Object.entries(answers)
                    .map(
                        ([key, value]) =>
                            `${goalQuestions[selectedValue]?.find((q) => q.id === key)
                                ?.question || "Question"
                            }: ${value}`
                    )
                    .join("\n");

                const emailIntro =
                    "We’re excited to help you reach your financial goals.";

                const userEmailData = {
                    to: formData.email,
                    subject: `Thank You for Your Enquiry - ${selectedValue}`,
                    text: `Dear ${formData.name},\n\nThank you for your interest in planning for "${selectedValue}".\n\nHere are your responses:\n${formattedAnswers}\n\n${emailIntro}\n\nBest Regards,\n${siteName}`,
                };

                const adminEmailData = {
                    to: siteEmail,
                    subject: `New Enquiry Received - ${selectedValue}`,
                    text: `A new enquiry has been received.\n\nGoal: ${selectedValue}\n\nAnswers:\n${formattedAnswers}\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.number}\nMessage: ${formData.message}\n\n${emailIntro}`,
                };

                await axios.post(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`,
                    userEmailData
                );
                await axios.post(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`,
                    adminEmailData
                );

                toast.success(
                    "Your enquiry has been submitted. We'll email your plan and contact you soon."
                );
                setStep(1);
                setSelectedValue("");
                setAnswers({});
                setFormData({ name: "", email: "", number: "", message: "" });
                setShowPopup(false);
            }
        } catch (error) {
            console.error("Error submitting lead:", error);
            toast.error("Submission failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <section className="w-full bg-[var(--rv-bg-white)] px-4">
                <div className="max-w-7xl mx-auto main-section">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-4">
                            <Heading
                                title={'goal questions'}
                                align="start"
                                heading="Invest with Purpose"
                                description="Know exactly where to start—turn your life goals into a clear, actionable investment plan."
                            />
                            <p className="">
                                Not sure which funds are right for your goals? You&apos;re not
                                alone—and that&apos;s exactly why we&apos;re here. Whether
                                you&apos;re planning for retirement, saving for your child&apos;s
                                education, or simply making your money work smarter, the first
                                step is having a clear, personalized plan.
                            </p>

                            <p className="">
                                Take a quick, goal-based quiz designed by investment experts to
                                understand your needs, preferences, and risk profile. We&apos;ll
                                email you a mutual fund plan that matches your goal.
                            </p>

                            <ul className="flex flex-col gap-2 text-[var(--rv-primary-dark)]">
                                <li className="px-5 py-2 bg-[var(--rv-bg-primary-light)] rounded-lg w-fit">✓ Tell us your goal</li>
                                <li className="px-5 py-2 bg-[var(--rv-bg-primary-light)] rounded-lg w-fit">✓ Answer a few simple questions</li>
                                <li className="px-5 py-2 bg-[var(--rv-bg-primary-light)] rounded-lg w-fit">✓ Get your goal-driven plan—delivered directly to you</li>
                            </ul>
                        </div>

                        <div className="w-full">
                            <div className="text-[var(--rv-black)] border border-[var(--rv-black-light)] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
                                {step === 1 && (
                                    <div className="space-y-5">
                                        <h3 className="text-lg sm:text-xl font-semibold text-[var(--rv-primary)]">
                                            What are you investing for?
                                        </h3>

                                        <div className="flex flex-col gap-3">
                                            {goalOptions.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => setSelectedValue(item.value)}
                                                    className={`cursor-pointer rounded-lg border p-2 flex items-center gap-4 transition-all duration-300
                                                              ${selectedValue === item.value
                                                            ? "border-[var(--rv-primary)] bg-[var(--rv-bg-primary)]"
                                                            : "border-[var(--rv-black-light)] "
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-8 h-8 rounded-md flex items-center justify-center font-bold
                                                                 ${selectedValue === item.value
                                                                ? "bg-[var(--rv-bg-secondary] text-[var(--rv-white)]"
                                                                : "text-[var(--rv-primary)] border border-[var(--rv-primary)]"
                                                            }`}
                                                    >
                                                        ✓
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold ${selectedValue === item.value ? "text-[var(--rv-white)] " : "text-[var(--rv-black)]"}`}>
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-3 flex justify-end">
                                            <Button
                                                text="Next"
                                                type="button"
                                                disabled={!selectedValue}
                                                onClick={() => {
                                                    if (!selectedValue) {
                                                        toast.error("Please select what you are investing for first.");
                                                        return;
                                                    }
                                                    setStep(2);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}


                                {step === 2 && selectedValue && (
                                    <div className="space-y-4 mt-2">
                                        <h3 className="text-lg sm:text-xl font-semibold">
                                            {selectedValue} – Quick Questions
                                        </h3>
                                        <div className="space-y-3">
                                            {goalQuestions[selectedValue].map((q) => (
                                                <div key={q.id} className="space-y-1">
                                                    <label className="font-medium">{q.question}</label>
                                                    <input
                                                        type={q.type}
                                                        value={answers[q.id] || ""}
                                                        onChange={(e) =>
                                                            handleAnswerChange(q.id, e.target.value)
                                                        }
                                                        className="w-full rounded-lg px-3 py-2 text-[var(--rv-primary)] outline-none border focus:border-[var(--rv-secondary)]"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-2 flex items-center justify-between gap-3">
                                            <Button
                                                text="Back"
                                                type="button"
                                                onClick={() => {
                                                    setAnswers({});
                                                    setStep(1);
                                                }}
                                                className="flex items-center gap-2 bg-[var(--rv-bg-white-light)] border border-[var(--rv-white)] text-[var(--rv-white)] hover:bg-[var(--rv-bg-white-light)]"
                                            />

                                            <Button
                                                text="Next"
                                                type="button"
                                                disabled={!allAnswered}
                                                onClick={() => {
                                                    if (!allAnswered) {
                                                        toast.error(
                                                            "Please answer all questions before continuing."
                                                        );
                                                        return;
                                                    }
                                                    setShowPopup(true);
                                                }}
                                                className={`flex items-center gap-2 bg-[var(--rv-bg-white)] text-[var(--rv-primary)] hover:bg-[var(--rv-secondary)] hover:text-[var(--rv-white)] ${!allAnswered ? "opacity-60 cursor-not-allowed" : ""
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                        <div className="bg-[var(--rv-bg-white)] rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                            <h6 className="font-semibold text-[var(--rv-primary)]">
                                Share your details to receive your plan
                            </h6>
                            <p className="text-[var(--rv-primary)]">
                                We&apos;ll email you a personalized mutual fund plan based on
                                your answers.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => handleFormChange("name", e.target.value)}
                                    required
                                    className="w-full border rounded-md p-2 focus:outline-none border-[var(--rv-gray-light)] text-[var(--rv-primary)] ring-1 focus:ring-[var(--rv-primary)]"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => handleFormChange("email", e.target.value)}
                                    required
                                    className="w-full border rounded-md p-2 focus:outline-none border-[var(--rv-gray-light)] text-[var(--rv-primary)] ring-1 focus:ring-[var(--rv-primary)]"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={formData.number}
                                    onChange={(e) => handleFormChange("number", e.target.value)}
                                    required
                                    className="w-full border rounded-md p-2 focus:outline-none border-[var(--rv-gray-light)] text-[var(--rv-primary)] ring-1 focus:ring-[var(--rv-primary)]"
                                />
                                <textarea
                                    placeholder="Anything else you'd like us to know? (optional)"
                                    value={formData.message}
                                    onChange={(e) => handleFormChange("message", e.target.value)}
                                    className="w-full border rounded-md p-2 h-24 text-sm resize-none focus:outline-none border-[var(--rv-gray-light)] text-[var(--rv-primary)] ring-1 focus:ring-[var(--rv-primary)]"
                                />

                                <div className="mt-4 flex gap-3 justify-end">
                                    <Button
                                        text="Cancel"
                                        type="button"
                                        onClick={() => {
                                            if (loading) return;
                                            setShowPopup(false);
                                            setFormData({
                                                name: "",
                                                email: "",
                                                number: "",
                                                message: "",
                                            });
                                        }}
                                        className={`bg-[var(--rv-bg-gray-light)] text-[var(--rv-gray-dark)] hover:bg-[var(--rv-bg-gray)] ${loading ? "opacity-60 cursor-not-allowed" : ""
                                            }`}
                                        disabled={loading}
                                    />
                                    <Button
                                        type={"submit"}
                                        disabled={loading}
                                        className={`bg-[var(--rv-primary)] text-[var(--rv-white)] hover:bg-[var(--rv-secondary)] inline-flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                        text={loading ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Sending...
                                            </>
                                        ) : (
                                            "Submit"
                                        )}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default GoalQuestionsTheme3;
