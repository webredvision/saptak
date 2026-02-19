"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoCloseCircle } from "react-icons/io5";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const FeedbackTheme1 = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    designSatisfaction: "",
    onTimeDelivery: "",
    coordinationSatisfaction: "",
    additionalFeedback: "",
    emojiRating: "😍",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmojiClick = (rating) => {
    setFormData({ ...formData, emojiRating: rating });
  };

  const getEmojiText = (emoji) => {
    switch (emoji) {
      case "😡":
        return "Very Dissatisfied";
      case "😞":
        return "Dissatisfied";
      case "😐":
        return "Neutral";
      case "😊":
        return "Satisfied";
      case "😍":
        return "Very Satisfied";
      default:
        return "Not Rated";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    router.push("/thankyou");
  };

  return (
    <div>
      <InnerPage title={"Feedback"} />

      <div className="px-4">
        <div className="relative main-section flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('images/feedback.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.15,
            }}
          ></div>

          <div className="relative bg-[var(--rv-bg-white)] p-6 rounded-xl shadow-lg w-full max-w-xl flex flex-col gap-3 border border-[var(--rv-primary)]">
            <h4 className="text-[var(--rv-primary)] font-semibold">
              Feedback Form
            </h4>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <p className="text-[var(--rv-primary)] font-medium">
                  How satisfied are you with our services overall?
                </p>
                <div className="flex justify-around flex-wrap gap-3">
                  {["😡", "😞", "😐", "😊", "😍"].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className={`text-3xl transition-all ${formData.emojiRating === emoji
                        ? "scale-110 opacity-100"
                        : "opacity-50"
                        }`}
                      style={{
                        color:
                          formData.emojiRating === emoji
                            ? "var(--rv-primary)"
                            : "var(--rv-primary-dark)",
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <p className="text-[var(--rv-primary)] font-medium">
                    Were you satisfied with the website's design and functionality?
                  </p>
                  <div className="flex items-center gap-6">
                    {["Yes", "No"].map((val) => (
                      <label
                        key={val}
                        className="relative flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="radio"
                          name="designSatisfaction"
                          value={val}
                          onChange={handleChange}
                          className="peer hidden"
                        />
                        <span
                          className="w-5 h-5 rounded-full border-2 border-[var(--rv-primary)] flex items-center justify-center transition-all duration-200 peer-checked:bg-[var(--rv-primary)]"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--rv-primary)] scale-0 transition-transform duration-200 peer-checked:scale-100"></span>
                        </span>
                        <span className="peer-checked:text-[var(--rv-primary-dark)] font-medium">
                          {val}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[var(--rv-primary)] font-medium">
                    Was the website delivered on time?
                  </p>
                  <div className="flex items-center gap-6">
                    {["Yes", "No"].map((val) => (
                      <label
                        key={val}
                        className="relative flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="radio"
                          name="onTimeDelivery"
                          value={val}
                          onChange={handleChange}
                          className="peer hidden"
                        />
                        <span
                          className="w-5 h-5 rounded-full border-2 border-[var(--rv-primary)] flex items-center justify-center transition-all duration-200 peer-checked:bg-[var(--rv-primary)]"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--rv-primary)] scale-0 transition-transform duration-200 peer-checked:scale-100"></span>
                        </span>
                        <span className="peer-checked:text-[var(--rv-primary-dark)] font-medium">
                          {val}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[var(--rv-primary)] font-medium">
                    Were you satisfied with coordination and communication?
                  </p>
                  <div className="flex items-center gap-6">
                    {["Yes", "No"].map((val) => (
                      <label
                        key={val}
                        className="relative flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="radio"
                          name="coordinationSatisfaction"
                          value={val}
                          onChange={handleChange}
                          className="peer hidden"
                        />
                        <span
                          className="w-5 h-5 rounded-full border-2 border-[var(--rv-primary)] flex items-center justify-center transition-all duration-200 peer-checked:bg-[var(--rv-primary)]"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--rv-primary)] scale-0 transition-transform duration-200 peer-checked:scale-100"></span>
                        </span>
                        <span className="peer-checked:text-[var(--rv-primary-dark)] font-medium">
                          {val}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>


              <div className="flex flex-col gap-3">
                <label
                  htmlFor="additionalFeedback"
                  className="text-[var(--rv-primary)] font-medium"
                >
                  We would love to hear more from you:
                </label>
                <textarea
                  id="additionalFeedback"
                  name="additionalFeedback"
                  rows="4"
                  className="w-full border border-[var(--rv-bg-primary)] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[var(--rv-bg-primary)] focus:border-[var(--rv-bg-primary)]"
                  placeholder="Your feedback..."
                  value={formData.additionalFeedback}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] px-4 py-2 rounded-lg shadow-md hover:bg-[var(--rv-bg-secondary)] transition duration-200"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50 p-2">
              <div className="bg-[var(--rv-bg-white)] rounded-lg shadow-lg p-5 w-full max-w-md relative border border-[var(--rv-primary-light)]">
                <button
                  className="absolute top-3 right-3 text-[var(--rv-primary)]"
                  onClick={handleClose}
                >
                  <IoCloseCircle size={24} />
                </button>

                <h2 className="   font-bold mb-3 text-center text-[var(--rv-primary)]">
                  Your Feedback Summary
                </h2>
                <ul className="space-y-2">
                  <li>
                    <strong>Design Satisfaction:</strong>{" "}
                    {formData.designSatisfaction || "N/A"}
                  </li>
                  <li>
                    <strong>On Time Delivery:</strong>{" "}
                    {formData.onTimeDelivery || "N/A"}
                  </li>
                  <li>
                    <strong>Coordination Satisfaction:</strong>{" "}
                    {formData.coordinationSatisfaction || "N/A"}
                  </li>
                  <li>
                    <strong>Emoji Rating:</strong>{" "}
                    {getEmojiText(formData.emojiRating)} {formData.emojiRating}
                  </li>
                  <li>
                    <strong>Message:</strong>{" "}
                    {formData.additionalFeedback || "No message"}
                  </li>
                </ul>

                <div className="mt-5 text-center">
                  <button
                    onClick={handleClose}
                    className="hover:bg-[var(--rv-bg-primary)] text-[var(--rv-white)] px-4 py-2 rounded-lg bg-[var(--rv-bg-primary)] transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackTheme1;
