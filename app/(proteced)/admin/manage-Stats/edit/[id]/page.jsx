"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
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
import Loader from "@/app/(admin)/admin/common/Loader";

const StatsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(), 
  description: z.string().optional(),
  statsNumber: z.string().optional(),
  image: z.any().optional(),
});

const EditStats = () => {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const form = useForm({
    resolver: zodResolver(StatsSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      statsNumber: "",
      image: "",
    },
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats/${id}`)
        .then((res) => {
          const data = res?.data?.stat;
          if (!data) return;

          form.setValue("title", data?.title || "");
          form.setValue("subtitle", data?.subtitle || "");
          form.setValue("description", data?.description || "");
          form.setValue("statsNumber", data?.statsNumber || "");

          if (data?.image?.url) {
            setPreviewImage(data.image.url);
          } else if (typeof data?.image === "string") {
            setPreviewImage(data.image);
          }

          setIsDataLoaded(true);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          toast.error("Failed to load stat details.");
        });
    }
  }, [id, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors();
    try {
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size exceeds more than 1MB.",
        });
        toast.error("Please upload an image smaller than 1MB.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("subtitle", data.subtitle || "");
      formData.append("description", data.description || "");
      formData.append("statsNumber", data.statsNumber || "");
      if (selectedImage) formData.append("image", selectedImage);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        toast.success("Stats updated successfully!");
        setTimeout(() => {
          router.push("/admin/manage-Stats/manage");
        }, 1500);
      } else {
        toast.error("Update failed. Unexpected server response.");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (axios.isAxiosError(err)) {
        const { response } = err;
        if (response) {
          toast.error(response.data?.message || `Error ${response.status}`);
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
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h6 className="font-semibold">Edit Stats</h6>
          <Link href="/admin/manage-Stats/manage">
            <Button
              text="All Stats"
            />
          </Link>
        </div>
        {!isDataLoaded ? (
          <Loader />
        ) : (
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
                      <FormLabel className="font-semibold">
                        Stats Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
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
                      <FormLabel className="font-semibold">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
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
                      <FormLabel className="font-semibold">Symbol</FormLabel>
                      <FormControl>
                        <select
                          className="border border-[var(--rv-gray)] rounded-md px-3 py-2 w-full bg-[var(--rv-bg-white)] outline-none"
                          value={field.value || ""}
                          onChange={field.onChange}
                        >
                          <option value="">Select symbol</option>
                          <option value="+">+</option>
                          <option value="$">$</option>
                          <option value="%">%</option>
                          <option value="₹">₹</option>
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
                    <FormLabel className="font-semibold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter description"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="border border-[var(--rv-gray)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Upload Image
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="border border-[var(--rv-gray)]"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                            field.onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {previewImage && (
                <div className="">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-md border border-[var(--rv-gray)] object-cover"
                  />
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  text={
                    loading ? (
                      <>
                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />{" "}
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )
                  }
                />
              </div>
            </form>
          </Form>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default EditStats;
