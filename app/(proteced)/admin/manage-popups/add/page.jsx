'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/ui/form";
import { Input } from "@/app/(admin)/ui/input";
import Button from "@/app/components/Button/Button";
import { FaSpinner } from "react-icons/fa";

export function WebPopupForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      status: false,
    },
  });

  const { setValue } = form;

  React.useEffect(() => {
    const checkExistingPopup = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/`);
        if (res.data && res.data.length > 0) {
          toast.warning("A popup already exists. You can only edit or delete it.");
          router.push("/admin/manage-popups/manage");
        }
      } catch (error) {
        console.error("Failed to check existing popups:", error);
      }
    };
    checkExistingPopup();
  }, [router]);

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors(); // Clear previous inline errors

    try {
      // 🧩 Frontend image validation
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size exceeds more than 1MB.",
        });
        toast.error("Please upload an image smaller than 1MB.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      formData.append("status", data.status);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("✅ Web Popup created successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-popups/manage");
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (error) {
      console.error("❌ Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            form.setError("image", {
              type: "manual",
              message: "Image size exceeds more than 1MB.",
            });
            toast.error(data?.message || "Image size exceeds more than 1MB.");
          } else {
            toast.error(
              data?.message || "Something went wrong while submitting the form."
            );
          }
        } else {
          toast.error(
            "Unable to reach the server. Please check your internet connection."
          );
        }
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter popup title"
                      {...field}
                      className="border border-[var(--rv-gray)] w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Upload Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="border border-[var(--rv-gray)] w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Active Status</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => setValue("status", e.target.checked)}
                      className="h-4 w-4 ml-4 items-center"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>

          <Button
            type="submit"
            text={
              !loading ? (
                "Submit"
              ) : (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2 inline-block" />
                  Submitting...
                </>
              )
            }
          />
        </form>
      </Form>

      <ToastContainer />
    </>
  );
}

const AddWebPopupPage = () => (
  <div className="flex flex-col gap-3">
    <div className="flex justify-between">
      <h6 className="font-semibold">Add Web Popup</h6>
      <Link href="/admin/manage-popups/manage">
        <Button text={' Manage Web Popups'} />
      </Link>
    </div>
    <WebPopupForm />
  </div>
);

export default AddWebPopupPage;
