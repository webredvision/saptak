"use client";
import React, { useEffect, useState } from 'react'
import { FaMailBulk, FaPhone, FaSpinner } from 'react-icons/fa'
import { PiMapPinAreaBold } from "react-icons/pi";
import InnerPage from "@/app/components/InnerBanner/InnerPage"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Heading from '@/app/components/Heading/Heading';
import { BiPhoneCall } from 'react-icons/bi';
import CaptchaRow from "@/app/components/Captcha/CaptchaRow";

const ContactTheme5 = ({ sitedata }) => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobile: '',
        message: '',
        captcha: ''
    });

    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaImage, setCaptchaImage] = useState("");

    // ------------------ CAPTCHA LOGIC ------------------
    const generateCaptchaText = () =>
        Math.random().toString(36).substring(2, 8).toUpperCase();

    const createCaptchaSVG = (text) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="34" width="80">
      <rect width="100%" height="100%" fill="#f8d7c3"/>
      <text x="10" y="22" font-size="18" fill="#a30a00" font-family="monospace">${text}</text>
    </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    const refreshCaptcha = () => {
        const newCode = generateCaptchaText();
        setCaptcha(newCode);
        setCaptchaImage(createCaptchaSVG(newCode));
        setFormData((p) => ({ ...p, captcha: "" }));
    };

    useEffect(() => {
        refreshCaptcha();
    }, []);

    // ------------------ HANDLE INPUTS ------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // ------------------ VALIDATION ------------------
    const validate = () => {
        if (!formData.username.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!formData.mobile.trim()) {
            toast.error("Phone number is required");
            return false;
        }

        if (!/^\d{10}$/.test(formData.mobile.trim())) {
            toast.error("Phone number must be 10 digits");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            toast.error("Invalid email format");
            return false;
        }

        if (!formData.message.trim()) {
            toast.error("Message is required");
            return false;
        }

        if (formData.message.trim().length < 5) {
            toast.error("Message must be at least 5 characters");
            return false;
        }

        if (!formData.captcha.trim()) {
            toast.error("Captcha is required");
            return false;
        }

        if (formData.captcha.trim().toUpperCase() !== captcha.trim().toUpperCase()) {
            toast.error("Captcha does not match");
            refreshCaptcha();
            return false;
        }

        return true;
    };

    // ------------------ SUBMIT FORM ------------------
    const handleSubmit = async () => {

        if (!validate()) return;

        setLoading(true);

        const emailContent = "We’re excited to help you reach your financial goals.";

        const emailData = {
            to: formData.email,
            subject: "Thank You for Your Enquiry!",
            text: `Dear ${formData.username},\n\nWe appreciate your interest. Our team will contact you soon.\n\n${emailContent}`,
        };

        const notifyAdmin = {
            to: sitedata?.email,
            subject: "New Enquiry Received",
            text: `New Enquiry:\n\nName: ${formData.username}\nEmail: ${formData.email}\nMobile: ${formData.mobile}\nMessage: ${formData.message}`,
        };

        try {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/leads`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (res.status === 201) {
                toast.success("Your message has been sent!");

                await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(emailData),
                });

                await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(notifyAdmin),
                });

                setFormData({
                    username: "",
                    email: "",
                    mobile: "",
                    message: "",
                    captcha: "",
                });
                refreshCaptcha();
            } else {
                toast.error("Submission failed!");
            }

        } catch (error) {
            toast.error("Something went wrong!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <InnerPage title={'Contact Us'} />
            <ToastContainer />
            <div className="px-4 bg-[var(--rv-bg-white)]">
                <div className="max-w-7xl mx-auto main-section flex flex-col gap-10 md:gap-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[var(--rv-bg-white)] rounded-xl overflow-hidden border">
                        <div className="flex flex-col gap-10 md:p-7 lg:p-10 border p-5">
                            <div className="flex flex-col gap-3">
                                <PiMapPinAreaBold className="text-[var(--rv-primary)]" size={44} />
                                <h5>Office Location</h5>
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    sitedata?.address || "Mumbai, India"
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold hover:underline"
                            >
                                {sitedata?.address || "Mumbai, India"}
                            </a>
                        </div>
                        <div className="flex flex-col gap-10 md:p-7 lg:p-10 border p-5">
                            <div className="flex flex-col gap-3">
                                <FaMailBulk className="text-[var(--rv-primary)]" size={44} />
                                <h5>Email Address</h5>
                            </div>
                            <a
                                href={`mailto:${sitedata?.email || "support@example.com"}`}
                                className="font-semibold hover:underline"
                            >
                                {sitedata?.email || "support@example.com"}
                            </a>
                        </div>
                        <div className="flex flex-col gap-10 md:p-7 lg:p-10 border p-5">
                            <div className="flex flex-col gap-3">
                                <BiPhoneCall className="text-[var(--rv-primary)]" size={44} />
                                <h5>Phone Number</h5>
                            </div>
                            <a
                                href={`tel:${sitedata?.mobile || "+91xxxxxxxxxx"}`}
                                className="font-semibold hover:underline"
                            >
                                {sitedata?.mobile || "+91 xxxxxxxxxx"}
                            </a>
                        </div>

                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="">
                            <Heading
                                align='start'
                                title={"Start a Conversation"}
                                heading={" Get in Touch Now"}
                                description={"Need personalized advice? Our dedicated team is here to assist you. Reach out today for expert support and tailored solutions to meet your needs."}
                            />
                        </div>

                        <div className="flex flex-col gap-5 lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Full Name"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full placeholder:text-[var(--rv-black)] font-medium py-3 border-b outline-none bg-[var(--rv-bg-white)] border-[var(--rv-bg-primary)]"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="mobile"
                                        placeholder="Enter your phone"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full placeholder:text-[var(--rv-black)] font-medium py-3 border-b outline-none bg-[var(--rv-bg-white)] border-[var(--rv-bg-primary)]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full placeholder:text-[var(--rv-black)] font-medium py-3 border-b outline-none bg-[var(--rv-bg-white)] border-[var(--rv-bg-primary)]"
                                />
                            </div>

                            <div className="flex flex-col">
                                <textarea
                                    name="message"
                                    placeholder="Enter your message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full placeholder:text-[var(--rv-black)] font-medium py-3 border-b outline-none bg-[var(--rv-bg-white)] border-[var(--rv-bg-primary)] resize-none"
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className=" font-medium">Captcha</label>
                                <CaptchaRow
                                    imageSrc={captchaImage}
                                    onRefresh={refreshCaptcha}
                                    value={formData.captcha}
                                    onChange={handleChange}
                                    name="captcha"
                                    placeholder="Enter captcha"
                                    className="bg-[var(--rv-bg-white)] border-[var(--rv-bg-primary)]"
                                    inputClassName="border-[var(--rv-bg-primary)] bg-[var(--rv-bg-white)] text-[var(--rv-black)]"
                                    buttonClassName="bg-[var(--rv-bg-gray-dark)] text-[var(--rv-white)]"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] font-semibold py-4 rounded-xl  
                                        ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <div className="flex gap-2 items-center justify-center">
                                        <FaSpinner className="animate-spin" /> Sending...
                                    </div>
                                ) : (
                                    "Submit Now"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-[500px]">
                        <iframe
                            src={sitedata?.iframe}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Office Location Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactTheme5;
