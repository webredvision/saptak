export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import {
  getAboutus,
  getAddisLogos,
  getAwards,
  getFaqs,
  getLatestBlogs,
  getMissionVission,
  getServiceData,
  getSiteData,
  getStatsData,
  getTeams,
  getTestimonials,
} from "@/lib/functions";
import About from "./landingpage/About/About";
import AppSection from "./landingpage/AppSection/AppSection";
import Blog from "./landingpage/Blog/Blog";
import CompareAssets from "./landingpage/CompareAssets/CompareAssets";
import Contact from "./landingpage/Contact/Contact";
import DiyVsMfd from "./landingpage/DiyVsMfd/DiyVsMfd";
import Faq from "./landingpage/Faq/Faq";
import FundPerformance from "./landingpage/FundPerformance/FundPerformance";
import GoalQuestions from "./landingpage/GoalQuestions/GoalQuestions";
import Hero from "./landingpage/Hero/Hero";
import NewsPage from "./landingpage/News/News";
import ServiceCard from "./landingpage/ServiceCard/ServiceCard";
import SystematicCalculator from "./landingpage/SystematicCalculator/SystematicCalculator";
import Testimonial from "./landingpage/Testimonial/Testimonial";

export default async function HomePage() {
  const services = await getServiceData();
  const sitedata = await getSiteData();
  const testimonials = await getTestimonials();
  const teamdata = await getTeams();
  const latestblogs = await getLatestBlogs();
  const faqs = await getFaqs();
  const awards = await getAwards();
  const stats = await getStatsData();
  const aboutData = await getAboutus();
  const amcLogosData = await getAddisLogos();
  const otherData = await getMissionVission();
  return (
    <>
      <Hero amcLogosData={amcLogosData} stats={stats} />
      <ServiceCard services={services} />
      <About aboutData={aboutData} stats={stats} otherData={otherData} />
      <GoalQuestions />
      <FundPerformance />
      <SystematicCalculator />
      <Testimonial testimonials={testimonials} />
      <DiyVsMfd />
      <CompareAssets />
      <NewsPage />
      <AppSection sitedata={sitedata} />
      <Blog blog={latestblogs} />
      <Faq faqs={faqs} />
      <Contact sitedata={sitedata} />
    </>
  );
}
