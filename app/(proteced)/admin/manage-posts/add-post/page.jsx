"use client";
import React, { useRef, useState, useEffect } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  posttitle: z
    .string()
    .min(2, { message: "Post title must be at least 2 characters." }),
  metatitle: z.string().nonempty({ message: "Meta Title is required." }),
  description: z.string().nonempty({ message: "Description is required." }),
  image: z.instanceof(File).optional(),
  category: z.string().nonempty({ message: "Please select a category." }),
});

export function InputForm() {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      posttitle: "",
      metatitle: "",
      description: "",
      keywords: "",
      category: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    if (selectedImage && selectedImage.size > 1024 * 1024) {
      toast.error("Image size exceeds 1MB. Please upload a smaller file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (selectedImage) formData.append("image", selectedImage);
    formData.append("posttitle", data.posttitle);
    formData.append("metatitle", data.metatitle);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("keywords", data.keywords || "");
    formData.append("content", content);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blogs/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("Post uploaded successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-posts/manage");
      } else {
        toast.error("Unexpected server response. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          toast.error(
            `Error ${err.response.status}: ${
              err.response.data?.message || "Server error"
            }`
          );
        } else {
          toast.error("Network Error. Please try again later.");
        }
      } else {
        toast.error(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category/`
      );
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <ToastContainer />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Post Title */}
            <FormField
              control={form.control}
              name="posttitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Post Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Post Title"
                      {...field}
                      aria-label="Post Title"
                      className="border border-[var(--rv-gray)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meta Title */}
            <FormField
              control={form.control}
              name="metatitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Meta Title"
                      {...field}
                      aria-label="Meta Title"
                      className="border border-[var(--rv-gray)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Post Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Description"
                      {...field}
                      aria-label="Description"
                      className="border border-[var(--rv-gray)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Keywords */}
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Post Keyword</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Keywords"
                      {...field}
                      aria-label="Keywords"
                      className="border border-[var(--rv-gray)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Select Category
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="bg-[var(--rv-bg-gray-light)] border border-[var(--rv-gray)] outline-none text-[var(--rv-gray-dark)] rounded-lg focus:ring-blue-500 focus:border-[var(--rv-blue)] block w-full p-2.5"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
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
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                          field.onChange(file);
                        }
                      }}
                      aria-label="Image"
                      className="border border-[var(--rv-gray)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              onChange={() => {}}
              className="w-full"
            />
          </div>

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
    </>
  );
}

const AddPost = () => {
  return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h6 className="font-semibold">Add Post</h6>
          <Link href="/admin/manage-posts/manage">
            <Button
              text={"All Posts"}
            />
          </Link>
        </div>
        <InputForm />
      </div>
  );
};

export default AddPost;
