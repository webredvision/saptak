"use client";

import React, { useRef, useState } from "react";
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
import { Input } from "@/app/(admin)/ui/input"; // ✅ fixed import
import Button from "@/app/components/Button/Button";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

const FormSchema = z.object({
  title: z.string().nonempty({ message: "Title is required." }),
  image: z.instanceof(File).optional(),
});

export function InputForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      image: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        toast.error("Image size exceeds 1MB. Please upload a smaller file.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/innerpagebanner/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast.success("Data uploaded successfully!");
        form.reset();
        setSelectedImage(null);

        setTimeout(() => {
          router.push("/admin/manage-innerpagebanner/manage");
        }, 1500);
      } else {
        toast.error("Unexpected server response. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading inner page banner:", err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          toast.error(
            err.response.data?.message ||
            `Server error (${err.response.status}).`
          );
        } else {
          toast.error("Network error. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred.");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Banner Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Title"
                      {...field}
                      aria-label="title"
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    aria-label="Image"
                    className="border border-[var(--rv-gray)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            text={
              !loading ? (
                "Submit"
              ) : (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" /> Submitting...
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
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-5">
          <h6 className="font-semibold ">Add New Inner Banner</h6>
          <Link href="/admin/manage-innerpagebanner/manage">
            <Button text={'All Inner Banner'} />
          </Link>
        </div>
        <InputForm />
      </div>
    </ div>
  );
};

export default AddPost;
