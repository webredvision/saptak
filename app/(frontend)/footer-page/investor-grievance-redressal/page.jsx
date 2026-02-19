import React from "react";
import TermClient from "./Investor/InvestorClient";
import { getSiteData } from "@/lib/functions";

export default async function Page() {
  const sitedata = await getSiteData();
  return (
    <div>
      <TermClient sitedata={sitedata} />
    </div>
  );
}
