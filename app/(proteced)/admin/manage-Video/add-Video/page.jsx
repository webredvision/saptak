"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Zod schema
const FormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  videoUrl: z.string().optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  embedUrl: z.string().optional(),
});

export function InputForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
      image: "",
      embedUrl: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const category = isIframe ? "iframe" : "manual";

      if (category === "iframe" && !data.embedUrl?.trim()) {
        toast.error("Embed URL is required for iframe videos.");
        setLoading(false);
        return;
      }

      if (category === "manual") {
        if (!data.videoUrl?.trim()) {
          toast.error("Video URL is required for manual videos.");
          setLoading(false);
          return;
        }
        if (!selectedImage) {
          toast.error("Thumbnail image is required for manual videos.");
          setLoading(false);
          return;
        }
      }

      // image size validation
      if (category === "manual" && selectedImage && selectedImage.size > 1024 * 1024) {
        toast.error("Please select an image smaller than 1MB.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", category);

      if (category === "iframe") {
        formData.append("embedUrl", data.embedUrl);
      } else {
        if (selectedImage) formData.append("image", selectedImage);
        formData.append("videoUrl", data.videoUrl);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("Video uploaded successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-Video/manage");
      } else {
        toast.error("Something went wrong while uploading.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unexpected error. Please try again later.");
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
          {/* Iframe toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isIframe}
              onChange={(e) => setIsIframe(e.target.checked)}
              id="iframeCheckbox"
              className="h-4 w-4"
            />
            <label htmlFor="iframeCheckbox" className="font-semibold">
              Iframe URL
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Video Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Title"
                      {...field}
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isIframe ? (
              <FormField
                control={form.control}
                name="embedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Embed URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Embed URL"
                        {...field}
                        className="border border-[var(--rv-gray)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Video URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Video URL"
                          {...field}
                          className="border border-[var(--rv-gray)]"
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
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedImage(file);
                              field.onChange(file);
                            }
                          }}
                          className="border border-[var(--rv-gray)]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            text={
              loading ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2 inline-block" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )
            }
          />
        </form>
      </Form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

const AddVideo = () => (
  <div>
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h6 className="font-semibold">Add New Video</h6>
        <Link href="/admin/manage-Video/manage">
          <Button
            text="All Videos"
          />
        </Link>
      </div>
      <InputForm />
    </div>
  </div>
);

export default AddVideo;
