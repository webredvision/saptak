"use client";

import React, { useEffect, useState } from "react";
import { MdPhoneInTalk } from "react-icons/md";
import { IoIosMailOpen } from "react-icons/io";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CaptchaRow from "@/app/components/Captcha/CaptchaRow";


const ContactTheme3 = ({ sitedata = {} }) => {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    message: "",
    captcha: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");

  const generateCaptchaText = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const createCaptchaSVG = (text) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="36" width="90">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="10" y="24" font-size="20" fill="#111827" font-family="monospace" font-weight="600">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${typeof window !== "undefined" ? btoa(svg) : ""}`;
  };

  const refreshCaptcha = () => {
    const newC = generateCaptchaText();
    setCaptcha(newC);
    setCaptchaImage(createCaptchaSVG(newC));
    setFormData((p) => ({ ...p, captcha: "" }));
    setErrors((e) => ({ ...e, captcha: undefined }));
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, mobile: numericValue }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (formData.mobile.length !== 10) newErrors.mobile = "Mobile must be 10 digits";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.captcha.trim()) newErrors.captcha = "Captcha is required";
    else if (formData.captcha.toUpperCase() !== captcha.toUpperCase())
      newErrors.captcha = "Captcha does not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const leadData = {
      username: formData.username,
      email: formData.email,
      mobile: formData.mobile,
      message: formData.message,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || ""}/api/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        }
      );

      if (res.ok || res.status === 201) {
        toast.success("Your message has been sent!");

        fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL || ""}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            subject: "Thanks for contacting Saptak ",
            text: `Dear ${formData.username},\n\nThanks for reaching out. We've received your message and will get back to you shortly.\n\n— Saptak  Team`,
          }),
        }).catch((e) => console.warn("email-to-user failed", e));
        fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL || ""}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: sitedata?.email,
            subject: "New contact enquiry",
            text: `New enquiry from ${formData.username}\nEmail: ${formData.email}\nMobile: ${formData.mobile}\n\nMessage:\n${formData.message}`,
          }),
        }).catch((e) => console.warn("email-to-site failed", e));

        setFormData({ username: "", mobile: "", email: "", message: "", captcha: "" });
        refreshCaptcha();
      } else {
        const txt = await res.text().catch(() => "");
        toast.error("Submission failed: " + (txt || res.statusText));
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[var(--rv-bg-white)] px-4">
      <ToastContainer position="top-right" />
      <div className="max-w-7xl mx-auto main-section grid md:grid-cols-3 grid-cols-1 gap-5 md:gap-8 lg:gap-10 items-start">
        <div className="flex flex-col gap-5 md:gap-8 md:col-span-2">
          <Heading
            title={"Contact Saptak "}
            align="start"
            heading={"Let’s build your financial plan"}
            description={
              "Get expert guidance on investments, risk management, and tax planning—tailored to your goals."
            }
          />

          <div className="relative rounded-xl overflow-hidden flex flex-col gap-4 shadow-lg bg-[var(--rv-bg-white)]">
            <form
              className="space-y-4"
              onSubmit={(e) => handleSubmit(e)}
              noValidate
            >
              <div>
                <label className="block font-medium mb-1">Full Name</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-[var(--rv-gray)] rounded-lg px-3 py-2 bg-transparent text-[var(--rv-primary)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--rv-bg-primary)] transition"
                />
                {errors.username && <p className="text-[var(--rv-red)] text-sm mt-1">{errors.username}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Email Address</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full border border-[var(--rv-gray)] rounded-lg px-3 py-2 bg-transparent text-[var(--rv-primary)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--rv-bg-primary)] transition"
                  />
                  {errors.email && <p className="text-[var(--rv-red)] text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block font-medium mb-1">Mobile Number</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    type="tel"
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    className="w-full border border-[var(--rv-gray)] rounded-lg px-3 py-2 bg-transparent text-[var(--rv-primary)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--rv-bg-primary)] transition"
                  />
                  {errors.mobile && <p className="text-[var(--rv-red)] text-sm mt-1">{errors.mobile}</p>}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your financial goals..."
                  rows="4"
                  className="w-full border border-[var(--rv-gray)] rounded-lg px-3 py-2 bg-transparent text-[var(--rv-primary)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--rv-bg-primary)] transition"
                />
                {errors.message && <p className="text-[var(--rv-red)] text-sm mt-1">{errors.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <CaptchaRow
                  imageSrc={captchaImage}
                  onRefresh={refreshCaptcha}
                  value={formData.captcha}
                  onChange={handleChange}
                  name="captcha"
                  placeholder="Enter Captcha"
                  className="bg-transparent border-[var(--rv-gray)]"
                  inputClassName="border-[var(--rv-gray)] bg-transparent text-[var(--rv-primary)] placeholder:text-gray-400"
                  buttonClassName="bg-[var(--rv-primary)] text-[var(--rv-white)]"
                />
                {errors.captcha && (
                  <p className="text-[var(--rv-red)] text-sm mt-1">{errors.captcha}</p>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-[var(--rv-white)] font-semibold py-3 rounded-lg bg-[var(--rv-bg-primary)] transition flex items-center justify-center gap-3 ${loading ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="w-full h-80 relative z-10 bg-[var(--rv-bg-secondary)] rounded-xl overflow-hidden">
            <img src="/images/contact.png" className="w-full h-full object-contain bg-left" alt="" />
            <div className="absolute top-0 right-0 -z-10">
              <img src="/images/hero-info-item-bg.png" alt="" />
            </div>
            <div className="absolute bottom-0 left-0 -z-10 rotate-180">
              <img src="/images/hero-info-item-bg.png" alt="" />
            </div>
          </div>
          <div className="grid grid-cols-1 w-full gap-8">
            <div className="flex items-center gap-2 md:gap-4 text-[var(--rv-primary)]">
              <div className="w-12 h-12 rounded-full bg-[var(--rv-bg-primary-light)] flex items-center justify-center">
                <IoIosMailOpen className="text-2xl" />
              </div>
              <div>
                <p className="uppercase">Email</p>
                <a
                  href={`mailto:${sitedata?.email || "support@example.com"}`}
                  className="hover:underline"
                >
                  {sitedata?.email || "support@example.com"}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-[var(--rv-primary)]">
              <div className="w-12 h-12 rounded-full bg-[var(--rv-bg-primary-light)] flex items-center justify-center">
                <MdPhoneInTalk className="text-2xl" />
              </div>
              <div>
                <p className="uppercase">Phone</p>
                <a
                  href={`tel:${sitedata?.mobile || "+91xxxxxxxxxx"}`}
                  className="hover:underline"
                >
                  {sitedata?.mobile || "+91 xxxxxxxxxx"}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-[var(--rv-primary)]">
              <div className="w-12 h-12 rounded-full bg-[var(--rv-bg-primary-light)] flex items-center justify-center">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <div>
                <p className="uppercase">Office Address</p>
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
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactTheme3;
