
import { getSiteData } from "@/lib/functions";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
