import React from "react";
import { getActiveServicesCount, getAllLeadsCount, getAwardsCount, getBlogsCount, getFaqsCount, getSiteData, getTestimonialsCount } from "@/lib/functions";
import { getServerSession } from "next-auth";
import Dashboard from "@/app/(admin)/admin/Dashboard";

export default async function Home() {
  const session = await getServerSession();
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
