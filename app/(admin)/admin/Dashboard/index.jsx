"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  FaAward,
  FaQuestion,
  FaPhone,
  FaMapPin,
  FaGlobe,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { GrServices } from "react-icons/gr";
import { SiGoogleads } from "react-icons/si";
import { BiMessageAdd } from "react-icons/bi";
import { MdAddChart, MdAddchart, MdRefresh } from "react-icons/md";
import Loader from "@/app/(admin)/admin/common/Loader";
import { toast } from "react-toastify";

const quickActions = [
  {
    title: "Create New Post",
    route: "/admin/manage-posts/add-post",
    desc: "Add a new blog post or article",
    icon: <MdAddchart color="var(--rv-primary)" />,
  },
  {
    title: "Add Testimonial",
    route: "/admin/manage-testimonials/add-testimonial",
    desc: "Feature customer feedback",
    icon: <BiMessageAdd color="var(--rv-primary)" />,
  },
  {
    title: "Add Award",
    route: "/admin/manage-awards/add-awards",
    desc: "Showcase achievements",
    icon: <FaAward color="var(--rv-primary)" />,
  },
];

const Dashboard = ({
  session,
  blogscount,
  testiomonialscount,
  faqscount,
  awardscount,
  activeServicescount,
  leadscount,
}) => {
  const stats = [
    {
      name: "Total Services",
      icon: <GrServices color="var(--rv-primary)" />,
      value: activeServicescount ?? 0,
      route: "/admin/services",
    },
    {
      name: "Total Posts",
      icon: <MdAddChart color="var(--rv-primary)" />,
      value: blogscount ?? 0,
      route: "/admin/manage-posts/manage",
    },
    {
      name: "Testimonials",
      icon: <BiMessageAdd color="var(--rv-primary)" />,
      value: testiomonialscount ?? 0,
      route: "/admin/manage-testimonials/manage",
    },
    {
      name: "FAQs",
      icon: <FaQuestion color="var(--rv-primary)" />,
      value: faqscount ?? 0,
      route: "/admin/faqs",
    },
    {
      name: "Awards",
      icon: <FaAward color="var(--rv-primary)" />,
      value: awardscount ?? 0,
      route: "/admin/manage-awards/manage",
    },
    {
      name: "New Leads",
      icon: <SiGoogleads color="var(--rv-primary)" />,
      value: leadscount ?? 0,
      route: "/admin/manage-leads/manage",
    },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const user = session;
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  if (!user) {
    router.push("/signin");
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`
      );
      if (response.status === 200) {
        setProfile(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed the database? This will clear existing data and populate it with dummy data.")) return;

    setSeeding(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/seed`);
      if (response.status === 200) {
        toast.success(response.data.message || "Database seeded successfully!");
        // Refresh counts by reloading page or re-fetching if needed
        router.refresh(); // Attempt to refresh server components
        window.location.reload(); // Hard reload for clean state
      }
    } catch (error) {
      console.error("Seeding error:", error);
      toast.error(error.response?.data?.message || "Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Administrator</h1>
        <p className="text-[var(--rv-gray)]">
          Here’s what’s happening with your platform today.
        </p>
      </div>
      {loadingProfile ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, idx) => {
              const CardContent = (
                <div className="bg-[var(--rv-bg-white)] p-4 rounded-xl shadow border border-[var(--rv-gray-light)] flex gap-5 items-center justify-between cursor-pointer hover:shadow-md transition">
                  <div className="flex flex-col gap-2">
                    <div className="text-[var(--rv-gray)]  ">{stat.name}</div>
                    <div className="text-4xl font-bold">{stat.value}</div>
                  </div>
                  <div className="font-medium text-3xl">{stat.icon}</div>
                </div>
              );

              return (
                <div key={idx}>
                  {!pathname.startsWith("/devadmin") ? (
                    <Link href={stat.route}>{CardContent}</Link>
                  ) : (
                    CardContent
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[var(--rv-bg-white)] rounded-xl shadow border border-[var(--rv-gray-light)] p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>

            {loadingProfile ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-6 bg-[var(--rv-bg-gray-light)] rounded w-1/3"></div>
                <div className="h-4 bg-[var(--rv-bg-gray-light)] rounded w-1/2"></div>
                <div className="h-4 bg-[var(--rv-bg-gray-light)] rounded w-2/3"></div>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="h-4 bg-[var(--rv-bg-gray-light)] rounded w-1/4"></div>
                  <div className="h-4 bg-[var(--rv-bg-gray-light)] rounded w-1/3"></div>
                  <div className="h-4 bg-[var(--rv-bg-gray-light)] rounded w-2/5"></div>
                </div>
              </div>
            ) : profile ? (
              <div className="flex flex-col gap-3   text-[var(--rv-gray-dark)]">
                <div>
                  <p className="  font-bold">{profile.name}</p>
                  <p className="text-[var(--rv-gray)]">{profile.websiteName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail size={20} color="var(--rv-primary)" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone size={20} color="var(--rv-primary)" />
                  {profile.mobile}
                </div>
                <div className="flex items-center gap-2">
                  <FaMapPin size={20} color="var(--rv-primary)" />
                  {profile.address}
                </div>
                <div className="flex items-center gap-2">
                  <FaGlobe size={20} color="var(--rv-primary)" />
                  <a
                    href={profile.siteurl}
                    target="_blank"
                    className="text-[var(--rv-blue-dark)] hover:underline"
                  >
                    {profile.siteurl}
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-[var(--rv-gray)] italic">No profile information found.</p>
            )}
          </div>
        </>
      )}
      {(pathname.startsWith("/admin") || pathname.startsWith("/devadmin")) && (
        <div className="bg-[var(--rv-bg-white)] rounded-xl shadow border border-[var(--rv-gray-light)] p-4">
          <h2 className="  font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <Link
                href={action.route}
                key={i}
                className="p-4 border border-[var(--rv-gray)] rounded-lg text-center flex items-center justify-center flex-col gap-2 shadow cursor-pointer transition hover:shadow-md"
              >
                <div className="font-medium text-3xl">{action.icon}</div>
                <div className="font-medium">{action.title}</div>
                <p className="  text-[var(--rv-gray)]">{action.desc}</p>
              </Link>
            ))}
            {pathname.startsWith("/devadmin") && user?.user?.role === "DEVADMIN" && (
              <div
                onClick={handleSeed}
                className={`p-4 border border-[var(--rv-gray)] rounded-lg text-center flex items-center justify-center flex-col gap-2 shadow cursor-pointer transition hover:shadow-md ${seeding ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium text-3xl">
                  <MdRefresh className={seeding ? "animate-spin" : ""} color="var(--rv-primary)" />
                </div>
                <div className="font-medium">{seeding ? "Seeding..." : "Seed Database"}</div>
                <p className="text-[var(--rv-gray)]">Populate all modules with dummy data</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
