"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/(admin)/ui/form";
import { Input } from "@/app/(admin)/ui/input";
import Button from "@/app/components/Button/Button";

const ChangePasswordPage = () => {
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        toast.success("✅ Password changed successfully", {
          onClose: () => router.push("/admin"),
          autoClose: 3000,
        });
        form.reset();
      } else {
        toast.error(response.data.error || "❌ Failed to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(
        error.response?.data?.error ||
        "❌ Server Error, please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    < div>
      <div className="bg-[var(--rv-bg-white)] shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaLock /> Change Password
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Old Password */}
            <FormField
              control={form.control}
              name="oldPassword"
              rules={{ required: "Old password is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.old ? "text" : "password"}
                        placeholder="Enter old password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({ ...prev, old: !prev.old }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
                      >
                        {show.old ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              rules={{ required: "New password is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.new ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({ ...prev, new: !prev.new }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
                      >
                        {show.new ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{ required: "Confirm your password" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.confirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rv-gray)]"
                      >
                        {show.confirm ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type={"submit"}
              disabled={loading}
              className={`
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
        </Form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </ div>
  );
};

export default ChangePasswordPage;
