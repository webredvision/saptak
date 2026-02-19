'use client';
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/ui/form";
import Button from "@/app/components/Button/Button";
  
import { Input } from "@/app/(admin)/ui/input";
import { FaSpinner } from "react-icons/fa";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export function InputForm() {
  const router = useRouter();
  const editor = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { setValue } = form;

  React.useEffect(() => {
    const checkExisting = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus`,
        );
        if (res.status === 200 && res.data?.length > 0) {
          router.push(`/admin/manage-aboutus/about-us/edit/${res.data[0]._id}`);
        }
      } catch (error) {
        console.error("Failed to check About Us data:", error);
      } finally {
        setCheckingExisting(false);
      }
    };
    checkExisting();
  }, [router]);

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors(); // Clear previous inline errors

    try {
      // 🧩 Frontend image size validation
      if (selectedImage && selectedImage.size > 1024 * 1024) { // 1MB
        form.setError("image", {
          type: "manual",
          message: "Image size exceeds more than 1MB.",
        });
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload an image smaller than 1MB.",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast({
          title: "✅ About Us entry created successfully",
        });
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-aboutus/about-us/manage");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to submit",
          description: "Unexpected server response.",
        });
      }
    } catch (error) {
      console.error("❌ Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            form.setError("image", {
              type: "manual",
              message: "Image size exceeds more than 1MB.",
            });
            toast({
              variant: "destructive",
              title: "Upload Error",
              description: data?.message || "Image size exceeds more than 1MB.",
            });
          } else {
            toast({
              variant: "destructive",
              title: `Error ${status}`,
              description: data?.message || "Something went wrong while submitting the form.",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Network Error",
            description: "Unable to reach the server. Please try again later.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Unexpected Error",
          description: error.message || "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {checkingExisting ? null : (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]">
          <div className="w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} className="border border-[var(--rv-gray)] w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <JoditEditor
                      ref={editor}
                      value={field.value}
                      onBlur={(newContent) => setValue("description", newContent)}
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
                    className="border border-[var(--rv-gray)] w-full"
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
          <Button
            type="submit"
            text={!loading ? "Submit" :
              <>
                 <FaSpinner className="animate-spin h-4 w-4 mr-2" /> {" "} Submitting...
              </>
            }
          />
        </form>
      </Form>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

const AddAboutUsPost = () => (
  < div>
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h6 className='font-semibold'>
          Add About Us
        </h6>
        <Link href="/admin/manage-aboutus/about-us/manage">
          <Button text={'Manage About Us'}></Button>
        </Link>
      </div>
      <InputForm />
    </div>
  </ div>
);

export default AddAboutUsPost;
