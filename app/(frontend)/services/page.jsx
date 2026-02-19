export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import React from 'react'
import { getServiceData } from '@/lib/functions';
import ServicesClient from './ServiceCard/ServicesClient';

export default async function Page() {
  const services = await getServiceData()
  
  return <ServicesClient services={services} />;
}
