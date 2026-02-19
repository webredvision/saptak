"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import FeedbackTheme1 from "./Feedback/feedback-theme1.jsx";
import FeedbackTheme2 from "./Feedback/feedback-theme2.jsx";
import FeedbackTheme3 from "./Feedback/feedback-theme3.jsx";
import FeedbackTheme4 from "./Feedback/feedback-theme4.jsx";
import FeedbackTheme5 from "./Feedback/feedback-theme5.jsx";

const themeMap = {
  theme1: FeedbackTheme1,
  theme2: FeedbackTheme2,
  theme3: FeedbackTheme3,
  theme4: FeedbackTheme4,
  theme5: FeedbackTheme5,
};

export default function Feedback() {
  const { theme } = useTheme();
  const ThemedFeedback = themeMap[theme] || FeedbackTheme1;

  return <ThemedFeedback />;
}
