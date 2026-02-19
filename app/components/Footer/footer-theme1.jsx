"use client";
import { IoCall, IoLocationSharp, IoMail } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaRedditAlien,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
  FaLink,
} from "react-icons/fa6";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";
import {
  FOOTER_AMFI_SABI_LINKS,
  FOOTER_QUICKLINKS,
} from "@/lib/Footer/footerConfig";
import useLogoSrc from "@/hooks/useLogoSrc";

const FooterTheme1 = ({ services, sitedata, socialMedia, arnData }) => {
  const arn = arnData;
  const logoSrc = useLogoSrc();
  const normalizeTitle = (title) =>
    String(title || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const iconMap = {
    facebook: <FaFacebookF className="text-[var(--rv-primary)]" />,
    instagram: <FaInstagram className="text-[var(--rv-primary)]" />,
    youtube: <FaYoutube className="text-[var(--rv-primary)]" />,
    linkedin: <FaLinkedin className="text-[var(--rv-primary)]" />,
    "twitter (x)": <FaXTwitter className="text-[var(--rv-primary)]" />,
    twitter: <FaXTwitter className="text-[var(--rv-primary)]" />,
    x: <FaXTwitter className="text-[var(--rv-primary)]" />,
    reddit: <FaRedditAlien className="text-[var(--rv-primary)]" />,
    whatsapp: <FaWhatsapp className="text-[var(--rv-primary)]" />,
  };

  const getSocialIcon = (title) =>
    iconMap[normalizeTitle(title)] || (
      <FaLink className="text-[var(--rv-primary)]" />
    );

  const quicklinks = FOOTER_QUICKLINKS;
  const amfisabilinks = FOOTER_AMFI_SABI_LINKS;

  return (
    <>
      <div className="w-full h-28 bg-[var(--rv-bg-white)]"></div>

      <footer
        className="bg-[var(--rv-bg-secondary-dark)] text-[var(--rv-white)] px-4 py-6  w-full z-10 relative
        before:content-['']
        before:absolute before:inset-0
        before:bg-[url('/images/footer-vector.png')]
        before:bg-cover before:bg-center
        before:brightness-0 before:invert before:opacity-[0.05]
        before:-z-10"
      >
        <div className="mx-auto w-full  max-w-7xl flex flex-col gap-5 ">
          <div
            className="w-full p-8 md:p-10 flex flex-col gap-5 items-center justify-center text-center bg-gradient-to-br from-[var(--rv-bg-primary-dark)] to-[var(--rv-bg-secondary)] text-[var(--rv-white)] rounded-2xl shadow-2xl -mt-32 relative z-10
        before:content-['']
        before:absolute before:inset-0
        before:bg-[url('/images/vector2.png')]
        before:bg-cover before:bg-center
        before:brightness-0 before:invert before:opacity-[0.07]
        before:-z-10"
          >
            <Heading
              variant="light"
              title="Talk to a Real Tax Expert"
              heading="Still Confused? Get Clear Answers in Minutes"
              description="No bots. No pressure. Just honest, human guidance tailored to your financial goals."
            />
            <Button
              link={"/contact-us"}
              className="border-[var(--rv-secondary)]"
              text="Schedule a Free Call"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 pt-5">
            <div>
              {logoSrc ? (
                <Image src={logoSrc} alt="logo" width={120} height={50} priority />
              ) : (
                <h1 className="text-[var(--rv-primary)]  font-bold">Logo</h1>
              )}
              <p className="mt-2 py-4">{sitedata?.description}</p>
            </div>

            <div className="md:pl-10">
              <h6 className="mb-5 font-bold">Services</h6>
              <ul>
                {services.map((s, i) => (
                  <li key={i} className="mb-3">
                    <Link
                      href={`/services/${s.link}`}
                      className="duration-300 transition-all hover:text-[var(--rv-primary-dark)]"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="">
              <h6 className="mb-4 font-bold">Quick Links</h6>
              <ul>
                {quicklinks.map((q, i) => (
                  <li key={i} className="mb-3">
                    <Link
                      href={q.link}
                      className="duration-300 transition-all hover:text-[var(--rv-primary-dark)]"
                    >
                      {q.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="">
              <h6 className="mb-5 font-bold">Contact Us</h6>
              <ul>
                <li className="flex items-center mb-3">
                  <div>
                    <div className="w-9 h-9 bg-[var(--rv-bg-secondary)] rounded-full flex items-center justify-center">
                      <IoCall className="text-[var(--rv-primary)]" />
                    </div>
                  </div>
                  <a
                    href={`tel:${sitedata?.mobile || "+91xxxxxxxxxx"}`}
                    className="ml-3 hover:underline"
                  >
                    {sitedata?.mobile || "+91 xxxxxxxxxx"}
                  </a>
                </li>

                <li className="flex items-center mb-3">
                  <div>
                    <div className="w-9 h-9 bg-[var(--rv-bg-secondary)] rounded-full flex items-center justify-center">
                      <IoMail className="text-[var(--rv-primary)]" />
                    </div>
                  </div>
                  <a
                    href={`mailto:${sitedata?.email || "support@example.com"}`}
                    className="ml-3 hover:underline"
                  >
                    {sitedata?.email || "support@example.com"}
                  </a>
                </li>

                <li className="flex items-center">
                  <div>
                    <div className="w-9 h-9 bg-[var(--rv-bg-secondary)] rounded-full flex items-center justify-center">
                      <IoLocationSharp className="text-[var(--rv-primary)]" />
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      sitedata?.address || "Mumbai, India",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 hover:underline"
                  >
                    {sitedata?.address || "Mumbai, India"}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-x-3 justify-center flex-wrap">
            {socialMedia.map((link, index) => (
              <Link key={index} href={link.url} target="_blank">
                <div className="  w-9 h-9 bg-[var(--rv-bg-white)] rounded-full flex items-center justify-center">
                  {getSocialIcon(link.title)}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center flex flex-col gap-3 items-center">
            <p className="">
              {sitedata?.websiteName} is an AMFI Registered Mutual Fund
              Distributor. ARN - {arn[0]?.arn} EUIN - {arn[0]?.euins[0].euin}
            </p>

            <div>
              <ul className="flex items-center gap-3 flex-wrap">
                {amfisabilinks.map((sub, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Link
                      href={sub.link}
                      target={sub.target || "_self"}
                      rel="noopener noreferrer"
                    >
                      {sub.title}
                    </Link>
                    {index !== amfisabilinks.length - 1 && <span>|</span>}
                  </li>
                ))}
              </ul>
            </div>

            <p className="">
              Disclaimer: Mutual Fund investments are subject to market risks,
              read all scheme related documents carefully. The NAVs of the
              schemes may go up or down depending upon the factors and forces
              affecting the securities market including the fluctuations in the
              interest rates. The past performance of the mutual funds is not
              necessarily indicative of future performance of the schemes. The
              Mutual Fund is not guaranteeing or assuring any dividend under any
              of the schemes and the same is subject to the availability and
              adequacy distributable surplus.
            </p>
            <p className="">
              {sitedata?.websiteName} makes no warranties or
              representations, express or implied, on products offered through
              the platform of {sitedata?.websiteName}. It
              accepts no liability for any damages or losses, however, caused,
              in connection with the use of, or on the reliance of its product
              or related services. Terms and conditions of the website are
              applicable. Investments in Securities markets are subject to
              market risks, read all the related documents carefully before
              investing.
            </p>
          </div>

          <div className="py-4 flex justify-center border-t border-b border-[var(--rv-gray-light)]">
            <div className="flex flex-col md:flex-row  gap-5 items-center justify-center w-full">
              <div className="h-16 w-auto rounded-md overflow-hidden">
                <Image
                  src="/images/amfi-logo.jpg"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  alt="AMFI Logo"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p>ARN - </p>
                  <p>{arn[0]?.arn}</p>
                </div>
                <div className="flex items-center gap-1">
                  <p>EUIN - </p>
                  <p>{arn[0]?.euins[0]?.euin}</p>
                </div>
              </div>
              <div className="h-16 w-auto rounded-md overflow-hidden">
                <Image
                  src="/images/mutualfund.png"
                  width={200}
                  height={80}
                  className="w-full h-full object-cover"
                  alt="Mutual Fund Logo"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="w-full flex items-center justify-between gap-5 flex-wrap text-center">
              <p>
                © {new Date().getFullYear()} {sitedata?.websiteName} All Rights
                Reserved.{" "}
              </p>
              <div className="text-center flex items-center gap-1">
                <p> Designed & Developed by </p>
                <Link
                  href="https://www.redvisiontechnologies.com/"
                  target="_blank"
                  className="duration-300 transition-all underline"
                >
                  REDVision Global Technologies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterTheme1;
