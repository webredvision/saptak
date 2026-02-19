'use client';

import { useEffect, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FaSpinner } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/app/(admin)/ui/form';
import { Input } from '@/app/(admin)/ui/input';
import Button from '@/app/components/Button/Button';

const AddSocialModal = ({ onClose, onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      url: '',
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (editData) {
      form.reset({
        title: editData.title,
        url: editData.url,
      });
    }
  }, [editData, form]);

  // Handle submit
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = editData ? { ...data, id: editData._id } : data;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/SocialMedia`,
        payload
      );

      if (editData && res.status === 200) {
        toast.success('Social media updated successfully');
      } else if (!editData && res.status === 201) {
        toast.success('Social media added successfully');
      } else {
        toast.info('Changes saved');
      }

      onSuccess();
      onClose();

    } catch (err) {
      toast.error('❌ Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
      <div className="bg-[var(--rv-bg-white)] p-5 rounded-lg w-96 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h6 className="font-semibold">{editData ? 'Edit' : 'Add'} Social Media</h6>
          <button
            className="text-[var(--rv-red)] text-2xl hover:text-[var(--rv-red-dark)]"
            onClick={onClose}
          >
            <IoCloseSharp />
          </button>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter social media title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              rules={{
                required: 'URL is required',
                pattern: {
                  value: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([\/\w .-]*)*\/?$/,
                  message: 'Enter a valid URL',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter social media URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <Button
                type="button"
                onClick={onClose}
                text="Cancel"
                className="bg-[var(--rv-bg-gray)] border-[var(--rv-gray)] text-[var(--rv-black)]"
              />

              <Button
                type="submit"
                disabled={loading}
                text={
                  loading ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4 mr-2 inline-block" />
                      Saving...
                    </>
                  ) : (
                    editData ? "Update" : "Save"
                  )
                }
              />
            </div>
          </form>
        </Form>

      </div>
    </div>
  );
};

export default AddSocialModal;
