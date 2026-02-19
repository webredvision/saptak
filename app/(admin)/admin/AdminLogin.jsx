"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const router = useRouter();
  const cardRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid username or password ❌");
        return;
      }
      const session = await getSession();
      const role = session?.user?.role;

      toast.success("Login successful 🎉");
      setTimeout(() => {
        if (role === "devadmin") {
          router.push("/devadmin");
        } else if (role === "normaladmin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong 🚨");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotEmail }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(
          `Password reset link sent to ${data.maskedEmail} ✅`
        );
        setForgotModalOpen(false);
        setForgotEmail("");
      } else {
        toast.error(data.error || "Failed to send reset link ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong 🚨");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <>
      <InnerPage title={'Sign in'} />
      <div className="px-4">
        <div className="flex justify-center items-center main-section relative w-full overflow-hidden bg-[var(--rv-bg-white)]">
          <div
            ref={cardRef}
            className="relative z-10 w-full max-w-lg p-6 rounded-xl bg-[var(--rv-bg-white)] border border-[var(--rv-primary)]"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-[var(--rv-bg-primary)] bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-[var(--rv-black)]">Sign in to your account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1 text-[var(--rv-black)]">
                    <FaEnvelope className="mr-2" />
                    <label htmlFor="username">Username</label>
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-full px-5 py-3 border border-[var(--rv-primary)] text-[var(--rv-black)]"
                    placeholder="Enter your username"
                    required
                  />
                </div>


                <div>
                  <div className="flex items-center mb-1 text-[var(--rv-black)]">
                    <FaLock className="mr-2" />
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-full px-5 py-3 border border-[var(--rv-primary)] text-[var(--rv-black)]"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray-dark)]"
                    >
                      {!showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-[var(--rv-black)] opacity-80 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2 rounded border border-[var(--rv-white-light)] bg-transparent checked:bg-gradient-to-r checked:from-[var(--rv-bg-primary)] checked:to-[var(--rv-bg-primary)]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[var(--rv-black)] opacity-80 hover:opacity-100 hover:text-[var(--rv-bg-primary)] transition"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-bg-primary)] text-[var(--rv-white)] font-semibold tracking-wider shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-[var(--rv-black)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 
                   0 0 5.373 0 12h4zm2 
                   5.291A7.962 7.962 0 014 12H0c0 
                   3.042 1.135 5.824 3 
                   7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>
          </div>
          {forgotModalOpen && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
              <div className="bg-[var(--rv-bg-white)] p-6 rounded-2xl w-[90%] max-w-md relative">
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="absolute top-3 right-3 text-[var(--rv-black)] text-xl font-bold"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold text-[var(--rv-black)] mb-4">
                  Forgot Password
                </h2>
                <form
                  className="space-y-4"
                  onSubmit={handleForgotPassword}
                >
                  <div>
                    <label className="text-[var(--rv-black)] mb-1 block">
                      Enter your email or username
                    </label>
                    <input
                      type="text"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-full px-5 py-3 border border-[var(--rv-primary)] text-[var(--rv-black)]"
                      placeholder="Email or Username"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-bg-primary)] text-[var(--rv-white)] font-semibold tracking-wider hover:translate-y-[-2px] shadow-lg transition"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              </div>
            </div>
          )}

          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
