"use client";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import dynamic from "next/dynamic";
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
 
import Loader from "@/app/(admin)/admin/common/Loader";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  mission: z.string().nonempty({ message: "Mission is required." }),
  vision: z.string().nonempty({ message: "Vision is required." }),
  values: z.string().nonempty({ message: "Values are required." }),
});

export function MissionVisionForm() {
  const editor = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mission: "",
      vision: "",
      values: "",
    },
  });

  // ✅ Fetch existing mission/vision data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/mission-vision`
        );
        if (response.data) {
          form.reset({
            mission: response.data.mission || "",
            vision: response.data.vision || "",
            values: response.data.values || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch mission/vision:", error);
        toast.error("❌ Failed to fetch data. Please try again later.");
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [form]);

  // ✅ Handle form submit
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/mission-vision`,
        data
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Mission & Vision saved successfully!");
        form.reset(data);
      } else {
        toast.error("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error saving mission/vision:", error);
      toast.error("🚨 Server Error: Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <Loader />;

  return (
    <>
      <ToastContainer/>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]"
        >
          {/* Mission */}
          <FormField
            control={form.control}
            name="mission"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Mission</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Mission"
                    {...field}
                    className="border border-[var(--rv-gray)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vision */}
          <FormField
            control={form.control}
            name="vision"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Vision</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Vision"
                    {...field}
                    className="border border-[var(--rv-gray)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Values (with Jodit) */}
          <FormField
            control={form.control}
            name="values"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Values</FormLabel>
                <FormControl>
                  <div className="border border-[var(--rv-gray)] rounded overflow-hidden">
                    <JoditEditor
                      ref={editor}
                      value={field.value}
                      onBlur={(newContent) => field.onChange(newContent)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
    </>
  );
}

const AddMissionVisionPage = () => {
  return (
    < div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between gap-5 items-center">
          <h6 className="font-semibold">
            Add / Update Mission, Vision & Values
          </h6>
        </div>
        <MissionVisionForm />
      </div>
    </ div>
  );
};

export default AddMissionVisionPage;
