"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "@/app/components/Button/Button";
import Loader from "@/app/(admin)/admin/common/Loader";
import { Input } from "@/app/(admin)/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(admin)/ui/form";
import { FaSpinner } from "react-icons/fa";

const FormSchema = z.object({
  title: z.string().nonempty({ message: "Title is required." }),
  image: z.instanceof(File).optional(),
});

// ✅ InputForm Component
export function InputForm({ postId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: "" },
  });

  // ✅ Fetch existing post data if editing
  useEffect(() => {
    if (postId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/innerpagebanner/${postId}`)
        .then((res) => {
          const { title, image } = res.data?.innerpagebanner || {};
          form.setValue("title", title || "");
          setPreviousImage(image?.url || null);
        })
        .catch((err) => {
          console.error("Error fetching post data:", err);
          toast.error("Failed to fetch data.");
        });
    }
  }, [postId, form]);

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Validate image size
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        toast.error("Image size exceeds 1MB. Please upload a smaller image.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      if (selectedImage) formData.append("image", selectedImage);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/innerpagebanner/${postId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        toast.success("✅ Banner updated successfully!");
        router.push("/admin/manage-innerpagebanner/manage");
      } else {
        toast.error("Unexpected server response. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Server error occurred.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="border border-[var(--rv-gray)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload Field */}
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
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                      field.onChange(file);
                    }
                  }}
                  className="border border-[var(--rv-gray)]"
                />
              </FormControl>
              <FormMessage />
              {previousImage && (
                <div className="mt-4">
                  <p className="text-[var(--rv-gray)]">Previous Image:</p>
                  <img
                    src={previousImage}
                    alt="Previous Banner"
                    className="max-w-sm rounded border h-auto w-40"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          text={
            loading ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4 mr-2" /> Updating...
              </>
            ) : (
              "Update"
            )
          }
        />
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </Form>
  );
}

const EditPost = () => {
  const params = useParams();
  const postId = params?.id;

  return (
    < div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Edit Inner Page Banner</h1>
          <Link href="/admin/manage-innerpagebanner/manage">
            <Button text={'All Banners'} />
          </Link>
        </div>
        <InputForm postId={postId} />
      </div>
    </ div>
  );
};

export default EditPost;
