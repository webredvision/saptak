"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import GoalPlanningTheme1 from "./goalplanning-theme1.jsx";
import GoalPlanningTheme2 from "./goalplanning-theme2.jsx";
import GoalPlanningTheme3 from "./goalplanning-theme3.jsx";
import GoalPlanningTheme4 from "./goalplanning-theme4.jsx";
import GoalPlanningTheme5 from "./goalplanning-theme5.jsx";

const aboutMap = {
  theme1: GoalPlanningTheme1,
  theme2: GoalPlanningTheme2,
  theme3: GoalPlanningTheme3,
  theme4: GoalPlanningTheme4,
  theme5: GoalPlanningTheme5,
};

export default function GoalPlanning() {
  const { theme } = useTheme();
  const ThemedGoalPlanning = aboutMap[theme] || GoalPlanningTheme1;

  return <ThemedGoalPlanning />;
}
