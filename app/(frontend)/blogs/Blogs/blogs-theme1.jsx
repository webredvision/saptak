"use client";
import React from "react";
import { BiCalendar } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import Link from "next/link";
import Heading from "@/app/components/Heading/Heading";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const SkeletonCard = () => {
  return (
    <div className="bg-[var(--rv-bg-gray-light)] animate-pulse rounded-xl overflow-hidden h-96 w-full">
      <div className="h-1/2 bg-[var(--rv-bg-gray)]"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 w-3/4 bg-[var(--rv-bg-gray)] rounded"></div>
        <div className="h-3 w-full bg-[var(--rv-bg-gray)] rounded"></div>
        <div className="h-3 w-2/3 bg-[var(--rv-bg-gray)] rounded"></div>
        <div className="h-3 w-1/3 bg-[var(--rv-bg-gray)] rounded mt-4"></div>
      </div>
    </div>
  );
};

const BlogsTheme1 = ({ blogs }) => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (Array.isArray(blogs)) setLoading(false);
  }, [blogs]);

  const categories = Array.from(
    new Map(blogs?.map((blog) => [blog.category?._id, blog.category])).values()
  );

  const filteredBlogs =
    selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => blog?.category?._id === selectedCategory);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div>
      <InnerPage title={'Blogs'}/>
      <div className="bg-[var(--rv-bg-white)] px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col items-center gap-5 md:gap-8">
          <Heading
            title={"Saptak  RESEARCH"}
            heading={"Latest market intelligence"}
            description={
              "Stay informed with deep dives and actionable perspectives from our research desk."
            }
          />

          <div className="flex items-center justify-between gap-5 w-full">
            <h6 className="font-bold">Select category by blogs</h6>
            <div>
              <select
                className="p-1 rounded-md border px-2 outline-none md:px-5 border-[var(--rv-black)]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Blogs</option>
                {categories?.map((cat) => (
                  <option key={cat?._id} value={cat?._id}>
                    {cat?.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6 w-full"
          >
            {loading &&
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

            {!loading &&
              filteredBlogs?.map((article, index) => (
                <div
                  key={index}
                  className="group bg-[var(--rv-bg-primary-light)] rounded-xl overflow-hidden transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={article?.image?.url}
                      alt={article?.posttitle}
                      className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--rv-black)] to-transparent"></div>
                    <div className="absolute bottom-3 left-4 flex items-center text-[var(--rv-white)]">
                      <BiCalendar className="w-4 h-4 mr-2" />
                      {new Date(article?.createdAt).toDateString()}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between gap-3 col-span-2">
                    <h6 className="line-clamp-2 font-bold leading-snug group-hover:text-[var(--rv-primary-dark)] transition-colors">
                      {article?.metatitle}
                    </h6>

                    <p className="text-[var(--rv-black)] flex-grow line-clamp-2">
                      {article?.description}
                    </p>

                    <Link
                      href={`/blogs/${article?.slug}`}
                      className="inline-flex items-center text-[var(--rv-black)] font-semibold transition-colors group"
                    >
                      Read insights
                      <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            {!loading && (!filteredBlogs || filteredBlogs.length === 0) && (
              <div className="col-span-full text-center text-[var(--rv-text-muted)]">
                No blogs found.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogsTheme1;
