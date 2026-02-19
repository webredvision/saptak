"use client";

import React, { useEffect, useState } from "react";
import { FaEye, FaLock, FaMailBulk, FaSpinner } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import { GrClose } from "react-icons/gr";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button/Button";
import Link from "next/link";

const LoginTheme3 = ({ roboUser, sitedata, login }) => {
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

  // -------- INVESTMENT DATA: pcode + amount --------
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

  // -------- Selected Role affect provider.loginFor --------
  useEffect(() => {
    setProvider((prev) => ({
      ...prev,
      loginFor: selectedRole === "ADMIN" ? "ADVISOR" : selectedRole,
    }));
  }, [selectedRole]);

  // -------- formData   provider sync --------
  useEffect(() => {
    setProvider((prev) => ({
      ...prev,
      username: formData.username,
      password: formData.password,
    }));
  }, [formData]);

  // -------- SUBMIT LOGIN --------
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

  // -------- Forgot Password --------
  const handleForgotSubmit = () => {
    if (!forgotEmail) return alert("Enter your email");
    alert(`Password reset link sent to ${forgotEmail}`);
    setShowForgotModal(false);
  };

  // -----------------------------------------
  //        THEME 5 UI (SAME DESIGN)
  // -----------------------------------------

  return (
    <>
      <InnerPage title={"Login"} />
      <ToastContainer />

      <div className="bg-[var(--rv-bg-white)] flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 main-section overflow-hidden">

          <div className="rounded-xl lg:rounded-r-none lg:rounded-l-xl overflow-hidden ">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>


          <div className="bg-[var(--rv-bg-white)] border rounded-xl lg:rounded-l-none lg:rounded-r-xl  p-5 lg:p-10 flex flex-col gap-5 justify-center">

            <div className="">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--rv-bg-primary-light)] text-[var(--rv-primary)] rounded-full font-medium mb-4">
                <span className="w-2 h-2 bg-[var(--rv-bg-primary)] rounded-full"></span>
                Welcome Back
              </span>
              <h1 className="text-4xl font-bold text-[var(--rv-gray-dark)] mb-2">Sign In</h1>
              <p className="text-[var(--rv-gray-dark)]">Enter your credentials</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 ">
              {roles?.map((role) => (
                <button
                  key={role._id}
                  type="button"
                  onClick={() => setSelectedRole(role.login_value)}
                  className={`px-3 py-2 rounded-md font-medium border transition-all duration-300
                    ${selectedRole === role.login_value
                      ? "bg-[var(--rv-bg-primary)] text-[var(--rv-white)] border-[var(--rv-bg-primary)]"
                      : "text-[var(--rv-black)] border-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-gray-light)]"
                    }`}
                >
                  {role.login_name}
                </button>
              ))}
            </div>

            <div className="">
              <label className="block font-medium text-[var(--rv-secondary)] mb-2">
                Username
              </label>
              <div className="relative">
                <FaMailBulk className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-secondary)]" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-md border bg-[var(--rv-bg-white)] border-[var(--rv-gray)] focus:ring-2 focus:ring-[var(--rv-primary)] outline-none"
                />
              </div>
            </div>

            <div className="">
              <label className="block font-medium text-[var(--rv-secondary)] mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-secondary)]" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-3 rounded-md border bg-[var(--rv-bg-white)] border-[var(--rv-gray)] focus:ring-2 focus:ring-[var(--rv-primary)] outline-none"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
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
                className="text-[var(--rv-primary-dark)] font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={` py-3
                ${loading
                  ? "bg-[var(--rv-bg-gray)] cursor-not-allowed opacity-70"
                  : ""
                }`}
              text={loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Logging In...
                </>
              ) : (
                "Sign In"
              )}
            >

            </Button>

            {roboUser && (

              <p className="text-center">Don't have an account?{" "}
                <Link href="/registration" className="text-[var(--rv-primary)] font-semibold">
                  Sign Up
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-[var(--rv-bg-white)] p-6 rounded-2xl w-[90%] max-w-md relative">
            <div
              onClick={() => setShowForgotModal(false)}
              className="absolute top-2 right-2 bg-[var(--rv-bg-red)] w-6 h-6 flex items-center justify-center text-[var(--rv-white)] rounded-full cursor-pointer"
            >
              <GrClose />
            </div>

            <h5 className="font-bold text-center text-[var(--rv-primary)]">
              Forgot Password
            </h5>
            <p className="text-center mb-3">
              Enter your email to receive a reset link.
            </p>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full border rounded-md px-4 py-3 mb-4"
              placeholder="Email"
            />

            <button
              onClick={handleForgotSubmit}
              className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] py-3 rounded-md w-full"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginTheme3;
