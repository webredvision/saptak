"use client";
import React, { useRef, useState, useEffect } from "react";
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
  keywords: z.string().optional(),
});

export function InputForm({ postId }) {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
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

  // ✅ Fetch categories
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

  // ✅ Fetch post data for editing
  const fetchPostData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blogs/${postId}`
      );
      if (response.status === 200) {
        const { posttitle, metatitle, description, content, category, image, keywords } =
          response.data.blog;
        form.setValue("posttitle", posttitle);
        form.setValue("metatitle", metatitle);
        form.setValue("description", description);
        form.setValue("category", category);
        form.setValue("keywords", keywords);
        setContent(content);
        setPreviousImage(image?.url || null);
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
      toast.error("Failed to load post data.");
    }
  };

  useEffect(() => {
    fetchCategories();
    if (postId) fetchPostData();
  }, [postId]);

  // ✅ Handle Update
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blogs/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Post updated successfully!");
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
                      placeholder="Description"
                      {...field}
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
                  <FormLabel className="font-semibold">Keywords</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Keywords"
                      {...field}
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
                  <FormLabel className="font-semibold">Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="bg-[var(--rv-bg-gray-light)] border border-[var(--rv-gray)] outline-none rounded-lg w-full p-2.5"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.title}
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
                      className="border border-[var(--rv-gray)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                  {previousImage && (
                    <div className="mt-3">
                      <p className="text-[var(--rv-gray-dark)] mb-1">
                        Previous Image:
                      </p>
                      <img
                        src={previousImage}
                        alt="Previous"
                        className="w-32 rounded-md border border-[var(--rv-gray)]"
                      />
                    </div>
                  )}
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
            />
          </div>

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
    </>
  );
}

const EditPost = () => {
  const { id } = useParams();
  return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h6 className="font-semibold">Edit Post</h6>
          <Link href="/admin/manage-posts/manage">
            <Button
              text={"All Posts"}
            />
          </Link>
        </div>
        <InputForm postId={id} />
      </div>
  );
};

export default EditPost;
