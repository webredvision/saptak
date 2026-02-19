"use client";

import React, { useState } from "react";
import axios from "axios";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

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

const GoalQuestionsTheme4 = () => {
    const router = useRouter();
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

        if (loading) return;

        if (formData.number.length !== 10) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return;
        }

        try {
            setLoading(true);

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

                router.push("/thankyou");
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
            <section className="relative w-full bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] px-4 overflow-hidden">
                <div className="main-section border-b border-[var(--rv-white-light)]">
                    <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 ">
                        <div className="border border-[var(--rv-border)] w-full rounded-xl overflow-hidden text-[var(--rv-white)] p-4 flex flex-col gap-5 items-start">
                            <Heading
                                align="start"
                                title="Goal Planning Questions"
                                heading="Invest with Purpose"
                                variant="light"
                                description="Turn your life goals into a clear, goal-driven investment plan."
                            />

                            <p className="leading-relaxed">
                                Your goals deserve more than guesswork. Let’s build a plan that fits you.
                                Just answer a few simple questions — what you’re investing for, how much you can set aside each month, and when you want to reach your goal. In less than a minute, we’ll create a custom mutual fund plan tailored to your needs.
                                We’ll send your personalized plan directly to your WhatsApp or email. It’s fast, free, and built to help you take the next step with confidence.
                            </p>

                            <ul className="list-disc text-[var(--rv-white)] grid grid-cols-1 gap-2">
                                <div className='flex items-center gap-2'><p className="text-[var(--rv-primary)]">◈</p>Choose your financial goal</div>
                                <div className='flex items-center gap-2'><p className="text-[var(--rv-primary)]">◈</p>Answer a few simple questions</div>
                                <div className='flex items-center gap-2'><p className="text-[var(--rv-primary)]">◈</p>Receive a personalized plan by email</div>
                            </ul>
                            <Button text={'Explore More'} link="/login" />
                        </div>

                        <div className="relative border border-[var(--rv-border)] w-full rounded-xl overflow-hidden text-[var(--rv-white)] p-4 flex flex-col gap-3 transition-all z-10  bg-[var(--rv-bg-secondary)]">

                            {step === 1 && (
                                <div className="flex flex-col gap-3">
                                    <h6 className="font-semibold">
                                        What are you investing for?
                                    </h6>

                                    <div className="grid gap-5">
                                        {goalOptions.map((item) => (
                                            <label
                                                key={item.id}
                                                className={`cursor-pointer rounded-full pl-5 p-2 transition-all flex gap-3 border   ${selectedValue === item.value
                                                    ? "bg-[var(--rv-bg-primary)] shadow-lg border-[var(--rv-border)]"
                                                    : "bg-[var(--rv-bg-secondary)] border-[var(--rv-border)]"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="goal"
                                                    value={item.value}
                                                    checked={selectedValue === item.value}
                                                    onChange={(e) => {
                                                        setSelectedValue(e.target.value);
                                                        setAnswers({});
                                                    }}
                                                    className={` ${selectedValue === item.value
                                                        ? "accent-[var(--rv-secondary)]"
                                                        : "accent-[var(--rv-secondary)]"
                                                        }`}
                                                />
                                                <div>
                                                    <p className={`${selectedValue === item.value
                                                        ? "text-[var(--rv-white)] font-semibold"
                                                        : "text-[var(--rv-white)]"
                                                        }`}>{item.value}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            text="Continue"
                                            disabled={!selectedValue}
                                            onClick={() => {
                                                setStep(2);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {step === 2 && selectedValue && (
                                <div className="space-y-4 h-fit">
                                    <h6 className="font-semibold">
                                        {selectedValue} – Quick Questions
                                    </h6>

                                    <div className="space-y-3">
                                        {goalQuestions[selectedValue].map((q) => (
                                            <div key={q.id} className="space-y-1">
                                                <label className="">
                                                    {q.question}
                                                </label>
                                                <input
                                                    type={q.type}
                                                    value={answers[q.id] || ""}
                                                    onChange={(e) =>
                                                        handleAnswerChange(q.id, e.target.value)
                                                    }
                                                    className="w-full rounded-lg px-3 py-2 border border-[var(--rv-primary)] bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between">
                                        <Button
                                            text="Back"
                                            onClick={() => {
                                                setAnswers({});
                                                setStep(1);
                                            }}
                                        />

                                        <Button
                                            text="Continue"
                                            disabled={!allAnswered}
                                            onClick={() => {
                                                if (!allAnswered) {
                                                    toast.error("Please answer all questions.");
                                                    return;
                                                }
                                                setShowPopup(true);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {showPopup && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                        <div className="bg-[var(--rv-black)] text-[var(--rv-white)] rounded-2xl w-full max-w-md p-6 space-y-4">
                            <div className='flex items-center gap-3 justify-between'>
                                <h4 className="text-lg font-semibold">
                                    Get Your Personalized Plan
                                </h4>
                                <MdClose onClick={() => setShowPopup(false)} className="text-2xl text-[var(--rv-red)] cursor-pointer" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => handleFormChange("name", e.target.value)}
                                    required
                                    className="w-full rounded-lg px-3 py-2 bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => handleFormChange("email", e.target.value)}
                                    required
                                    className="w-full rounded-lg px-3 py-2 bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] outline-none"
                                />
                                <input
                                    placeholder="Phone Number"
                                    value={formData.number}
                                    onChange={(e) => handleFormChange("number", e.target.value)}
                                    required
                                    className="w-full rounded-lg px-3 py-2 bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] outline-none"
                                />
                                <textarea
                                    placeholder="Optional message"
                                    value={formData.message}
                                    onChange={(e) => handleFormChange("message", e.target.value)}
                                    className="w-full rounded-lg px-3 py-2 bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] outline-none h-24"
                                />

                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        text={
                                            loading ? (
                                                <>
                                                    <FaSpinner className="animate-spin" /> Sending
                                                </>
                                            ) : (
                                                "Submit"
                                            )
                                        }
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

export default GoalQuestionsTheme4;
