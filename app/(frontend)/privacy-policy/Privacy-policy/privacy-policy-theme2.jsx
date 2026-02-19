import React from "react";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const PrivacyPolicyTheme2 = ({ sitedata, privacyData }) => {

  const createMarkup = () => {
    if (!privacyData) return { __html: "" }; 
    
    let updatedHTML = privacyData
      .replace(
        /Your Company name/gi,
        `<mark style="background-color: white; font-size: 16px; font-weight: 500;">${
          sitedata?.websiteName || "Our Company"
        }</mark>`
      )
      .replace(
        /Company Email/gi,
        `<mark style="background-color: white; font-size: 16px; font-weight: 500;">
          <a href="mailto:${sitedata?.email || "#"}" class="text-[var(--rv-blue-dark)] underline">
            ${sitedata?.email || "info@example.com"}
          </a>
        </mark>`
      )

      // HEADINGS
      .replace(
        /(?:^|\n)\s*What we collect\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>What we collect</mark><br/>'
      )
      .replace(
        /(?:^|\n)\s*Name and contact details\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>Name and contact details</mark><br/>'
      )
      .replace(
        /(?:^|\n)\s*Collection Use of image data\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>Collection Use of image data</mark><br/>'
      )
      .replace(
        /(?:^|\n)\s*Use of location data\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>Use of location data</mark><br/>'
      )
      .replace(
        /(?:^|\n)\s*Security\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>Security</mark><br/>'
      )
      .replace(
        /(?:^|\n)\s*Links to other websites\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>Links to other websites</mark><br/>'
      )
      .replace(
        /(?:^|\n)\s*Controlling your personal information\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>Controlling your personal information</mark><br/>'
      )
      .replace(
        /(?:^|\n)\s*Security certificates\s*(?:\n|:)/gi,
        '<br><mark style="background-color: white; font-size: 20px; font-weight: 600;"><br/>Security certificates</mark><br/>'
      );

    return { __html: updatedHTML };
  };

  // -------------------------------
  // ⭐ SKELETON COMPONENT
  // -------------------------------
  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-[var(--rv-bg-gray)] rounded w-3/4"></div>
      <div className="h-4 bg-[var(--rv-bg-gray)] rounded w-full"></div>
      <div className="h-4 bg-[var(--rv-bg-gray)] rounded w-5/6"></div>
      <div className="h-4 bg-[var(--rv-bg-gray)] rounded w-2/3"></div>
      <div className="h-4 bg-[var(--rv-bg-gray)] rounded w-full"></div>
    </div>
  );

  return (
    <div>
      <InnerPage title={"Privacy Policy"} />

      <section className="px-4 relative bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] z-10">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-6 md:gap-8">
          {!privacyData ? (
            <SkeletonLoader />
          ) : (
            <div
              className="prose max-w-none leading-relaxed"
              dangerouslySetInnerHTML={createMarkup()}
            />
          )}

        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyTheme2;
