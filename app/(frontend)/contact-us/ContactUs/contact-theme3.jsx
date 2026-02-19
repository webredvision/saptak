"use client";
import React, { useEffect, useState } from 'react'
import { FaMailBulk, FaMapPin, FaPhone, FaSpinner } from 'react-icons/fa'
import InnerPage from "@/app/components/InnerBanner/InnerPage"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Heading from '@/app/components/Heading/Heading';
import CaptchaRow from "@/app/components/Captcha/CaptchaRow";

const ContactTheme3 = ({ sitedata }) => {

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
      <text x="10" y="22" font-size="18" fill="#000" font-family="monospace">${text}</text>
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
            <div className="p-4 bg-[var(--rv-bg-white)]">
                <div className="max-w-7xl mx-auto main-section flex flex-col gap-5">
                    <div className="">
                        <Heading heading={'Get in Touch Now'} title={'Contact Us'} description={'Need personalized advice? Our dedicated team is here to assist you. Reach out today for expert support and tailored solutions to meet your needs.'} />
                    </div>
                    <div className="rounded-xl overflow-hidden md:rounded-3xl" >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:p-6 p-4 bg-[var(--rv-bg-secondary-light)] backdrop-blur-sm text-[var(--rv-black)]">
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex flex-col">
                                        <label className="mb-1  font-medium">Name</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Enter your name"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-md border bg-[var(--rv-bg-white-light)] outline-none border-[var(--rv-bg-primary)]"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1  font-medium">Phone</label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            placeholder="Enter your phone"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-md border bg-[var(--rv-bg-white-light)] outline-none border-[var(--rv-bg-primary)]"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1  font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-md border bg-[var(--rv-bg-white-light)] outline-none border-[var(--rv-bg-primary)]"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1  font-medium">Message</label>
                                    <textarea
                                        name="message"
                                        placeholder="Enter your message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-md border bg-[var(--rv-bg-white-light)] outline-none border-[var(--rv-bg-primary)] resize-none"
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
                                        className="bg-[var(--rv-bg-white-light)] border-[var(--rv-bg-primary)]"
                                        inputClassName="border-[var(--rv-bg-primary)] bg-[var(--rv-bg-white-light)] text-[var(--rv-black)]"
                                        buttonClassName="bg-[var(--rv-bg-gray-dark)] text-[var(--rv-white)]"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`w-full bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-secondary)] hover:to-[var(--rv-bg-primary)] hover:from-[var(--rv-secondary)] text-[var(--rv-white)] font-semibold py-4 rounded-xl  
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

                            <div className="flex flex-col gap-2">
                                <div className="md:p-5 p-3 rounded-xl overflow-hidden">
                                    <div className="w-12 h-12 bg-[var(--rv-bg-primary)] rounded-xl flex items-center justify-center mb-4 mx-auto">
                                        <FaMailBulk className="text-[var(--rv-white)]" size={25} />
                                    </div>
                                    <h5 className="text-center font-medium">Email Address</h5>
                                    <p className="text-center">
                                        <a
                                            href={`mailto:${sitedata?.email || "support@example.com"}`}
                                            className="hover:underline"
                                        >
                                            {sitedata?.email || "support@example.com"}
                                        </a>
                                    </p>
                                </div>
                                <div className="md:p-5 p-3 rounded-xl overflow-hidden">
                                    <div className="w-12 h-12 bg-[var(--rv-bg-primary)] rounded-xl flex items-center justify-center mb-4 mx-auto">
                                        <FaPhone className="text-[var(--rv-white)]" size={25} />
                                    </div>
                                    <h5 className="text-center font-medium">Phone Number</h5>
                                    <p className="text-center">
                                        <a
                                            href={`tel:${sitedata?.mobile || "+91xxxxxxxxxx"}`}
                                            className="hover:underline"
                                        >
                                            {sitedata?.mobile || "+91 xxxxxxxxxx"}
                                        </a>
                                    </p>
                                </div>
                                <div className="md:p-5 p-3 rounded-xl overflow-hidden">
                                    <div className="w-12 h-12 bg-[var(--rv-bg-primary)] rounded-xl flex items-center justify-center mb-4 mx-auto">
                                        <FaMapPin className="text-[var(--rv-white)]" size={25} />
                                    </div>
                                    <h5 className="text-center font-medium">Office Location</h5>
                                    <p className="text-center">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                sitedata?.address || "Mumbai, India"
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            {sitedata?.address || "Mumbai, India"}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-96">
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
    );
};

export default ContactTheme3;
