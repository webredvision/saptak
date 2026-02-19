"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiLock,
  FiShield,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordPage({ requestId }) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validatePassword = (pw) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    return passwordRegex.test(pw);
  };

  const handleReset = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 12 characters long and include uppercase, lowercase, number and special character",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          newPassword: password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successful!");
        router.push("/signin");
      } else {
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center bg-[var(--rv-bg-white)] overflow-hidden px-4">
      <div
        className={`relative z-10 w-full max-w-md main-section transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="border rounded-xl p-8 shadow backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-bg-secondary)] blur-xl opacity-50 rounded-full" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[var(--rv-bg-primary)] to-[var(--rv-bg-secondary)] flex items-center justify-center shadow-lg">
                <FiShield className="w-10 h-10 text-[var(--rv-white)]" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center text-[var(--rv-bg-primary)]">
            Reset Password
          </h1>
          <p className="text-center text-[var(--rv-gray)] mb-8 text-sm">
            Create a strong new password for your account
          </p>

          <div className="space-y-5">
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-bg-primary)] z-10" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[var(--rv-bg-white-light)] border outline-none placeholder-gray-400 focus:bg-[var(--rv-bg-white-light)] border-[var(--rv-bg-primary)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {!validatePassword(password) && password && (
              <p className="   text-[var(--rv-red)] flex items-center gap-1">
                <FiAlertCircle />
                Password must be 12+ chars with upper, lower, number & special
                character
              </p>
            )}

            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-bg-primary)] z-10" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[var(--rv-bg-white-light)] border outline-none placeholder-gray-400 focus:bg-[var(--rv-bg-white-light)] border-[var(--rv-bg-primary)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
              >
                {!showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && (
              <div className="bg-[var(--rv-bg-red-light)] border border-[var(--rv-red-light)] text-[var(--rv-red-dark)] text-sm rounded-xl p-3 flex items-center gap-2">
                <FiAlertCircle />
                {error}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full relative group overflow-hidden bg-[var(--rv-bg-primary)] py-3.5 rounded-xl font-semibold text-[var(--rv-white)] shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">
                {loading ? "Resetting..." : "Reset Password"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
