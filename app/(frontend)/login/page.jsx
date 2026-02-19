export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import React from 'react'
import LoginClient from './Login/LoginClient';
import { getActiveLogindesk, getRoboUser, getSiteData } from '@/lib/functions';


export default async function Page() {
  const roboUser = await getRoboUser();
  const sitedata = await getSiteData();
  const login = await getActiveLogindesk();
  return <LoginClient  roboUser={roboUser} sitedata={sitedata} login={login && login[0]} />;
}
