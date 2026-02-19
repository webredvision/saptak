import React from 'react'
import { getActiveLogindesk, getRoboUser, getSiteData } from '@/lib/functions';
import RegistrationClient from './Registration/RegistrationClient';
import { redirect } from "next/navigation";

export default async function Page() {
  const roboUser = await getRoboUser();
  const sitedata = await getSiteData();
  const login = await getActiveLogindesk();
  if (!roboUser) redirect("/");
  return <RegistrationClient sitedata={sitedata} login={login && login[0]} roboUser={roboUser} />;
}