"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { FaSpinner } from "react-icons/fa";
 

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AdminServices = () => {
  const editor = useRef(null);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ question: "", answer: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch FAQs
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/faqs`
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching faqs:", error);
      toast.error("Failed to fetch FAQs.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Add single FAQ
  const handleAddSingleService = async () => {
    if (!newService.question.trim() || !newService.answer.trim()) {
      toast.error("Please fill both question and answer.");
      return;
    }
    try {
      setAdding(true);
      setServices([...services, { ...newService }]);
      setNewService({ question: "", answer: "" });
      toast.success("FAQ added locally!");
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error("An error occurred while adding FAQ.");
    } finally {
      setAdding(false);
    }
  };

  // Save all FAQs
  const handleSaveServices = async () => {
    try {
      setSaving(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/faqs`,
        { services }
      );
      if (response.status === 201) {
        toast.success("FAQs saved successfully!");
      }
    } catch (error) {
      console.error("Error saving FAQs:", error);
      toast.error("An error occurred while saving FAQs.");
    } finally {
      setSaving(false);
    }
  };

  // Delete confirm
  const handleRemoveService = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteIndex(null);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setLoading(true);
      const updatedServices = services.filter((_, i) => i !== deleteIndex);
      setServices(updatedServices);
      setLoading(false);
      setShowConfirm(false);
      setDeleteIndex(null);
      toast.success("FAQ deleted successfully.");
    }
  };

  // Update answer for list
  const handleServiceAnswerChange = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index].answer = value;
    setServices(updatedServices);
  };

  return (
    < div>
      <ToastContainer />
      <div className="flex flex-col items-start w-full gap-5">
        {/* Add FAQ */}
        <div className="flex flex-col items-start w-full gap-5">
          <h6 className="font-semibold">Add FAQ</h6>
          <div className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]">
            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[var(--rv-black-dark)]">Question</label>
                <input
                  type="text"
                  placeholder="Question"
                  className="border p-2 border-[var(--rv-gray)] flex h-10 w-full rounded-md placeholder:text-[var(--rv-gray-dark)] focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600 transition duration-400"
                  value={newService.question}
                  onChange={(e) =>
                    setNewService({ ...newService, question: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[var(--rv-black-dark)]">Answer</label>
                <JoditEditor
                  ref={editor}
                  value={newService.answer}
                  tabIndex={1}
                  onChange={(newContent) =>
                    setNewService({ ...newService, answer: newContent })
                  }
                />
              </div>
            </div>

            <button
              className="text-[var(--rv-white)] bg-[var(--rv-bg-primary)] px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              onClick={handleAddSingleService}
              disabled={adding}
            >
              {adding ? (
                <>
                   <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                  Adding...
                </>
              ) : (
                "Add FAQ"
              )}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col items-start w-full gap-5">
          <h2 className="text-2xl font-semibold">FAQ List</h2>
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]"
            >
              <div className="grid grid-cols-1 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[var(--rv-black-dark)]">Question</label>
                  <input
                    type="text"
                    placeholder="Question"
                    className="border p-2 border-[var(--rv-gray)] flex h-10 w-full rounded-md placeholder:text-[var(--rv-gray-dark)] focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600 transition duration-400"
                    value={service.question}
                    onChange={(e) => {
                      const updatedServices = [...services];
                      updatedServices[index].question = e.target.value;
                      setServices(updatedServices);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[var(--rv-black-dark)]">Answer</label>
                  <JoditEditor
                    value={service.answer}
                    tabIndex={1}
                    onChange={(newContent) =>
                      handleServiceAnswerChange(index, newContent)
                    }
                  />
                </div>
              </div>
              <button
                className="bg-[var(--rv-bg-red-dark)] text-[var(--rv-white)] px-4 py-2 rounded-lg"
                onClick={() => handleRemoveService(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          className="text-[var(--rv-white)] bg-[var(--rv-bg-primary)] px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          onClick={handleSaveServices}
          disabled={saving}
        >
          {saving ? (
            <>
               <FaSpinner className="animate-spin h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            "Save All"
          )}
        </button>
      </div>

      {/* Delete Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this FAQ?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-[var(--rv-bg-red)] text-[var(--rv-white)] rounded flex items-center gap-2"
              >
                {loading ? (
                  <>
                     <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  "OK"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ div>
  );
};

export default AdminServices;
