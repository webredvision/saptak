"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    loading: false,
  });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  if (!token || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--rv-red-dark)] font-bold text-xl">
        Invalid reset link ❌
      </div>
    );
  }

  const handleReset = async (e) => {
    e.preventDefault();

    if (state.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (state.password !== state.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setState({ ...state, loading: true });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            id: userId,
            newPassword: state.password,
          }),
        }
      );

      const data = await res.json();
      if (data.ok) {
        toast.success("Password reset successful 🎉");
        setTimeout(() => router.push("/signin"), 1500);
      } else {
        toast.error(data.error || "Failed to reset password ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong 🚨");
    } finally {
      setState({ ...state, loading: false });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--rv-bg-white)] px-4">
      <div className="w-full max-w-lg p-6 rounded-xl bg-[var(--rv-bg-white)] border border-[var(--rv-primary)] shadow-md">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-[var(--rv-bg-primary)] bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-[var(--rv-black)] opacity-80">
            Create a new password for your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleReset}>
          {["password", "confirmPassword"].map((field, idx) => (
            <div key={idx}>
              <div className="flex items-center mb-1 text-[var(--rv-black)]">
                <FaLock className="mr-2" />
                <label>
                  {field === "password"
                    ? "New Password"
                    : "Confirm Password"}
                </label>
              </div>

              <div className="relative">
                <input
                  type={state.showPassword ? "text" : "password"}
                  name={field}
                  value={state[field]}
                  onChange={handleChange}
                  className="w-full rounded-full px-5 py-3 border border-[var(--rv-primary)] text-[var(--rv-black)] focus:outline-none"
                  placeholder={
                    field === "password"
                      ? "Enter new password"
                      : "Confirm password"
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setState({
                      ...state,
                      showPassword: !state.showPassword,
                    })
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray-dark)]"
                >
                  {state.showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={state.loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-bg-primary)] text-[var(--rv-white)] font-semibold tracking-wider shadow-lg transition"
          >
            {state.loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ResetPasswordPage;
