"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/ui/form";
import { Input } from "@/app/(admin)/ui/input";
import Button from "@/app/components/Button/Button";
 
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Zod schema validation
const FormSchema = z.object({
  name: z.string().min(2, { message: "Award name must be at least 2 characters." }),
  presentedBy: z.string().nonempty({ message: "Presented By is required." }),
  date: z.string().nonempty({ message: "Date is required." }),
  image: z.instanceof(File).optional(),
});

export function AwardInputForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      presentedBy: "",
      date: "",
      image: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    // ✅ Validate image size (max 1MB)
    if (selectedImage && selectedImage.size > 1024 * 1024) {
      toast.error("Image size should not exceed 1MB.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (selectedImage) formData.append("image", selectedImage);
    formData.append("name", data.name);
    formData.append("presentedBy", data.presentedBy);
    formData.append("date", data.date);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast.success("Award added successfully!");
        form.reset();
        setSelectedImage(null);
        setTimeout(() => router.push("/admin/manage-awards/manage"), 1500);
      } else {
        toast.error("Failed to submit award!");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong while submitting the award.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-5 bg-[var(--rv-bg-white)] shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Award Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Award Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. AUM Growth Excellence Award"
                      {...field}
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Presented By */}
            <FormField
              control={form.control}
              name="presentedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Presented By</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. ICICI Prudential AMC"
                      {...field}
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Award Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border border-[var(--rv-gray)]" />
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
                <FormLabel className="font-semibold">Upload Award Image</FormLabel>
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
              </FormItem>
            )}
          />

          {/* Submit Button */}
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

const AddAward = () => {
  return (
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-5">
          <h6 className="font-semibold">Add New Award</h6>
          <Link href="/admin/manage-awards/manage">
            <Button
              text={"All Awards"}
            />
          </Link>
        </div>
        <AwardInputForm />
      </div>
    </ div>
  );
};

export default AddAward;
