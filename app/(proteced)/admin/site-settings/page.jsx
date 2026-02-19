"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import ArnList from "@/app/(admin)/admin/Arn";
import SocialMediaTable from "@/app/(admin)/admin/SocialMedia/SocialMedialist";

export function InputForm() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      websiteName: "",
      email: "",
      alternateEmail: "",
      mobile: "",
      whatsAppNo: "",
      alternateMobile: "",
      address: "",
      iframe: "",
      mapurl: "",
      websiteDomain: "",
      callbackurl: "",
      appsappleurl: "",
      appsplaystoreurl: "",
      siteurl: "",
      description: "",
    },
  });

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/permissions`
        );

        const data = await res.json();

        const active = data
          .filter((item) => item.enabled)
          .map((item) => item.permission);

        setPermissions(active);
      } catch (err) {
        console.error("Permission Error:", err);
      }
    };

    loadPermissions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`
        );
        if (res.status === 200 && res.data[0]) {
          const data = res.data[0];
          Object.keys(form.getValues()).forEach((key) => {
            if (data[key] !== undefined) {
              form.setValue(key, data[key]);
            }
          });
          if (data?.image?.url) {
            setPreviewImage(data.image.url);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch existing site settings!");
      }
    };
    fetchData();
  }, [form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Site settings saved successfully!");
      } else {
        toast.error("❌ Failed to save data!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("🚨 Server error occurred!");
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
          className="flex flex-col items-start w-full gap-5 rounded-md p-5 bg-[var(--rv-bg-white)] border border-[var(--rv-gray-light)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {[
              ["name", "Enter Name"],
              ["websiteName", "Enter Website Name"],
              ["email", "Email"],
              ["alternateEmail", "Enter Another Email"],
              ["mobile", "Mobile"],
              ["alternateMobile", "Alternate Mobile"],
              ["whatsAppNo", "WhatsApp Number"],
              ["websiteDomain", "Website Domain"],
              ["callbackurl", "Callback URL"],
              ["siteurl", "Site URL"],
              ["appsplaystoreurl", "App Playstore URL"],
              ["appsappleurl", "App iOS URL"],
            ].map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={label} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {permissions.includes("upload_logo") && (
            <>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Upload Site Logo
                    </FormLabel>
                    <FormControl>
                      <Input
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImage(file);
                            field.onChange(file);
                            setPreviewImage(URL.createObjectURL(file));
                          }
                        }}
                        className="border border-[var(--rv-gray)] outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {previewImage && (
                <div>
                  <p className="font-semibold mb-2">Logo Preview:</p>
                  <img
                    src={previewImage}
                    alt="Logo Preview"
                    className="w-52 h-20 object-contain border rounded-md p-2"
                  />
                </div>
              )}
            </>
          )}
          <div className="grid grid-cols-1 gap-4 w-full">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Description" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Address" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mapurl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Map URL" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Iframe URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Map Iframe URL"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            text={
              loading ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" /> Saving...
                </>
              ) : (
                "Submit"
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
      <div className="flex flex-col gap-5">
        <div>
          <h6 className="font-bold mb-4">Site Settings</h6>
          <InputForm />
        </div>

        <ArnList />
        <SocialMediaTable />
      </div>
  );
};

export default AddPost;
