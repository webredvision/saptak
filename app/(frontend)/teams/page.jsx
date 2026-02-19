export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import React from 'react'
import TeamClient from './Teams/TeamClient';
import { getTeams } from '@/lib/functions';


export default async function Page() {
const teamData = await getTeams();
  return <TeamClient teamData={teamData}/>;
}
