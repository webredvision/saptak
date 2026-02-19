"use client";

import React, { useEffect, useState } from "react";
import { BiShield } from "react-icons/bi";
import { FaArrowRight, FaEye } from "react-icons/fa";
import { FaLock, FaSpinner } from "react-icons/fa6";
import { FiEyeOff, FiMail } from "react-icons/fi";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { GrClose } from "react-icons/gr";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const LoginTheme2 = ({ roboUser, sitedata, login }) => {
  const router = useRouter();
  const [desk, setDesk] = useState(
    login?.name || login?.loginitems[0].login_desk
  );
  const [roles, setRoles] = useState(login?.loginitems || []);
  const [selectedRole, setSelectedRole] = useState(
    login?.loginitems[0].login_value
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [provider, setProvider] = useState({
    username: "",
    password: "",
    loginFor: login?.loginitems[0].login_value,
    siteUrl: sitedata?.siteurl,
    callbackUrl: sitedata?.callbackurl,
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
    const storedData = localStorage.getItem("investmentData");
    if (storedData) {
      const parsed = JSON.parse(storedData);

      const pcodeArray = parsed.funds.map((f) => f?.pcode);
      const amountArray = parsed.funds.map((f) => f?.allocationAmount);

      setProvider((prev) => ({
        ...prev,
        arn_no: parsed.arnnumber,
        pcode: pcodeArray,
        amount: amountArray,
      }));
    }
  }, []);

  useEffect(() => {
    setProvider((prev) => ({
      ...prev,
      loginFor: selectedRole === "ADMIN" ? "ADVISOR" : selectedRole,
    }));
  }, [selectedRole]);

  useEffect(() => {
    setProvider((prev) => ({
      ...prev,
      username: formData.username,
      password: formData.password,
    }));
  }, [formData]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint =
        desk === "ARN" ? "/api/login/arn-login" : "/api/login/ifa-login";

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${endpoint}`,
        provider
      );

      if (res.data.status === true) {
        toast.success("Login successful 🎉");
        router.push(res.data.url);
      } else {
        toast.error(res.data.msg || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = () => {
    if (!forgotEmail) return alert("Please enter your email");

    alert(`Password reset link sent to ${forgotEmail}`);
    setShowForgotModal(false);
    setForgotEmail("");
  };

  return (
    <>
      <InnerPage title={"Login"} />
      <ToastContainer />

      <div className="bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-5 main-section">
          <div className="w-full">
            <div className="border   border-[var(--rv-white-light)] rounded-xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="font-bold">Sign In</h2>
                <p>Choose your role & enter your credentials</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {roles?.map((role) => (
                  <button
                    key={role._id}
                    type="button"
                    onClick={() => setSelectedRole(role.login_value)}
                    className={`px-4 py-3  font-semibold rounded-lg transition-all
                    ${selectedRole === role.login_value
                        ? "bg-[var(--rv-bg-primary)] text-[var(--rv-black)]"
                        : "border   border-[var(--rv-white-light)]"
                      }`}
                  >
                    {role.login_name}
                  </button>
                ))}
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Username
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border   border-[var(--rv-white-light)] bg-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border   border-[var(--rv-white-light)] bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
                  >
                    {!showPassword ? <FiEyeOff /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-[var(--rv-gray-dark)]">Remember me</span>
                </label>

                <button
                  onClick={() => setShowForgotModal(true)}
                  className="text-[var(--rv-primary)] font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-[var(--rv-bg-primary)] text-[var(--rv-black)] font-bold py-3 rounded-xl flex items-center justify-center gap-2
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] transition"}
                `}
              >
                {loading ? <>
                <FaSpinner className="animate-spin" /> Proccessing...
                </> : "Sign In to Dashboard"}
                {!loading && <FaArrowRight />}
              </button>

              {roboUser && (
                <p className="text-center">
                  Don't have an account?{" "}
                  <a href="/registration" className="text-[var(--rv-primary)] font-semibold">
                    Sign Up
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="hidden lg:block w-full h-full">
            <div className="relative h-full rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--rv-bg-black)] to-transparent"></div>

              <div className="absolute bottom-0 p-6 text-[var(--rv-white)]">
                <div className="inline-flex items-center gap-2 px-4 py-2  bg-[var(--rv-bg-white-light)] rounded-full backdrop-blur-sm">
                  <BiShield />
                  Trusted by 10,000+ Users
                </div>
                <h2 className="font-bold">Manage Your Business with Confidence</h2>
                <p className="">
                  Secure, fast, and reliable access anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[var(--rv-bg-black)] backdrop-blur-sm flex items-center justify-center p-2">
          <div className="bg-[var(--rv-bg-white)] rounded-2xl p-6 w-[90%] max-w-md relative">
            <div
              onClick={() => setShowForgotModal(false)}
              className="absolute top-2 right-2 w-6 h-6 bg-[var(--rv-bg-red)] text-[var(--rv-white)] rounded-full flex items-center justify-center cursor-pointer"
            >
              <GrClose />
            </div>

            <h5 className="text-center font-bold text-[var(--rv-primary)]">Forgot Password</h5>
            <p className="text-center mt-2">
              Enter your email to receive a password reset link.
            </p>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border rounded-md px-4 py-3 mt-3"
            />

            <button
              onClick={handleForgotSubmit}
              className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] w-full py-3 rounded-md mt-4"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginTheme2;
