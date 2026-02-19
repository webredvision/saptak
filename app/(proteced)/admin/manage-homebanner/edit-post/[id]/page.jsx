"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
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
  

export function InputForm({ postId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousImage, setPreviousImage] = useState(null);

  const form = useForm({
    defaultValues: {
      title: "",
      designation: "",
      auther_url: "",
    },
  });

  // Fetch existing post data
  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/${postId}`);
        if (res.status === 200) {
          const { title, designation, auther_url, image } = res.data.homeBanner;
          form.setValue("title", title);
          form.setValue("designation", designation);
          form.setValue("auther_url", auther_url);
          setPreviousImage(image?.url);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load banner data");
      }
    };

    fetchData();
  }, [postId]);

  // Submit edited data
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        toast.error("❌ Please upload an image smaller than 1MB.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (selectedImage) formData.append("image", selectedImage);
      formData.append("title", data.title);
      formData.append("designation", data.designation);
      formData.append("auther_url", data.auther_url);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("✅ Banner updated successfully!");
        form.reset();
        router.push("/admin/manage-homebanner/manage");
      } else {
        toast.error("Unexpected server response");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("🚫 Something went wrong while updating the banner.");
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
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Designation */}
          <FormField
            control={form.control}
            name="designation"
            rules={{ required: "Designation is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author URL */}
          <FormField
            control={form.control}
            name="auther_url"
            rules={{ required: "Author URL is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Author URL</FormLabel>
                <FormControl>
                  <Input placeholder="Author URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Upload Image */}
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
                />
              </FormControl>
              <FormMessage />
              {previousImage && (
                <div className="mt-3">
                  <p className="  text-[var(--rv-gray)]">Previous Image:</p>
                  <img
                    src={previousImage}
                    alt="Previous"
                    className="max-w-xs border rounded mt-2"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          text={!loading ? "Update Banner" : "Loading..."}
        />

        <ToastContainer />
      </form>
    </Form>
  );
}

const EditPost = () => {
  const { id } = useParams();
  return (
    < div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Edit Home Banner</h1>
          <Link href="/admin/manage-homebanner/manage">
            <Button
              text="All Home Banners"
            />
          </Link>
        </div>
        <InputForm postId={id} />
      </div>
    </ div>
  );
};

export default EditPost;
