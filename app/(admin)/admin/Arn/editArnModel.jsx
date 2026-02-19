"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/app/(admin)/ui/form";

import { Input } from "@/app/(admin)/ui/input";
import Button from "@/app/components/Button/Button";

const EditArnModal = ({ onClose, arnData }) => {
  const form = useForm({
    defaultValues: {
      id: "",
      arn: "",
      registrationDate: "",
      expiryDate: "",
      euins: [],
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (arnData) {
      form.reset({
        id: arnData._id,
        arn: arnData.arn || "",
        registrationDate: arnData.registrationDate?.slice(0, 10) || "",
        expiryDate: arnData.expiryDate?.slice(0, 10) || "",
        euins:
          arnData.euins?.map((e) => ({
            euin: e.euin || "",
            registrationDate: e.registrationDate?.slice(0, 10) || "",
            expiryDate: e.expiryDate?.slice(0, 10) || "",
          })) || [],
      });
    }
  }, [arnData, form]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`,
        data
      );

      toast.success("ARN updated successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update ARN!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
      <div className="bg-[var(--rv-bg-white)] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h6 className="font-semibold">Edit ARN</h6>
          <button
            className="text-[var(--rv-red)] text-2xl hover:text-[var(--rv-red-dark)]"
            onClick={onClose}
          >
            <IoCloseSharp />
          </button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="arn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ARN Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter ARN Number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registrationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("euins").map((euin, index) => (
              <div
                key={index}
                className="border rounded-md p-4 bg-[var(--rv-bg-gray-light)] space-y-3"
              >
                <FormField
                  control={form.control}
                  name={`euins.${index}.euin`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EUIN</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter EUIN" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`euins.${index}.registrationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EUIN Registration Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`euins.${index}.expiryDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EUIN Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                onClick={onClose}
                text="Cancel"
                disabled={loading}
              />
              <Button
                type="submit"
                text={loading ? "Updating..." : "Update"}
                disabled={loading}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditArnModal;
