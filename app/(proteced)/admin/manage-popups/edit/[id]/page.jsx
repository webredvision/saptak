"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(admin)/ui/form";
import { Input } from "@/app/(admin)/ui/input";
import Button from "@/app/components/Button/Button";
import { FaSpinner } from "react-icons/fa";

export function WebPopupForm({ popupId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      status: false,
    },
  });

  const { setValue } = form;

  // 🧭 Fetch existing popup for editing
  useEffect(() => {
    if (popupId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/${popupId}`)
        .then((res) => {
          const { title, image, status } = res.data.popup;
          form.setValue("title", title);
          form.setValue("status", status);
          setPreviousImage(image?.url);
        })
        .catch((err) => {
          console.error("Error fetching popup:", err);
          toast.error("❌ Failed to fetch popup details.");
        });
    }
  }, [popupId]);

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors();

    try {
      // 🧩 Image validation
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

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/${popupId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Web Popup updated successfully!");
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
            toast.error(data?.message || "Image too large (max 1MB).");
          } else {
            toast.error(
              data?.message || "Something went wrong while updating popup."
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
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
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

            {/* Image Upload */}
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

                  {previousImage && (
                    <div className="mt-3">
                      <p className="text-[var(--rv-gray)] mb-1">
                        Previous Image:
                      </p>
                      <img
                        src={previousImage}
                        alt="Previous"
                        className="max-w-xs rounded border border-[var(--rv-gray)] h-auto w-40"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Active Status */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            text={
              !loading ? (
                "Update"
              ) : (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2 inline-block" />
                  Updating...
                </>
              )
            }
          />
        </form>
      </Form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

const EditWebPopupPage = () => {
  const params = useParams();
  const popupId = params.id;

  return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h6 className="font-semibold">Edit Web Popup</h6>
          <Link href="/admin/manage-popups/manage">
            <Button
              text={"Manage Web Popups"}
            />
          </Link>
        </div>
        <WebPopupForm popupId={popupId} />
      </div>
  );
};

export default EditWebPopupPage;
