import {
  getArn,
  getRoboUser,
  getServiceData,
  getSiteData,
  getSocialMedia,
  getWebPopups,
} from "@/lib/functions";
import Colortheme from "@/app/components/colorTheme/colortheme";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import QRCode from "@/app/components/qrCode";
import ScrollToTop from "@/app/components/ScrollToTop";
import WebPopup from "@/app/components/WebPopup/WebPopup";
import "@/app/globals.css";
import { ThemeProvider } from "@/app/ThemeProvider";
import FeedbackButton from "@/app/components/FeedbackForm/FeedbackButton";
import FloatingMeetingButton from "@/app/components/BookMeeting/FloatingMeetingButton";
import WhatsAppBot from "@/app/components/chatbot/whatsapp";



export async function generateMetadata() {
  const siteData = await getSiteData();
  return {
    title: {
      default: siteData?.websiteName || "REDVision Global Technologies Pvt. Ltd.",
      template: `%s - ${siteData?.websiteName || "Red Vission"}`,
    },
    description:
      siteData?.description ||
      "MockUp Red Vission: Your trusted partner for expert financial guidance, strategic investments, and wealth management solutions. Empowering you to secure a prosperous future.",
    openGraph: {
      title: siteData?.websiteName,
      description: siteData?.description,
      type: "website",
      locale: "en_IN",
      siteName: siteData?.websiteName,
      url: `https://${siteData?.websiteDomain}`,
      images: [`https://${siteData?.websiteDomain}/og.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      site: "@RFWealth",
      title: siteData?.websiteName,
      description: siteData?.description,
      images: [`https://${siteData?.websiteDomain}/og.jpg`],
    },
    metadataBase: new URL(`https://${siteData?.websiteDomain}`),
    alternates: {
      canonical: "./",
    },
    authors: [siteData?.websiteName || "REDVission Global Technologies Pvt. Ltd."],
  };
}

export default async function RootLayout({ children }) {
  const services = await getServiceData();
  const sitedata = await getSiteData();
  const socialMedia = await getSocialMedia();
  const arnData = await getArn();
  const roboUser = await getRoboUser();
  const popups = await getWebPopups();

  return (
    <div className="">
      <ThemeProvider>
        <Navbar services={services} sitedata={sitedata} roboUser={roboUser} />
        <ScrollToTop />
        {children}
        <WebPopup popups={popups} />
      </ThemeProvider>
      <QRCode sitedata={sitedata} />
      <FeedbackButton />
      <WhatsAppBot sitedata={sitedata} services={services} />
      <Footer
        services={services}
        sitedata={sitedata}
        socialMedia={socialMedia}
        arnData={arnData}
      />
    </div>
  );
}
