"use client";

import { useTheme } from "@/app/ThemeProvider";
import TeamsTheme1 from "./teams-theme1";
import TeamsTheme2 from "./teams-theme2";
import TeamsTheme3 from "./teams-theme3";
import TeamsTheme4 from "./teams-theme4";
import TeamsTheme5 from "./teams-theme5";


const themeMap = {
  theme1: TeamsTheme1,
  theme2: TeamsTheme2,
  theme3: TeamsTheme3,
  theme4: TeamsTheme4,
  theme5: TeamsTheme5,
};

export default function TeamsClient({teamData}) {
  const { theme } = useTheme();
  const ThemedTeams = themeMap[theme] || TeamsTheme1;

  return <ThemedTeams teamData={teamData}/>;
}
