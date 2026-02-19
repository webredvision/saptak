"use client";

import React, { useState, useEffect } from "react";
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
import Button from "@/app/components/Button/Button";

import { FaSpinner } from "react-icons/fa";
import { Input } from "@/app/(admin)/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Validation schema
const FormSchema = z.object({
  image: z.instanceof(File).optional(),
  category: z.string().nonempty({ message: "Please select a category." }),
});

export function InputForm() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: null,
      category: "",
    },
  });

  // ✅ Fetch gallery categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory`
      );
      if (res.status === 200) setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories. Please try again.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Submit handler
  const onSubmit = async (data) => {
    if (!selectedImage) {
      form.setError("image", { message: "Please select an image." });
      toast.error("Please select an image before submitting.");
      return;
    }

    if (selectedImage.size > 1 * 1024 * 1024) {
      form.setError("image", { message: "Image size must be under 1 MB." });
      toast.error("Image size exceeds 1 MB limit.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("category", data.category);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallery`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        toast.success("Image uploaded successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-gallery/manage");
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.error ||
        "Something went wrong while uploading.";
      form.setError("root", { type: "manual", message: apiMessage });
      toast.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 bg-[var(--rv-bg-white)] p-5 rounded-md shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[var(--rv-gray-dark)]">
                    Select Category
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="bg-[var(--rv-bg-gray-light)] border border-[var(--rv-gray)] text-[var(--rv-gray-dark)] rounded-lg focus:ring-blue-500 focus:border-[var(--rv-blue)] block w-full p-2.5"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[var(--rv-gray-dark)]">
                    Upload Image
                  </FormLabel>
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
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-fit"
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

          {/* Root-level error message */}
          {form.formState.errors.root && (
            <p className="text-[var(--rv-red)] mt-2">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
    </>
  );
}

// ✅ Page wrapper
const AddPost = () => {
  return (
    < div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Add New Gallery Image</h1>
          <Link href="/admin/manage-gallery/manage">
            <Button
              text="All Gallery Images"
            />
          </Link>
        </div>
        <InputForm />
      </div>
    </ div>
  );
};

export default AddPost;
