"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import Button from "@/app/components/Button/Button";
import CaptchaRow from "@/app/components/Captcha/CaptchaRow";

const FormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  mobile: z.string().nonempty({ message: "Mobile number is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().optional(),
  captcha: z.string().min(1, { message: "Captcha is required." }),
});

const InquirySection = ({
  captcha,
  captchaImage,
  refreshCaptcha,
  onSuccess,
}) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      mobile: "",
      email: "",
      message: "",
      captcha: "",
    },
  });

  const handleRefresh = () => {
    refreshCaptcha();
    form.setValue("captcha", "");
    form.clearErrors("captcha");
  };

  const onSubmit = (data) => {
    if (captcha.trim().toUpperCase() !== data?.captcha?.trim().toUpperCase()) {
      toast.error("Captcha mismatch.");
      form.setError("captcha", { type: "manual", message: "Captcha mismatch." });
      handleRefresh();
      return;
    }
    const { captcha: _captcha, ...payload } = data;
    onSuccess(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 animate-in fade-in duration-500"
      >
        <div className="flex justify-between items-center gap-5 border-b border-[var(--rv-border)] pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--rv-text)] uppercase">
              Risk Assessment
            </h2>
            <p className="text-[var(--rv-text-muted)] uppercase tracking-widest mt-1 opacity-70">
              Tell us about yourself
            </p>
          </div>
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center text-[var(--rv-text)] hover:bg-[var(--rv-bg-secondary-light)] rounded-full transition-all"
          >
            <MdCancel size={24} />
          </Link>
        </div>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Full Name"
                    {...field}
                    className="h-12 border-[var(--rv-border)] focus:border-[var(--rv-primary)] bg-[var(--rv-bg-white-light)] text-[var(--rv-text)] rounded-xl placeholder:text-[var(--rv-text-muted)] focus:ring-2 focus:ring-[var(--rv-primary)]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Mobile"
                      {...field}
                      className="h-12 border-[var(--rv-border)] focus:border-[var(--rv-primary)] bg-[var(--rv-bg-white-light)] text-[var(--rv-text)] rounded-xl placeholder:text-[var(--rv-text-muted)] focus:ring-2 focus:ring-[var(--rv-primary)]/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="h-12 border-[var(--rv-border)] focus:border-[var(--rv-primary)] bg-[var(--rv-bg-white-light)] text-[var(--rv-text)] rounded-xl placeholder:text-[var(--rv-text-muted)] focus:ring-2 focus:ring-[var(--rv-primary)]/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    placeholder="Additional Message (Optional)"
                    {...field}
                    className="w-full min-h-[80px] p-2 border border-[var(--rv-border)] focus:border-[var(--rv-primary)] bg-[var(--rv-bg-white-light)] text-[var(--rv-text)] rounded-xl placeholder:text-[var(--rv-text-muted)] focus:ring-2 focus:ring-[var(--rv-primary)]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="captcha"
            render={({ field }) => (
              <FormItem>
                <CaptchaRow
                  imageSrc={captchaImage}
                  onRefresh={handleRefresh}
                  inputProps={field}
                  className="bg-[var(--rv-bg-secondary-light)] border-[var(--rv-border)]"
                  inputClassName="border-[var(--rv-border)] focus:border-[var(--rv-primary)]/60  bg-[var(--rv-bg-white-light)] text-[var(--rv-text)] placeholder:text-[var(--rv-text-muted)]"
                  buttonClassName="bg-[var(--rv-primary)] text-[var(--rv-black)] hover:brightness-110"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button text="Begin Assessment" className="w-full" type="submit" />
      </form>
    </Form>
  );
};

export default InquirySection;
