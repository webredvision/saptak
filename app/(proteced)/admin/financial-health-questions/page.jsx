"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
 
import { FaSpinner } from "react-icons/fa";

const FinancialHealthQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [editedQuestion, setEditedQuestion] = useState({});
  const [loadingEdit, setLoadingEdit] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState({});

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealth`);
      setQuestions(res.data);
      const anyEnabled = res.data.some((q) => q.status === true);
      setIsEnabled(anyEnabled);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleToggle = async () => {
    try {
      const newStatus = !isEnabled;
      await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealth/status`, { status: newStatus });
      setIsEnabled(newStatus);
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleEdit = async (question) => {
    setLoadingEdit((prev) => ({ ...prev, [question._id]: true }));

    setTimeout(() => {
      setEditMode((prev) => ({
        ...prev,
        [question._id]: !prev[question._id],
      }));
      setEditedQuestion((prev) => ({
        ...prev,
        [question._id]: question.question,
      }));
      setLoadingEdit((prev) => ({ ...prev, [question._id]: false }));
    }, 400); // small delay just for UX feel
  };

  const handleUpdate = async (question) => {
    setLoadingUpdate((prev) => ({ ...prev, [question._id]: true }));

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealth/${question._id}`, {
        question: editedQuestion[question._id],
      });

      setEditMode((prev) => ({ ...prev, [question._id]: false }));
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update question", err);
    } finally {
      setLoadingUpdate((prev) => ({ ...prev, [question._id]: false }));
    }
  };

  return (
    < div>
      <div className="flex flex-col gap-5">
        {/* Header Toggle */}
        <div className="flex justify-between items-center ">
          <h6 className="font-bold">Financial Health Questions</h6>
          <div className="flex items-center gap-3">
            <span className="  font-medium text-[var(--rv-gray-dark)]">Toggle</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled}
                onChange={handleToggle}
              />
              <div
                className={`w-14 h-7 rounded-full peer transition-colors duration-300 ${isEnabled ? "bg-[var(--rv-bg-green)]" : "bg-[var(--rv-bg-red)]"
                  }`}
              ></div>
              <div
                className={`absolute left-1 top-1 w-5 h-5 bg-[var(--rv-bg-white)] rounded-full transition-transform duration-300 ${isEnabled ? "translate-x-7" : "translate-x-0"
                  }`}
              ></div>
            </label>
            <span
              className={`  font-semibold ${isEnabled ? "text-[var(--rv-green-dark)]" : "text-[var(--rv-red-dark)]"
                }`}
            >
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {isEnabled ? (
          questions.map((question, index) => {
            const isEditing = editMode[question._id] || false;
            const questionText = editedQuestion[question._id] ?? question.question;
            const isEditLoading = loadingEdit[question._id];
            const isUpdateLoading = loadingUpdate[question._id];

            return (
              <div
                key={question._id}
                className="p-4 border border-[var(--rv-gray)] rounded shadow-sm bg-[var(--rv-bg-white)]"
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold">Question {index + 1}</label>
                  <button
                    className={`bg-[var(--rv-bg-primary)] text-[var(--rv-white)] py-2 px-4 rounded-md   transition ${isEditLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[var(--rv-bg-primary)]"
                      }`}
                    onClick={() => handleEdit(question)}
                    disabled={isEditLoading || isUpdateLoading}
                  >
                    {isEditLoading ? "Loading..." : isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <input
                  type="text"
                  value={questionText}
                  onChange={(e) =>
                    setEditedQuestion((prev) => ({
                      ...prev,
                      [question._id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 mt-1 mb-2 border border-[var(--rv-gray)] rounded"
                  disabled={!isEditing || isUpdateLoading}
                />

                {isEditing && (
                  <button
                    className={`mt-4 bg-[var(--rv-bg-primary)] text-[var(--rv-white)] px-4 py-2 rounded transition ${isUpdateLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[var(--rv-bg-primary)]"
                      }`}
                    onClick={() => handleUpdate(question)}
                    disabled={isUpdateLoading}
                  >
                    {isUpdateLoading ?
                      <div className="flex items-center gap-1">
                         <FaSpinner className="animate-spin h-4 w-4 mr-2" /> {""} Saving...
                      </div>
                      : "Update"}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>Financial Health questions are currently disabled.</p>
        )}
      </div>
    </ div>
  );
};

export default FinancialHealthQuestions;
