"use client";
import React, { useRef, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
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
import Button from "@/app/components/Button/Button";
import { Input } from "@/app/(admin)/ui/input";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// ✅ Validation Schema
const FormSchema = z.object({
  author: z.string().min(2, { message: "Author must be at least 2 characters." }),
  designation: z.string().nonempty({ message: "Designation is required." }),
  image: z.instanceof(File).optional(),
});

export function InputForm({ postId }) {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousImage, setPreviousImage] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      author: "",
      designation: "",
    },
  });

  // ✅ Fetch data for editing
  useEffect(() => {
    if (postId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/testimonials/${postId}`)
        .then((response) => {
          const { author, designation, content, image } = response.data.testimonial;
          form.setValue("author", author);
          form.setValue("designation", designation);
          setContent(content);
          setPreviousImage(image?.url);
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
          toast.error("Failed to load testimonial details.");
        });
    }
  }, [postId]);

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);

    // Validate image size
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/testimonials/${postId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast.success("Testimonial updated successfully!");
        setTimeout(() => router.push("/admin/manage-testimonials/manage"), 1500);
      } else {
        toast.error("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating the testimonial.");
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
                {previousImage && (
                  <div className="mt-4">
                    <p className="text-[var(--rv-gray)]">Previous Image:</p>
                    <img
                      src={previousImage}
                      alt="Previous"
                      className="max-w-sm rounded border h-auto w-40"
                    />
                  </div>
                )}
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
  const param = useParams();
  const postId = param.id;

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-5">
          <h6 className="font-semibold">Edit Testimonial</h6>
          <Link href="/admin/manage-testimonials/manage">
            <Button
              text="All Testimonials"
            />
          </Link>
        </div>
        <InputForm postId={postId} />
      </div>
    </div>
  );
};

export default EditPost;
