"use client";

import { useEffect, useState } from "react";
 
import Loader from "@/app/(admin)/admin/common/Loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    googleAnalyticsId: "",
    microsoftClarityId: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/analytics`,
          {
            cache: "no-store",
          }
        );
        const json = await res.json();

        if (json.success && json.analytics) {
          setAnalytics({
            googleAnalyticsId: json.analytics.googleAnalyticsId || "",
            microsoftClarityId: json.analytics.microsoftClarityId || "",
          });
          setIsEditing(true);
        } else {
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnalytics((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/analytics`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(analytics),
        }
      );
      const json = await res.json();

      if (json.success) {
        toast.success(
          isEditing
            ? "Analytics updated successfully!"
            : "Analytics created successfully!"
        );
        setIsEditing(true);
      } else {
        toast.error(json.message || "Failed to save data");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving analytics data");
    }
  };

  if (loading)
    return (
      < div>
        <Loader />
        <ToastContainer position="top-right" />
      </ div>
    );

  return (
    < div>
      {/* Toastify container – global for this page */}
      <ToastContainer position="top-right" />

      <div className="">
        <h1 className="text-2xl font-bold text-center mb-6">
          Analytics Settings
        </h1>
        <div className="bg-[var(--rv-bg-white)] shadow border border-[var(--rv-gray)] rounded-lg p-6">
          <div className="mb-5">
            <label className="block mb-1 font-medium">Google Analytics ID</label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={analytics.googleAnalyticsId}
              onChange={handleChange}
              placeholder="e.g. G-XXXXXXX"
              className="border border-[var(--rv-gray)] px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-[var(--rv-bg-primary)] outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-1 font-medium">Microsoft Clarity ID</label>
            <input
              type="text"
              name="microsoftClarityId"
              value={analytics.microsoftClarityId}
              onChange={handleChange}
              placeholder="e.g. abcd1234xyz"
              className="border border-[var(--rv-gray)] px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-[var(--rv-bg-primary)] outline-none"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] px-6 py-2 rounded-md hover:bg-[var(--rv-bg-primary)] transition"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </ div>
  );
}
