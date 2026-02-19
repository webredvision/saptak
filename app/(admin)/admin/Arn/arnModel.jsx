"use client";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, useFieldArray } from "react-hook-form";

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

const AddArnModal = ({ onClose }) => {
  // ✅ Setup React Hook Form
  const form = useForm({
    defaultValues: {
      arn: "",
      registrationDate: "",
      expiryDate: "",
      euins: [{ euin: "", registrationDate: "", expiryDate: "" }],
    },
  });

  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "euins",
  });

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`,
        data
      );

      if (res.status === 201) {
        toast.success("ARN created successfully!");
        reset();
        onClose();
      } else {
        toast.error("❌ Failed to save ARN!");
      }
    } catch (error) {
      console.error(error);
      toast.error("🚨 Server error while creating ARN!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
      <div className="bg-[var(--rv-bg-white)] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto shadow-lg relative">
        <ToastContainer />
        <div className="flex justify-between items-center mb-4">
          <h6 className="font-semibold">Add ARN & EUIN</h6>
          <button
            className="text-[var(--rv-red)] text-2xl hover:text-[var(--rv-red-dark)]"
            onClick={onClose}
          >
            <IoCloseSharp />
          </button>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={control}
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
                control={control}
                name="registrationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {fields.map((item, index) => (
              <div
                key={item.id}
                className="border rounded-md p-4 bg-[var(--rv-bg-gray-light)] space-y-3"
              >
                <FormField
                  control={control}
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
                    control={control}
                    name={`euins.${index}.registrationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`euins.${index}.expiryDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    text="Remove EUIN"
                    className="bg-[var(--rv-bg-red-dark)] hover:bg-[var(--rv-bg-red-dark)] text-[var(--rv-white)] rounded-md"
                  />
                )}
              </div>
            ))}

            <div>
              <Button
                type="button"
                onClick={() =>
                  append({ euin: "", registrationDate: "", expiryDate: "" })
                }
                text="+ Add Another EUIN"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={onClose}
                text="Cancel"
              />
              <Button
                type="submit"
                text="Save"
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddArnModal;
