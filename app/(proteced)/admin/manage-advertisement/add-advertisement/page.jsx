"use client";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
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
 
import { FaSpinner } from "react-icons/fa";

export function InputForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const FormSchema = z.object({
    link: z.string().nonempty({ message: "Link is required." }),
    image: z.instanceof(File).optional(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      link: "",
      image: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    if (selectedImage && selectedImage.size > 1024 * 1024) {
      toast.error("Image too large. Please select an image smaller than 1MB.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (selectedImage) formData.append("image", selectedImage);
    formData.append("link", data.link);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/advertisement/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("Advertisement uploaded successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-advertisement/manage");
      } else {
        toast.error("Something went wrong. Please try again.");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Link Field */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter link"
                      {...field}
                      aria-label="link"
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
      <ToastContainer/>
    </>
  );
}

const AddPost = () => {
  return (
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-5">
          <h1 className="font-bold text-2xl">Add New Advertisement</h1>
          <Link href="/admin/manage-advertisement/manage">
            <Button
              text={"All Advertisement"}
            />
          </Link>
        </div>
          <InputForm />
      </div>
    </ div>
  );
};

export default AddPost;
