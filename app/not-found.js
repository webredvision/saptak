import {
  getArn,
  getServiceData,
  getSiteData,
  getSocialMedia,
} from "@/lib/functions";
import NotFoundClient from "./(frontend)/landingpage/NotFound/NotFound";
import Footer from "./components/Footer/Footer";
import InnerPage from "./components/InnerBanner/InnerPage";
import Navbar from "./components/Navbar/Navbar";

export default async function NotFound() {
  const services = await getServiceData();
  const sitedata = await getSiteData();
  const socialMedia = await getSocialMedia();
  const arnData = await getArn();

  return (
    <div className="overflow-hidden">
      <Navbar services={services} sitedata={sitedata} />
      <InnerPage title="Page Not Found" />
      <NotFoundClient />
      <Footer
        services={services}
        sitedata={sitedata}
        socialMedia={socialMedia}
        arnData={arnData}
      />
    </div>
  );
}
