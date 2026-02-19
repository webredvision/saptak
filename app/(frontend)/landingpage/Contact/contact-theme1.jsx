"use client";
import React, { useEffect, useState } from "react";
import { BiMailSend, BiPhone } from "react-icons/bi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";
import Button from "@/app/components/Button/Button";
import CaptchaRow from "@/app/components/Captcha/CaptchaRow";

const ContactTheme1 = ({ sitedata }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    message: "",
    captcha: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // similar to lower code

  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");

  const generateCaptchaText = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const createCaptchaSVG = (text) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="35" width="115">
      <rect width="100%" height="100%" fill="#f0f4ff"/>
      <text x="15" y="24" font-size="20" fill="#1B2452" font-family="Arial, sans-serif" font-weight="bold">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const refreshCaptcha = () => {
    const t = generateCaptchaText();
    setCaptcha(t);
    setCaptchaImage(createCaptchaSVG(t));
    setFormData((p) => ({ ...p, captcha: "" }));
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (formData.captcha.toUpperCase() !== captcha.toUpperCase()) {
      toast.error("Captcha does not match!");
      refreshCaptcha();
      return;
    }

    setLoading(true);

    // email text same style as second component
    const emailContent =
      "We’re excited to help you reach your financial goals.";

    const emailData = {
      to: formData.email,
      subject: "Thank You for Your Enquiry!",
      text: `Dear ${formData.username},\n\nWe appreciate your interest. Our team will contact you soon.\n\n${emailContent}`,
    };

    const notifyAdmin = {
      to: sitedata?.email,
      subject: "New Enquiry Received",
      text: `New Enquiry:\n\nName: ${formData.username}\nEmail: ${formData.email}\nMobile: ${formData.phone}\nMessage: ${formData.message}`,
    };

    const leadPayload = {
      username: formData.username,
      email: formData.email,
      mobile: formData.phone, // map phone   mobile for backend
      message: formData.message,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload),
        }
      );

      if (res.status === 201) {
        toast.success("Your message has been sent!");

        // send email to user
        await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailData),
        });

        // notify admin
        await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notifyAdmin),
        });

        setSubmitted(true);
        setFormData({
          username: "",
          email: "",
          phone: "",
          message: "",
          captcha: "",
        });
        refreshCaptcha();
      } else {
        toast.error("Submission failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <BiMailSend className="w-6 h-6 " />,
      title: "Email",
      value: sitedata?.email,
      grid: "col-span-1",
    },
    {
      icon: <BiPhone className="w-6 h-6 " />,
      title: "Mobile No.",
      value: sitedata?.mobile,
      grid: "col-span-1",
    },
    {
      icon: <HiOutlineOfficeBuilding className="w-6 h-6 " />,
      title: "Address",
      value: sitedata?.address,
      grid: "sm:col-span-2",
    },
  ];

  return (
    <>
      <ToastContainer />
      <motion.section
        className="bg-[var(--rv-bg-white)] px-4 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto main-section flex flex-col items-center gap-5 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <Heading
            title={'contact us'}
              heading={" Get in Touch"}
              description={
                "We love to hear from you. Send us a message and well respond as soon as possible."
              }
            />
          </motion.div>

          <div className="max-w-5xl mx-auto w-full">

            <motion.form
              onSubmit={handleSubmit}
              className="rounded-xl border border-[var(--rv-black-light)] bg-[var(--rv-bg-white)] transition p-5"
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-3">
                <label className="block font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="username"
                  className="w-full border p-3 rounded-md border-[var(--rv-black-light)] focus:outline-none focus:ring-1 focus:ring-[var(--rv-primary)] transition bg-transparent"
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="text-[var(--rv-red)] text-sm mt-2">{errors.username}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border p-3 rounded-md border-[var(--rv-black-light)] focus:outline-none focus:ring-1 focus:ring-[var(--rv-primary)] transition bg-transparent"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-[var(--rv-red)] text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  maxLength="10"
                  className="w-full border p-3 rounded-md border-[var(--rv-black-light)] focus:outline-none focus:ring-1 focus:ring-[var(--rv-primary)] transition bg-transparent"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-[var(--rv-red)] text-sm mt-2">{errors.phone}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  className="w-full border p-3 rounded-md border-[var(--rv-black-light)] focus:outline-none focus:ring-1 focus:ring-[var(--rv-primary)] transition bg-transparent resize-none"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && (
                  <p className="text-[var(--rv-red)] text-sm mt-2">{errors.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">
                  Security Verification
                </label>
                <CaptchaRow
                  imageSrc={captchaImage}
                  onRefresh={refreshCaptcha}
                  value={formData.captcha}
                  onChange={handleChange}
                  name="captcha"
                  placeholder="Enter the code above"
                  className="bg-[var(--rv-bg-white)] border-[var(--rv-gray)]"
                  inputClassName="border-[var(--rv-gray)] bg-[var(--rv-bg-white)] text-[var(--rv-black)]"
                  buttonClassName="bg-[var(--rv-primary)] text-[var(--rv-white)] hover:brightness-110"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className={`flex items-center justify-center gap-2 ${loading
                    ? "opacity-70 cursor-not-allowed hover:scale-100"
                    : ""
                  }`}
                text={loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              >

              </Button>
            </motion.form>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default ContactTheme1;
