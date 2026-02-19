"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
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
 
import { FaSpinner } from "react-icons/fa";

export function InputForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      image: "",
      designation: "",
      auther_url: "",
    },
  });

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
      if (data.auther_url) formData.append("auther_url", data.auther_url);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("✅ Data uploaded successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-homebanner/manage");
      } else {
        toast.error("Unexpected server response");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("🚫 Something went wrong while uploading the banner.");
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
          {/* Banner Title */}
          <FormField
            control={form.control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Banner Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    className=""
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
            rules={{ required: "Designation is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Designation</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Designation"
                    {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author URL */}
          <FormField
            control={form.control}
            name="auther_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Author URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Author URL"
                    {...field}
                    className=""
                  />
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
                  className=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          text={!loading ? "Submit" :
            <>
               <FaSpinner className="animate-spin h-4 w-4 mr-2" /> {" "} Submitting...
            </>
          }
        />

        <ToastContainer />
      </form>
    </Form>
  );
}

const AddPost = () => {
  return (
    < div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center gap-4">
          <h6 className="font-semibold">Add New Home Banner</h6>
          <Link href="/admin/manage-homebanner/manage">
            <Button text={'All Home Banners'}>
            </Button>
          </Link>
        </div>
        <InputForm />
      </div>
    </ div>
  );
};

export default AddPost;
