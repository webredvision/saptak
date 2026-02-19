export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import React from "react";
import AboutClient from "./AboutUs/AboutClient";
import {
  getAboutus,
  getAddisLogos,
  getMissionVission,
  getStatsData,
  getTeams,
} from "@/lib/functions";

export default async function Page() {
  const aboutData = await getAboutus();
  const otherData = await getMissionVission();
  const teamData = await getTeams();
  const amcLogosData = await getAddisLogos();
  const statsData = await getStatsData();

  return (
    <AboutClient
      teamData={teamData}
      aboutData={aboutData}
      otherData={otherData}
      statsData={statsData}
      amcLogosData={amcLogosData}
    />
  );
}
