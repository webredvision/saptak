"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
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
  link: z.string().nonempty({ message: "Link is required." }),
  image: z.instanceof(File).optional(),
});

export function InputForm({ postId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { link: "" },
  });

  useEffect(() => {
    if (postId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/advertisement/${postId}`)
        .then((response) => {
          const { link, image } = response.data.advertisement;
          form.setValue("link", link);
          setPreviousImage(image?.url);
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
          toast.error("Failed to load advertisement data.");
        });
    }
  }, [postId, form]);
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/advertisement/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Advertisement updated successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-advertisement/manage");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating advertisement:", error);
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
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)] shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
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

                {previousImage && (
                  <div className="mt-4">
                    <p className="text-[var(--rv-gray)] mb-1">Previous Image:</p>
                    <img
                      src={previousImage}
                      alt="Previous"
                      className="max-w-sm rounded border border-[var(--rv-gray)] h-auto w-40"
                    />
                  </div>
                )}
              </FormItem>
            )}
          />

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
      <ToastContainer />
    </>
  );
}

const EditPost = () => {
  const params = useParams();
  const postId = params.id;

  return (
    < div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Edit Advertisement</h1>
          <Link href="/admin/manage-advertisement/manage">
            <Button
              text="All Advertisement"
            />
          </Link>
        </div>
        <InputForm postId={postId} />
      </div>
    </ div>
  );
};

export default EditPost;
