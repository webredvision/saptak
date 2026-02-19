"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
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
import { FaSpinner } from "react-icons/fa";
import Button from "@/app/components/Button/Button";

const FormSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(), // symbol
  description: z.string().optional(),
  statsNumber: z.string().optional(),
  image: z.any().optional(),
});

const StatsForm = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      subtitle: "", // default: no symbol
      description: "",
      statsNumber: "",
      image: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors();

    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.subtitle) formData.append("subtitle", data.subtitle);
    if (data.description) formData.append("description", data.description);
    if (data.statsNumber) formData.append("statsNumber", data.statsNumber.toString());
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        toast.success("Stats added successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-Stats/manage");
      } else {
        toast.error("Failed to submit stats!");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          form.setError("image", {
            type: "manual",
            message: "Image size exceeds 1MB.",
          });
          toast.error("Image size exceeds 1MB.");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Something went wrong while submitting."
          );
        }
      } else {
        toast.error("Unexpected error occurred!");
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
          className="flex flex-col gap-5 bg-[var(--rv-bg-white)] p-4 rounded-md shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="statsNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stats Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number"
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <select
                      className="border border-[var(--rv-gray)] rounded-md px-3 py-2 w-full bg-[var(--rv-bg-white)] outline-none"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="">Select symbol</option>
                      <option value="+">+</option>
                      <option value="$">$</option>
                      <option value="%">%</option>
                      <option value="?">?</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter description"
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
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="border border-[var(--rv-gray)]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(file);
                        field.onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
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
          </div>
        </form>
      </Form>
      <ToastContainer />
    </>
  );
};

const AddStats = () => {
  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h6 className="font-semibold">Add Stats</h6>
          <Link href="/admin/manage-Stats/manage">
            <Button
              text={"All Stats"}
            />
          </Link>
        </div>
        <StatsForm />
      </div>
    </div>
  );
};

export default AddStats;

