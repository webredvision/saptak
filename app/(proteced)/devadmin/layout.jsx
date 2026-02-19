import React from "react";
import DefaultLayout from "@/app/(admin)/admin/devadmin/Layouts/DefaultLaout";
import { getSiteData } from "@/lib/functions";

export default async function DefaultLayoutClient({ children }) {
const sitedata = await getSiteData()
  return (
    <DefaultLayout sitedata={sitedata}>
      {children}
    </DefaultLayout>
  );
}
