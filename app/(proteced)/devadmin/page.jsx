import React from "react";
import Dashboard from "@/app/(admin)/admin/Dashboard";
import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";
import { getActiveServicesCount, getAllLeadsCount, getAwardsCount, getBlogsCount, getFaqsCount, getSiteData, getTestimonialsCount } from "@/lib/functions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const leadscount = await getAllLeadsCount();
  const activeServicescount = await getActiveServicesCount();
  const awardscount = await getAwardsCount();
  const faqscount = await getFaqsCount();
  const testiomonialscount = await getTestimonialsCount()
  const blogscount = await getBlogsCount();
  return (
    <>
        <Dashboard session={session} blogscount={blogscount} testiomonialscount={testiomonialscount} faqscount={faqscount} leadscount={leadscount} activeServicescount={activeServicescount} awardscount={awardscount} />
    </>
  );
}
