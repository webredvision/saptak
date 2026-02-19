"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiMail,
  FiLock,
  FiUser,
  FiShield,
  FiX,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import InnerPage from "@/app/components/InnerBanner/InnerPage";


const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

const signinTheme3 = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [otpTimer, setOtpTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const isStrongPassword = strongPasswordRegex.test(password);

  const isLoginDisabled =
    loading ||
    (step === 1 &&
      (!username.trim() || !password.trim() || !isStrongPassword)) ||
    (step === 2 && otp.length !== 6);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (step !== 2) return;

    if (otpTimer === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, otpTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      ...(step === 2 && { otp }),
    });

    setLoading(false);

    if (res?.error) {
      switch (res.error) {
        case "OTP_REQUIRED":
          setStep(2);
          setOtp("");
          setOtpTimer(300);
          setCanResend(false);
          toast.info("OTP sent to your email 📧");
          return;
        case "Invalid credentials":
          toast.error("Invalid username or password ❌");
          return;
        case "Invalid OTP":
          toast.error("Invalid OTP ❌");
          return;
        case "OTP expired":
          toast.error("OTP expired ⏳");
          return;
        case "Account temporarily blocked":
          toast.error("Account blocked for 15 minutes ⛔");
          return;
        default:
          toast.error(res.error);
          return;
      }
    }

    if (res?.ok) {
      toast.success("Login successful 🎉");
      const session = await getSession();

      if (session?.user?.role === "DEVADMIN") router.push("/devadmin");
      else if (session?.user?.role === "ADMIN") router.push("/admin");
      else router.push("/");
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (res?.error === "OTP_REQUIRED") {
      setOtpTimer(300);
      setCanResend(false);
      toast.info("OTP resent to your email 📧");
    } else if (res?.error) {
      toast.error(res.error);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotInput) return toast.error("Enter email or username");

    setForgotLoading(true);
    try {
      const res = await fetch("/api/user/forgot-password/sendlinkpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotInput }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowForgotModal(false);
        setForgotInput("");
      } else toast.error(data.error);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <InnerPage title={"Sign in"} />
      <div className="relative flex justify-center items-center bg-[var(--rv-bg-white)] text-[var(--rv-primary)] overflow-hidden px-4 pt-10">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-5 main-section ">
          <div className="w-full h-full hidden lg:block rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div
            className={`relative z-10 transition-all duration-1000 transform ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
              }`}
          >
            <div className="rounded-xl p-6 border">
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[var(--rv-bg-primary)] blur-xl opacity-50 rounded-full group-hover:opacity-70 transition-opacity" />
                  <div className="relative w-20 h-20 rounded-full bg-[var(--rv-bg-primary)] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {step === 1 ? (
                      <FiUser
                        className="w-10 h-10 text-[var(--rv-white)]"
                        strokeWidth={2}
                      />
                    ) : (
                      <FiShield
                        className="w-10 h-10 text-[var(--rv-white)] animate-pulse"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2 text-center text-[var(--rv-primary)]">
                {step === 1 ? "Welcome Back" : "Verify OTP"}
              </h1>
              <p className="text-center text-[var(--rv-black)] mb-8 text-sm">
                {step === 1
                  ? "Sign in to continue to your account"
                  : "Enter the 6-digit code sent to your email"}
              </p>

              <div className="space-y-5">
                {step === 1 && (
                  <>
                    <div className="relative group">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-bg-primary)] transition-colors z-10" />
                      <input
                        type="text"
                        placeholder="Username / Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--rv-bg-white-light)] border outline-none placeholder-gray-400 focus:bg-[var(--rv-bg-white-light)] border-[var(--rv-bg-primary)] transition-all"
                      />
                    </div>

                    <div className="relative group">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-bg-primary)] transition-colors z-10" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[var(--rv-bg-white-light)] border outline-none placeholder-gray-400 focus:bg-[var(--rv-bg-white-light)] border-[var(--rv-bg-primary)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray)] transition-colors z-10"
                      >
                        {!showPassword ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-[var(--rv-bg-primary)] hover:text-[var(--rv-bg-primary-dark)] transition-colors font-medium hover:underline"
                        onClick={() => setShowForgotModal(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="relative group">
                      <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-bg-primary)] transition-colors z-10" />
                      <input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        maxLength={6}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl text-[var(--rv-black)] border outline-none placeholder-gray-400 focus:bg-[var(--rv-bg-white-light)] border-[var(--rv-bg-primary)] transition-all text-center tracking-[0.5em] text-xl font-bold"
                      />
                    </div>

                    <div className="flex justify-between items-center border rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${otpTimer > 40
                              ? "bg-[var(--rv-bg-green)]"
                              : otpTimer > 20
                                ? "bg-[var(--rv-bg-yellow)]"
                                : "bg-[var(--rv-bg-red)]"
                            }`}
                        />
                        <span className="text-sm text-[var(--rv-gray)]">
                          {canResend ? (
                            <span className="text-[var(--rv-yellow)] font-medium">
                              OTP Expired
                            </span>
                          ) : (
                            <>
                              Expires in{" "}
                              <span className="font-semibold text-[var(--rv-black)]">
                                {otpTimer}s
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={!canResend || loading}
                        className={`text-sm font-medium transition-all ${canResend && !loading
                            ? "text-[var(--rv-bg-primary)] cursor-pointer"
                            : "text-[var(--rv-gray)] cursor-not-allowed"
                          }`}
                      >
                        Resend OTP
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setOtpTimer(300);
                        setCanResend(false);
                        setUsername("");
                        setPassword("");
                      }}
                      className="w-full text-[var(--rv-gray)] transition-colors"
                    >
                      ← Back to login
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoginDisabled}
                  className="w-full relative group overflow-hidden bg-[var(--rv-bg-primary)] py-3.5 rounded-xl font-semibold text-[var(--rv-white)] shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : step === 1 ? (
                      "Sign In"
                    ) : (
                      "Verify OTP"
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="relative w-full max-w-md bg-gradient-to-br from-[var(--rv-white-dark)] to-[var(--rv-white-dark)] backdrop-blur-xl p-8 rounded-3xl shadow-2xl animate-scaleIn">
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--rv-bg-gray-light)] hover:bg-[var(--rv-bg-gray-light)] flex items-center justify-center transition-all hover:scale-110 group"
              >
                <FiX className="w-5 h-5 text-[var(--rv-gray-dark)] group-hover:text-[var(--rv-gray-dark)]" />
              </button>

              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[var(--rv-bg-primary)] flex items-center justify-center shadow-lg">
                  <FiMail className="w-8 h-8 text-[var(--rv-white)]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2 text-center text-[var(--rv-gray-dark)]">
                Forgot Password?
              </h2>
              <p className="text-center text-[var(--rv-gray-dark)] mb-6 text-sm">
                Enter your email or username and we&apos;ll send you a reset
                link
              </p>

              <div className="relative group mb-6">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-bg-primary)] transition-colors" />
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-[var(--rv-gray-light)] rounded-xl text-[var(--rv-gray-dark)] placeholder-gray-400 focus:border-[var(--rv-bg-primary)] focus:ring-2 focus:ring-[var(--rv-bg-primary)]/20 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-3 bg-[var(--rv-bg-gray-light)] hover:bg-[var(--rv-bg-gray-light)] text-[var(--rv-gray-dark)] font-medium rounded-xl transition-all hover:scale-105"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-[var(--rv-bg-primary)] hover:shadow-lg text-[var(--rv-white)] font-medium rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading || !forgotInput.trim()}
                >
                  {forgotLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Link"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default signinTheme3;
