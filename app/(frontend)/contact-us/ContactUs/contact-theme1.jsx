"use client";
import React, { useEffect, useState } from "react";
import { FaMailBulk, FaPhone, FaSpinner } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";
import CaptchaRow from "@/app/components/Captcha/CaptchaRow";


const ContactTheme1 = ({ sitedata }) => {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    message: "",
    captcha: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");

  const generateCaptchaText = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const createCaptchaSVG = (text) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="30" width="70">
      <rect width="100%" height="100%" fill="#f8d7c3"/>
      <text x="8" y="20" font-size="16" fill="#a30a00" font-family="monospace">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const refreshCaptcha = () => {
    const newC = generateCaptchaText();
    setCaptcha(newC);
    setCaptchaImage(createCaptchaSVG(newC));
    setFormData((p) => ({ ...p, captcha: "" }));
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.captcha.trim().toUpperCase() !== captcha.trim().toUpperCase()) {
      toast.error("Captcha does not match. Try again.");
      refreshCaptcha();
      return;
    }

    setLoading(true);

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

        setSubmitted(true);
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
      <InnerPage title={"Contact Us"} />
      <ToastContainer />
      <div className="bg-[var(--rv-bg-white)] px-4">
        <div className="max-w-7xl mx-auto main-section grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--rv-bg-primary-light)] rounded-xl shadow-sm p-4 md:p-7 flex flex-col gap-2"
          >
            <span className="text-[var(--rv-primary)] font-semibold block">
              Get in Touch
            </span>
            <h4 className="font-bold">Let’s Chat, Reach Out to Us</h4>
            <p>Have questions? Send us a message and we’ll reply soon.</p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--rv-gray-light)] rounded-lg focus:ring-2 focus:ring-[var(--rv-primary)] outline-none"
                required
              />

              <input
                type="text"
                name="mobile"
                placeholder="Mobile No."
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--rv-gray-light)] rounded-lg focus:ring-2 focus:ring-[var(--rv-primary)] outline-none"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[var(--rv-gray-light)] rounded-lg mb-4 focus:ring-2 focus:ring-[var(--rv-primary)] outline-none"
              required
            />

            <textarea
              name="message"
              placeholder="Leave us a message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-[var(--rv-gray-light)] rounded-lg mb-4 focus:ring-2 focus:ring-[var(--rv-primary)] outline-none resize-none"
              required
            ></textarea>

            <div className="my-3">
              <CaptchaRow
                imageSrc={captchaImage}
                onRefresh={refreshCaptcha}
                value={formData.captcha}
                onChange={handleChange}
                name="captcha"
                placeholder="Enter Captcha"
                className="bg-[var(--rv-bg-primary-light)] border-[var(--rv-gray-light)]"
                inputClassName="border-[var(--rv-gray-light)] focus:border-[var(--rv-primary)]/60 bg-[var(--rv-bg-primary-light)] text-[var(--rv-black)]"
                buttonClassName="bg-[var(--rv-bg-gray-dark)] text-[var(--rv-white)]"
              />
            </div>
            <Button
              type={"submit"}
              disabled={loading}
              className={`w-full bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-primary)] text-[var(--rv-white)] py-3 font-semibold rounded-xl  
               ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              text={loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Sending...
                </>
              ) : (
                "Send Message"
              )}
            />
          </form>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <div className="bg-[var(--rv-bg-primary-light)] rounded-xl shadow-sm p-4 md:p-7 flex flex-col gap-5 items-center">
                <div className="w-full rounded-xl overflow-hidden">
                  <div className="w-full h-60">
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

                <div className="flex flex-col gap-5 w-full">


                  <div className="bg-[var(--rv-bg-white)] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--rv-bg-primary)] flex items-center justify-center">
                      <FaMailBulk className="text-[var(--rv-white)]" size={20} />
                    </div>
                    <div>
                      <p>Email</p>
                      <a
                        href={`mailto:${sitedata?.email || "support@example.com"}`}
                        className="font-medium hover:underline"
                      >
                        {sitedata?.email || "support@example.com"}
                      </a>
                    </div>
                  </div>

                  <div className="bg-[var(--rv-bg-white)] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--rv-bg-primary)] flex items-center justify-center">
                      <FaPhone className="text-[var(--rv-white)]" size={20} />
                    </div>
                    <div>
                      <p>Phone</p>
                      <a
                        href={`tel:${sitedata?.mobile || "+91xxxxxxxxxx"}`}
                        className="font-medium hover:underline"
                      >
                        {sitedata?.mobile || "+91 xxxxxxxxxx"}
                      </a>
                    </div>
                  </div>


                  <div className="bg-[var(--rv-bg-white)] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--rv-bg-primary)] flex items-center justify-center">
                      <FaMapLocation className="text-[var(--rv-white)]" size={20} />
                    </div>
                    <div>
                      <p>Address</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          sitedata?.address || "Mumbai, India"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline"
                      >
                        {sitedata?.address || "Mumbai, India"}
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTheme1;
