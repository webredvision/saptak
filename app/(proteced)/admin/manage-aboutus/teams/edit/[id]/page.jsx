"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/ui/form";
import { Input } from "@/app/(admin)/ui/input";
import Button from "@/app/components/Button/Button";
import  div from "@/app/(admin)/admin/Layouts/DefaultLaout";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  designation: z.string().min(1, "Designation is required."),
  experience: z.coerce.number().optional(),
  description: z.string().min(1, "Description is required."),
  image: z.instanceof(File).optional(),
  socialMedia: z
    .array(
      z.object({
        name: z.string().optional(),
        link: z.string().url("Invalid URL").optional(),
      })
    )
    .optional(),
});

export function InputForm({ postId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      designation: "",
      experience: 0,
      description: "",
      socialMedia: [{ name: "", link: "" }],
    },
  });

  useEffect(() => {
    if (postId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams/${postId}`)
        .then((res) => {
          const data = res?.data?.teamMember;
          form.setValue("name", data?.name);
          form.setValue("designation", data?.designation);
          form.setValue("experience", data?.experience || 0);
          form.setValue("description", data?.description);
          form.setValue("socialMedia", data?.socialMedia || [{ name: "", link: "" }]);
          setPreviousImage(data?.image?.url);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [postId]);

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
      formData.append("name", data.name);
      formData.append("designation", data.designation);
      formData.append("experience", String(data.experience));
      formData.append("description", data.description);
      formData.append("socialMedia", JSON.stringify(data.socialMedia));
      if (selectedImage) formData.append("image", selectedImage);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        toast.success("✅ Team member updated successfully!");
        router.push("/admin/manage-aboutus/teams/manage");
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="border border-[var(--rv-gray)]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="designation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Designation</FormLabel>
                  <FormControl>
                    <Input {...field} className="border border-[var(--rv-gray)]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="experience"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Experience (in years)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="border border-[var(--rv-gray)]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Description</FormLabel>
                <FormControl>
                  <JoditEditor value={field.value} onBlur={field.onBlur} onChange={field.onChange} />
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
                <FormLabel className="font-semibold">Upload Image</FormLabel>
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
                {previousImage && (
                  <div className="mt-4">
                    <p className="text-[var(--rv-gray)]">Previous Image:</p>
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

          {form.watch("socialMedia")?.map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <FormField
                name={`socialMedia.${index}.name`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Platform</FormLabel>
                    <FormControl>
                      <Input {...field} className="border border-[var(--rv-gray)]" placeholder="LinkedIn, Twitter..." />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name={`socialMedia.${index}.link`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Link</FormLabel>
                    <FormControl>
                      <Input {...field} className="border border-[var(--rv-gray)]" placeholder="https://..." />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="submit"
            text={
              !loading ? (
                "Update Member"
              ) : (
                <>
                   <FaSpinner className="animate-spin h-4 w-4 mr-2" /> {" "} Updating...
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

const EditTeam = () => {
  const param = useParams();
  const postId = param.id;

  return (
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h6 className="font-semibold">Edit Team Member</h6>
          <Link href="/admin/manage-aboutus/teams/manage">
            <Button
              text={"All Team Members"}
            />
          </Link>
        </div>
        <InputForm postId={postId} />
      </div>
    </ div>
  );
};

export default EditTeam;
