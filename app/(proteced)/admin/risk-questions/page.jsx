"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/(admin)/ui/dialog";
import { FaSpinner } from "react-icons/fa";
import Button from "@/app/components/Button/Button";

const RiskQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNewStatus, setPendingNewStatus] = useState(null);

  const [editMode, setEditMode] = useState({});
  const [editedQuestion, setEditedQuestion] = useState({});
  const [editedAnswers, setEditedAnswers] = useState({});

  const [editLoading, setEditLoading] = useState({});
  const [updateLoading, setUpdateLoading] = useState({});

  // ✅ Fetch Questions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/risk-questions`
      );
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

  // ✅ Toggle with Confirmation
  const handleToggle = () => {
    const newStatus = !isEnabled;
    setPendingNewStatus(newStatus);
    setShowConfirmDialog(true);
  };

  const performToggle = async (confirm) => {
    if (!confirm) {
      setShowConfirmDialog(false);
      setPendingNewStatus(null);
      return;
    }

    try {
      setIsToggling(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/risk-questions/status`,
        { status: pendingNewStatus }
      );
      setIsEnabled(pendingNewStatus);
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. See console for details.");
    } finally {
      setIsToggling(false);
      setShowConfirmDialog(false);
      setPendingNewStatus(null);
    }
  };

  // ✅ Update Question + Answers
  const handleUpdate = async (question) => {
    const id = question._id;
    setUpdateLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/risk-questions/${id}`,
        {
          question: editedQuestion[id],
          answers: editedAnswers[id],
        }
      );
      setEditMode((prev) => ({ ...prev, [id]: false }));
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to update question and answers", err);
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      <div className="">
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-md py-6 px-6 bg-[var(--rv-bg-white)]">
            <DialogHeader>
              <DialogTitle>
                {pendingNewStatus ? "Enable Risk Questions" : "Disable Risk Questions"}
              </DialogTitle>
              <DialogDescription className="mt-2 text-[var(--rv-gray-dark)]">
                {pendingNewStatus
                  ? "Are you sure you want to ENABLE risk questions?"
                  : "Are you sure you want to DISABLE risk questions? Existing data might be affected."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => performToggle(false)}
                disabled={isToggling}
                text={'No'}
                className={'text-[var(--rv-black)] bg-[var(--rv-bg-gray)] border-[var(--rv-gray)]'}
              />
              <Button
                onClick={() => performToggle(true)}
                disabled={isToggling}
                text={
                  <>
                    {isToggling && (
                       <FaSpinner className="animate-spin h-4 w-4 mr-2 inline" />
                    )}
                    Yes
                  </>
                }
              />
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex justify-between items-center mb-4">
          <h6 className="font-semibold">Risk Questions</h6>
          <div className="flex items-center gap-3">
            <span className="  font-medium text-[var(--rv-gray-dark)]">Toggle</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled}
                onChange={handleToggle}
                disabled={isToggling}
              />
              <div
                className={`w-14 h-7 rounded-full transition-all duration-300 ${isEnabled ? "bg-[var(--rv-bg-primary)]" : "bg-[var(--rv-bg-red)]"
                  } ${isToggling ? "opacity-60 cursor-not-allowed" : ""}`}
              ></div>
              <div
                className={`absolute left-1 top-1 w-5 h-5 bg-[var(--rv-bg-white)] rounded-full transition-transform duration-300 ${isEnabled ? "translate-x-7" : "translate-x-0"
                  }`}
              ></div>
            </label>
            <span
              className={`  font-semibold ${isEnabled ? "text-[var(--rv-primary)]" : "text-[var(--rv-red-dark)]"
                }`}
            >
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {isEnabled ? (
          questions.map((question, index) => {
            const id = question._id;
            const isEditing = editMode[id] || false;
            const isUpdating = updateLoading[id] || false;
            const questionText = editedQuestion[id] ?? question.question;
            const answers = editedAnswers[id] ?? question.answers;

            return (
              <div
                key={id}
                className="mb-5 p-4 border border-[var(--rv-gray)] rounded shadow-sm bg-[var(--rv-bg-white)]"
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold">Question {index + 1}</label>
                  <Button
                    onClick={() => {
                      setEditLoading((prev) => ({ ...prev, [id]: true }));
                      setTimeout(() => {
                        setEditMode((prev) => ({
                          ...prev,
                          [id]: !isEditing,
                        }));
                        setEditedQuestion((prev) => ({
                          ...prev,
                          [id]: question.question,
                        }));
                        setEditedAnswers((prev) => ({
                          ...prev,
                          [id]: [...question.answers],
                        }));
                        setEditLoading((prev) => ({ ...prev, [id]: false }));
                      }, 300);
                    }}
                    disabled={editLoading[id] || isUpdating}
                    text={editLoading[id] ? (
                      <>
                         <FaSpinner className="animate-spin h-4 w-4 mr-2 inline" />
                        Loading...
                      </>
                    ) : isEditing ? (
                      "Cancel"
                    ) : (
                      "Edit"
                    )}
                  />
                </div>

                <input
                  type="text"
                  value={questionText}
                  onChange={(e) =>
                    setEditedQuestion((prev) => ({
                      ...prev,
                      [id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 mt-1 mb-2 border border-[var(--rv-gray)] rounded"
                  disabled={!isEditing}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {answers.map((answer, idx) => (
                    <div key={idx} className="border border-[var(--rv-gray)] p-3 rounded">
                      <label className="  font-medium text-[var(--rv-gray-dark)]">
                        Answer {idx + 1}
                      </label>
                      <input
                        type="text"
                        value={answer.text}
                        onChange={(e) =>
                          setEditedAnswers((prev) => {
                            const updated = [...answers];
                            updated[idx] = { ...updated[idx], text: e.target.value };
                            return { ...prev, [id]: updated };
                          })
                        }
                        className="w-full p-2 mt-1 border border-[var(--rv-gray)] rounded"
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <Button
                    onClick={() => handleUpdate(question)}
                    disabled={isUpdating}
                    text={isUpdating ? (
                      <>
                         <FaSpinner className="animate-spin h-4 w-4 mr-2 inline" />
                        Saving...
                      </>
                    ) : (
                      "Update"
                    )}
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="">
            Risk questions are currently disabled.
          </p>
        )}
      </div>
    </>
  );
};

export default RiskQuestions;
