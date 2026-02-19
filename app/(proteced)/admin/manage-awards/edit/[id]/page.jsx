"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  
import Button from "@/app/components/Button/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(admin)/ui/form";
import { Input } from "@/app/(admin)/ui/input";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Award name must be at least 2 characters." }),
  presentedBy: z.string().nonempty({ message: "Presented By is required." }),
  date: z.string().nonempty({ message: "Date is required." }),
  image: z.instanceof(File).optional(),
});

export function AwardEditForm({ awardId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      presentedBy: "",
      date: "",
    },
  });

  useEffect(() => {
    if (awardId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards/${awardId}`)
        .then((res) => {
          const { name, presentedBy, date, image } = res.data.award || {};
          form.setValue("name", name || "");
          form.setValue("presentedBy", presentedBy || "");
          form.setValue("date", date ? date.substring(0, 10) : "");
          setPreviousImage(image?.url || null);
        })
        .catch((err) => {
          console.error("Error fetching award data:", err);
          toast.error("Failed to load award details.");
        });
    }
  }, [awardId]);

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    // Image size validation (max 1MB)
    if (selectedImage && selectedImage.size > 1024 * 1024) {
      toast.error("Image size should not exceed 1MB.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("presentedBy", data.presentedBy);
    formData.append("date", data.date);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards/${awardId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast.success("Award updated successfully!");
        form.reset();
        setSelectedImage(null);
        setTimeout(() => router.push("/admin/manage-awards/manage"), 1500);
      } else {
        toast.error("Failed to update award!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating the award.");
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
          className="flex flex-col items-start w-full gap-5 rounded-md p-5 bg-[var(--rv-bg-white)] shadow-sm"
        >
          {/* --- Name & Presented By --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Award Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. AUM Excellence Award"
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

          {/* --- Date --- */}
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

          {/* --- Image Upload --- */}
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

                {/* --- Previous Image Preview --- */}
                {previousImage && (
                  <div className="mt-4">
                    <p className="text-[var(--rv-gray)] mb-1">Previous Image:</p>
                    <img
                      src={previousImage}
                      alt="Previous"
                      className="w-32 h-32 object-cover border rounded-md"
                    />
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* --- Submit Button --- */}
          <Button
            type="submit"
            text={
              !loading ? (
                "Update Award"
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

const EditAward = () => {
  const params = useParams();
  const awardId = params.id;

  return (
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-5">
          <h6 className="font-semibold">Edit Award</h6>
          <Link href="/admin/manage-awards/manage">
            <Button
              text={"All Awards"}
            />
          </Link>
        </div>
        <AwardEditForm awardId={awardId} />
      </div>
    </ div>
  );
};

export default EditAward;
