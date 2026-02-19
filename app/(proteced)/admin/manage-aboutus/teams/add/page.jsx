"use client";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/ui/form";
import Button from "@/app/components/Button/Button";
import { FaSpinner } from "react-icons/fa";
  
import { Input } from "@/app/(admin)/ui/input";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  name: z.string().nonempty("Name is required."),
  designation: z.string().nonempty("Designation is required."),
  experience: z.coerce.number().min(0, "Experience must be a positive number."),
  description: z.string().nonempty("Description is required."),
  image: z.any().optional(),
  socialMedia: z
    .array(
      z.object({
        name: z.optional(),
        link: z.optional(),
      })
    )
    .optional(),
});

const TeamForm = () => {
  const editor = useRef(null);
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      designation: "",
      experience: 0,
      description: "",
      image: "",
      socialMedia: [{ name: "", link: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialMedia",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors();
    try {
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size exceeds more than 1MB.",
        });
        toast.error("Image size exceeds 1MB. Please upload a smaller file.");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("designation", data.designation);
      formData.append("experience", data.experience.toString());
      formData.append("description", data.description);
      if (selectedImage) formData.append("image", selectedImage);
      formData.append("socialMedia", JSON.stringify(data.socialMedia));
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
     if (res.status === 201) {
        toast.success("Team member added successfully!");
        form.reset();
        setDescription("");
        setSelectedImage(null);
        router.push("/admin/manage-aboutus/teams/manage");
      } else {
        toast.error("Submission failed. Unexpected server response.");
      }
    } catch (error) {
      console.error("❌ Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            toast.error(data?.message || "Image too large.");
          } else {
            toast.error(`Error ${status}: ${data?.message || "Server error."}`);
          }
        } else {
          toast.error("Network error. Please try again later.");
        }
      } else {
        toast.error(error.message || "An unexpected error occurred.");
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
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
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
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Designation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter designation"
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
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Experience (Years)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Years of experience"
                      {...field}
                      className="border border-[var(--rv-gray)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <JoditEditor
                    ref={editor}
                    value={description}
                    onBlur={(newContent) => {
                      setDescription(newContent);
                      form.setValue("description", newContent);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <div className="flex flex-col gap-5 w-full items-start">
            <FormLabel className="font-semibold">Social Media Links</FormLabel>
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center w-full"
              >
                <FormField
                  control={form.control}
                  name={`socialMedia.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Platform (e.g., LinkedIn)"
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
                  name={`socialMedia.${index}.link`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="URL"
                          {...field}
                          className="border border-[var(--rv-gray)]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-[var(--rv-bg-red-dark)] border-[var(--rv-red)] text-[var(--rv-white)] w-fit"
                  text={"Remove"}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ name: "", link: "" })}
              text={" + Add Social Link"}
            />
          </div>

          <Button
            type="submit"
            text={
              !loading ? (
                "Save"
              ) : (
                <>
                   <FaSpinner className="animate-spin h-4 w-4 mr-2" /> Saving...
                </>
              )
            }
          />
        </form>
      </Form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

const AddPost = () => {
  return (
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h6 className="font-semibold">Add Team Member</h6>
          <Link href="/admin/manage-aboutus/teams/manage">
            <Button
              text={"All Team Members"}
            />
          </Link>
        </div>
        <TeamForm />
      </div>
    </ div>
  );
};

export default AddPost;
