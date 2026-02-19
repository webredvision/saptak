import React from 'react'
import PrivacyClient from './Privacy-policy/PrivacyClient';
import { getSiteData } from '@/lib/functions';


export default async function Page() {
  const sitedata = await getSiteData();

  return <PrivacyClient sitedata={sitedata} />;
}
