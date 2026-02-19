"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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


const FormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  videoUrl: z.string().optional(),
  embedUrl: z.string().optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
});

export function InputForm({ postId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
      embedUrl: "",
      image: "",
    },
  });

  // ✅ Fetch existing data
  useEffect(() => {
    if (!postId) return;
    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin/${postId}`
        );
        const { title, videoUrl, embedUrl, image } = res.data.video;
        form.setValue("title", title || "");
        form.setValue("videoUrl", videoUrl || "");
        form.setValue("embedUrl", embedUrl || "");
        setPreviousImage(image?.url || null);
        setIsIframe(embedUrl && embedUrl.trim() !== "");
      } catch (error) {
        console.error("Error fetching video:", error);
        toast.error("Failed to load video details.");
      }
    };
    fetchVideo();
  }, [postId]);

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const category = isIframe ? "iframe" : "manual";

      // Validation
      if (category === "manual" && selectedImage && selectedImage.size > 1024 * 1024) {
        toast.error("Please select an image smaller than 1MB.");
        setLoading(false);
        return;
      }

      if (category === "iframe" && !data.embedUrl?.trim()) {
        toast.error("Embed URL is required for iframe videos.");
        setLoading(false);
        return;
      }

      if (category === "manual" && !data.videoUrl?.trim()) {
        toast.error("Video URL is required for manual videos.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", category);

      if (category === "iframe") {
        formData.append("embedUrl", data.embedUrl);
      } else {
        formData.append("videoUrl", data.videoUrl);
        if (selectedImage) formData.append("image", selectedImage);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Video updated successfully!");
        form.reset();
        router.push("/admin/manage-Video/manage");
      } else {
        toast.error("Something went wrong while updating.");
      }
    } catch (error) {
      console.error("Error updating video:", error);
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
                      {previousImage && (
                        <div className="mt-3">
                          <p className="text-[var(--rv-gray)]">Previous Image:</p>
                          <img
                            src={previousImage}
                            alt="Previous"
                            className="w-32 h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <Button
            type="submit"
            text={
              !loading ? (
                "Update Video"
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

const EditVideo = () => {
  const param = useParams();
  const postId = param.id;

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h6 className="font-semibold">Edit Video</h6>
          <Link href="/admin/manage-Video/manage">
            <Button
              className="text-[var(--rv-white)] bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-primary)] rounded-md"
              text="All Videos"
            />
          </Link>
        </div>
        <InputForm postId={postId} />
      </div>
    </div>
  );
};

export default EditVideo;
