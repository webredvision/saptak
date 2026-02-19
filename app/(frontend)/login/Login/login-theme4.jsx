"use client";

import React, { useEffect, useState } from "react";
import { BiShield } from "react-icons/bi";
import { FaArrowRight, FaEye, FaLock, FaSpinner } from "react-icons/fa";
import { FiEyeOff, FiMail } from "react-icons/fi";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { GrClose } from "react-icons/gr";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Heading from "@/app/components/Heading/Heading";

const LoginTheme4 = ({ roboUser, sitedata, login }) => {
  const router = useRouter();

  const [desk, setDesk] = useState(login?.name || login?.loginitems?.[0]?.login_desk);
  const [roles, setRoles] = useState(login?.loginitems || []);
  const [selectedRole, setSelectedRole] = useState(login?.loginitems?.[0]?.login_value || "");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [provider, setProvider] = useState({
    username: "",
    password: "",
    loginFor: login?.loginitems?.[0]?.login_value || "",
    siteUrl: sitedata?.siteurl || "",
    callbackUrl: sitedata?.callbackurl || "",
    pcode: [],
    amount: [],
    arn_no: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    try {
      const storedData = localStorage.getItem("investmentData");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const pcodeArray = (parsed.funds || []).map((f) => f?.pcode);
        const amountArray = (parsed.funds || []).map((f) => f?.allocationAmount);
        setProvider((prev) => ({
          ...prev,
          arn_no: parsed.arnnumber || prev.arn_no,
          pcode: pcodeArray,
          amount: amountArray,
        }));
      }
    } catch (e) {
      console.warn("investmentData parse failed", e);
    }
  }, []);

  useEffect(() => {
    setProvider((prev) => ({
      ...prev,
      loginFor: selectedRole === "ADMIN" ? "ADVISOR" : selectedRole,
    }));
  }, [selectedRole]);

  useEffect(() => {
    setProvider((prev) => ({ ...prev, username: formData.username, password: formData.password }));
  }, [formData]);

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      toast.error("Please enter username and password");
      return;
    }
    setLoading(true);
    try {
      const endpoint = desk === "ARN" ? "/api/login/arn-login" : "/api/login/ifa-login";
      const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || ""}${endpoint}`;

      const res = await axios.post(url, provider);
      if (res?.data?.status === true) {
        toast.success("Login successful 🎉");
        if (res.data.url) router.push(res.data.url);
      } else {
        toast.error(res?.data?.msg || "Login failed");
      }
    } catch (error) {
      console.error("login err", error);
      toast.error((error?.response?.data?.msg) || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = () => {
    if (!forgotEmail) {
      toast.warn("Please enter your email");
      return;
    }
    toast.success(`Password reset link sent to ${forgotEmail}`);
    setShowForgotModal(false);
    setForgotEmail("");
  };

  return (
    <>
      <InnerPage title={"Login"} />
      <ToastContainer />

      <section className="bg-[var(--rv-bg-white)] px-4 text-[var(--rv-white)]">
        <div className="max-w-7xl mx-auto main-section">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            <div className="lg:col-span-3 hidden lg:block rounded-xl overflow-hidden shadow-2xl relative border bg-[var(--rv-bg-secondary)] border-[var(--rv-border)] text-[var(--rv-white)]">
              <img src="/images/login.jpg" className="w-full h-full object-cover" alt="" />
            </div>
            <main className="lg:col-span-2 flex border border-[var(--rv-border)] overflow-hidden rounded-xl  bg-gradient-to-tl from-[var(--rv-bg-primary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-secondary)] flex-col p-6 md:p-8 relative z-10">
            
                <Heading align="start" variant="light" title={'Sign In'} heading={'Sign In'} description={'Choose role and enter credentials'}/>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {roles?.map((role) => (
                    <button
                      key={role._id || role.login_value}
                      type="button"
                      onClick={() => setSelectedRole(role.login_value)}
                      className={`px-3 py-2 rounded-full text-sm font-medium border transition ${selectedRole === role.login_value
                        ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] border-transparent"
                        : "bg-[var(--rv-bg-white)] border-[var(--rv-border)] text-[var(--rv-primary)]"
                        }`}
                    >
                      {role.login_name}
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]" />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border   border-[var(--rv-border)] bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border   border-[var(--rv-border)] bg-transparent outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
                      aria-label="toggle password"
                    >
                      {showPassword ? <FiEyeOff /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    onClick={() => setShowForgotModal(true)}
                    className="text-sm text-[var(--rv-bg-primary)] font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-[var(--rv-white)] font-semibold flex items-center justify-center gap-3 ${loading ? "bg-[var(--rv-bg-gray)] cursor-not-allowed" : "bg-[var(--rv-bg-primary)] hover:brightness-95"
                      }`}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Sign In <FaArrowRight />
                      </>
                    )}
                  </button>
                </div>

                {roboUser && (
                  <p className="text-center mt-4">
                    Don't have an account? {" "}
                    <Link href="/registration" className="text-[var(--rv-primary)] font-semibold">
                      Sign Up
                    </Link>
                  </p>
                )}
            </main>
          </div>
        </div>
      </section>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--rv-bg-black)] backdrop-blur-sm p-4">
          <div className="bg-[var(--rv-bg-white)] rounded-2xl w-full max-w-md p-6 relative shadow-xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-3 right-3 text-sm rounded-full w-8 h-8 grid place-items-center bg-[var(--rv-bg-red)] text-[var(--rv-white)]"
            >
              <GrClose />
            </button>

            <h4 className="ont-bold text-[var(--rv-bg-primary)] text-center">Forgot Password</h4>
            <p className="text-center mt-2">Enter your email to receive a password reset link.</p>

            <input
              type="email"
              className="w-full mt-4 border   border-[var(--rv-border)] outline-none rounded-lg px-4 py-2"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div className="mt-4">
              <button
                onClick={handleForgotSubmit}
                className="w-full bg-[var(--rv-bg-primary)] text-[var(--rv-white)] py-2 rounded-lg"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginTheme4;
