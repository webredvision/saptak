import { getSiteData } from "@/lib/functions";
import ContactClient from "./ContactUs/ContactClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Page() {
  const sitedata = await getSiteData();
  return <ContactClient sitedata={sitedata}/>;
}
