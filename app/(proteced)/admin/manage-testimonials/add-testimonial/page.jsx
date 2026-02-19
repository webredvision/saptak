"use client";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
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

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export function InputForm() {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Validation schema
  const FormSchema = z.object({
    author: z.string().min(2, { message: "Author must be at least 2 characters." }),
    designation: z.string().nonempty({ message: "Designation is required." }),
    image: z.instanceof(File).optional(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      author: "",
      designation: "",
      image: "",
    },
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    setLoading(true);

    // Image validation: max 1MB
    if (selectedImage && selectedImage.size > 1024 * 1024) {
      toast.error("Image size should not exceed 1MB.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (selectedImage) formData.append("image", selectedImage);
    formData.append("author", data.author);
    formData.append("designation", data.designation);
    formData.append("content", content);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/testimonials/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast.success("Testimonial added successfully!");
        form.reset();
        setSelectedImage(null);
        setContent("");
        setTimeout(() => router.push("/admin/manage-testimonials/manage"), 1500);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong while submitting the testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)] shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Author */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Author</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Author"
                      {...field}
                      aria-label="Author"
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designation */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Designation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Designation"
                      {...field}
                      aria-label="Designation"
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedImage(file);
                        field.onChange(file);
                      }
                    }}
                    aria-label="Image"
                    className="border border-[var(--rv-gray)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Jodit Editor */}
          <div className="w-full">
            <FormLabel className="font-semibold">Content</FormLabel>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              onChange={() => {}}
            />
          </div>

          {/* Submit Button */}
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

const AddPost = () => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-5">
          <h6 className="font-semibold text-lg">Add New Testimonial</h6>
          <Link href="/admin/manage-testimonials/manage">
            <Button
              text="All Testimonials"
            />
          </Link>
        </div>
        <InputForm />
      </div>
    </>
  );
};

export default AddPost;
