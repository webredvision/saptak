"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FiLock,
    FiShield,
    FiEye,
    FiEyeOff,
    FiAlertCircle,
    FiAlertTriangle,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
import Button from "@/app/components/Button/Button";

const Layout = ({ children }) => (
    <>
        <InnerPage title="Reset Password" />
        <div className="relative flex justify-center items-center bg-[var(--rv-bg-white)] text-[var(--rv-black)] px-4">
            <div className="max-w-7xl mx-auto main-section w-full flex items-center justify-center">
                {children}
            </div>
        </div>
    </>
);

export default function ResetPasswordTheme2({ status, requestId }) {
    const router = useRouter();

    if (status === "invalid") {
        return (
            <Layout>
                <div className="w-full max-w-md border rounded-xl p-6 text-center flex items-center flex-col gap-4">
                    <div className="relative mx-auto">
                        <div className="absolute inset-0 bg-red-500 blur-xl opacity-40 rounded-full" />
                        <div className="relative w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                            <FiAlertTriangle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-red-600">
                        Invalid or Expired Link
                    </h2>
                    <p>This password reset link is no longer valid.</p>

                    <Button text="Go to Sign In" link="/signin" />
                </div>
            </Layout>
        );
    }


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const validatePassword = (pw) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(pw);

    const isPasswordValid =
        password &&
        confirmPassword &&
        validatePassword(password) &&
        password === confirmPassword;


    const handleReset = async () => {
        setError("");

        if (!password || !confirmPassword) {
            setError("Both fields are required");
            return;
        }

        if (!validatePassword(password)) {
            setError(
                "Password must be 12+ characters with uppercase, lowercase, number and special character"
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
        <>
            <ToastContainer />
            <Layout>
                <div className="w-full max-w-md border rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--rv-bg-primary)] to-[var(--rv-bg-secondary)] flex items-center justify-center">
                            <FiShield className="text-white text-3xl" />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-center text-[var(--rv-bg-primary)]">
                            Reset Password
                        </h1>
                        <p className="text-center">
                            Create a strong new password
                        </p>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">
                            New Password
                        </label>

                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border  bg-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {!showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {!validatePassword(password) && password && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mb-3">
                            <FiAlertCircle />
                            Password must be strong
                        </p>
                    )}
                    <div>
                        <label className="block font-semibold mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-3 flex gap-2">
                            <FiAlertCircle /> {error}
                        </div>
                    )}
                    <div>
                        <Button
                            onClick={handleReset}
                            disabled={loading || !isPasswordValid}
                            text={loading ? "Resetting..." : "Reset Password"}
                        />
                    </div>
                </div>
            </Layout>
        </>
    );
}
