"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import GoalQuestionsTheme1 from "./goalquestions-theme1.jsx";
import GoalQuestionsTheme2 from "./goalquestions-theme2.jsx";
import GoalQuestionsTheme3 from "./goalquestions-theme3.jsx";
import GoalQuestionsTheme4 from "./goalquestions-theme4.jsx";
import GoalQuestionsTheme5 from "./goalquestions-theme5.jsx";

const aboutMap = {
  theme1: GoalQuestionsTheme1,
  theme2: GoalQuestionsTheme2,
  theme3: GoalQuestionsTheme3,
  theme4: GoalQuestionsTheme4,
  theme5: GoalQuestionsTheme5,
};

export default function GoalQuestions() {
  const { theme } = useTheme();
  const ThemedGoalQuestions = aboutMap[theme] || GoalQuestionsTheme1;

  return <ThemedGoalQuestions />;
}
