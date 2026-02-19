export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import React from 'react'
import ServicesClient from '@/app/(frontend)/services/Services/ServicesClient'
import { getServiceDataBySlug } from '@/lib/functions';

export default async function Page({ params }) {
  const { slug } = await params;
  const service = await getServiceDataBySlug(slug)
  
  return <ServicesClient service={service} />;
}