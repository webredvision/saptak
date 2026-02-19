"use client";
import React, { useRef, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import dynamic from "next/dynamic";
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
import { FaSpinner } from "react-icons/fa";
import  div from "@/app/(admin)/admin/Layouts/DefaultLaout";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  image: z.any().optional(),
});

export function AboutUsForm({ aboutId }) {
  const router = useRouter();
  const editor = useRef(null);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousImage, setPreviousImage] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: "" },
  });

  // ✅ Fetch existing About Us data
  useEffect(() => {
    if (!aboutId) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus/${aboutId}`)
      .then((response) => {
        const { title, description, image } = response.data.about;
        form.setValue("title", title);
        setDescription(description || "");
        setPreviousImage(image?.url || null);
      })
      .catch((error) => {
        console.error("Error fetching About Us data:", error);
        toast.error("Failed to fetch About Us data ❌");
      });
  }, [aboutId]);

  // ✅ Form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size exceeds 1MB.",
        });
        toast.error("🚫 Image size exceeds 1MB.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", description);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus/${aboutId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("✅ About Us updated successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-aboutus/about-us/manage");
      } else {
        toast.error("⚠️ Unexpected server response. Try again.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong while updating.";
      toast.error(`🚨 ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer/>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]"
        >
          <div className="grid grid-cols-1 gap-5 w-full">
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
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                  {previousImage && (
                    <div className="mt-4">
                      <p className="  text-[var(--rv-gray)]">Previous Image:</p>
                      <img
                        src={previousImage}
                        alt="Previous"
                        className="max-w-sm rounded border-[var(--rv-gray)] border h-auto w-40"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormLabel className="font-semibold">Description</FormLabel>
            <JoditEditor
              ref={editor}
              value={description}
              tabIndex={1}
              onBlur={(newContent) => setDescription(newContent)}
            />
          </div>

          <Button
            type="submit"
            text={
              !loading ? (
                "Update"
              ) : (
                <>
                   <FaSpinner className="animate-spin h-4 w-4 mr-2" /> Updating...
                </>
              )
            }
          />
        </form>
      </Form>
    </>
  );
}

const EditAboutUs = () => {
  const param = useParams();
  const aboutId = param.id;

  return (
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-5">
          <h6 className="font-semibold">Edit About Us</h6>
          <Link href="/admin/manage-aboutus/about-us/manage">
            <Button
              text={"All Entries"}
            />
          </Link>
        </div>
        <AboutUsForm aboutId={aboutId} />
      </div>
    </ div>
  );
};

export default EditAboutUs;
