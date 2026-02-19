"use client";

import React, { useEffect, useState } from "react";
import { FaEye, FaLock, FaMailBulk, FaSpinner } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { motion } from "framer-motion";

const LoginTheme1 = ({ roboUser, sitedata, login }) => {
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

  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      alert("Please enter your email address.");
      return;
    }

    alert(`Password reset link sent to ${forgotEmail}`);
    setShowForgotModal(false);
    setForgotEmail("");
  };

  return (
    <>
      <InnerPage title={"Login"} />
      <ToastContainer />
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl flex items-center justify-center main-section"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--rv-bg-white)] rounded-xl p-4 md:p-8 flex flex-col justify-center w-full max-w-xl border border-[var(--rv-gray)]"
          >
            <div className="w-full flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--rv-primary)] text-[var(--rv-white)] rounded-full font-semibold mb-5 shadow-lg">
                  <span className="w-2.5 h-2.5 bg-[var(--rv-bg-white)] rounded-full animate-pulse"></span>
                  Welcome Back
                </span>
                <h6 className="font-bold mb-2 text-[var(--rv-primary)]">Sign In</h6>
                <p className="">Enter your credentials to access your account</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {roles && (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                    {roles?.map((role, index) => (
                      <motion.button
                        key={role._id}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        onClick={() => setSelectedRole(role.login_value)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 border-2
                        ${selectedRole === role.login_value
                            ? "bg-[var(--rv-primary)] text-[var(--rv-white)] shadow-lg"
                            : "text-[var(--rv-primary)] border-[var(--rv-primary)]"
                          }`}
                      >
                        {role.login_name}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div>
                  <label className="block font-semibold text-[var(--rv-primary)] mb-2.5">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                      <FaMailBulk size={20} />
                    </div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-[var(--rv-white)] outline-none border-[var(--rv-gray)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--rv-primary)] mb-2.5">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                      <FaLock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border bg-[var(--rv-white)] outline-none border-[var(--rv-gray)]"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 -translate-y-1/2 text-[var(--rv-primary)] hover:text-[var(--rv-secondary)] transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FaEye size={20} />}
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded-md accent-[var(--rv-primary)] cursor-pointer"
                    />
                    <span className="text-[var(--rv-gray-dark)] group-hover:text-[var(--rv-primary)] transition-colors font-medium">
                      Remember me
                    </span>
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForgotModal(true)}
                    className="text-[var(--rv-primary)] font-semibold hover:text-[var(--rv-secondary)] transition-colors"
                  >
                    Forgot Password?
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 1 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2
                  ${loading
                      ? "bg-[var(--rv-bg-gray)] cursor-not-allowed opacity-70"
                      : "bg-[var(--rv-primary)] hover:bg-[var(--rv-secondary)] hover:shadow-xl text-[var(--rv-white)]"
                    }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin h-5 w-5" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </motion.button>

                {roboUser && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-4 pt-4 border-t border-[var(--rv-gray-light)]"
                  >
                    <p className="text-[var(--rv-gray-dark)] mb-2">Don't have an account?</p>
                    <a href="/registration">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[var(--rv-bg-white)] border-2 border-[var(--rv-primary)] text-[var(--rv-primary)] px-8 py-2.5 rounded-xl font-semibold hover:bg-[var(--rv-primary)] hover:text-[var(--rv-white)] transition-all"
                      >
                        Sign Up
                      </motion.button>
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {showForgotModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--rv-bg-black)] backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[var(--rv-bg-white)] p-8 rounded-3xl w-[90%] max-w-md relative flex flex-col gap-5 shadow-2xl"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 bg-[var(--rv-bg-red)] w-8 h-8 rounded-full flex items-center justify-center text-[var(--rv-white)] cursor-pointer hover:bg-[var(--rv-bg-red-dark)] transition-colors"
            >
              <GrClose />
            </motion.div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--rv-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-[var(--rv-white)] text-2xl" />
              </div>
              <h5 className="font-bold text-2xl text-[var(--rv-primary)] mb-2">
                Forgot Password?
              </h5>
              <p className="">
                Enter your email below to receive a password reset link.
              </p>
            </div>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border-2 border-[var(--rv-gray)] outline-none rounded-xl px-4 py-3.5 text-[var(--rv-primary)]  bg-[var(--rv-white)]"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleForgotSubmit}
              className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Send Reset Link
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default LoginTheme1;
