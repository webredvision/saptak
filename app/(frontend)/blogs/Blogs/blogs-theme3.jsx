"use client";
import React, { useEffect, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { motion } from "framer-motion";
import Heading from "../../../components/Heading/Heading";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const SkeletonCard = () => (
  <div className=" bg-[var(--rv-bg-white-light)] backdrop-blur-lg animate-pulse rounded-2xl h-80 w-full border border-[var(--rv-white-light)]"></div>
);

const BlogsTheme3 = ({ blogs }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogs?.length > 0) setLoading(false);
  }, [blogs]);

  const categories = Array.from(
    new Map(blogs?.map((b) => [b?.category?._id, b?.category])).values(),
  );

  const filteredBlogs =
    selectedCategory === "all"
      ? blogs
      : blogs.filter((b) => b?.category?._id === selectedCategory);

  const staggerAnimation = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="relative bg-[var(--rv-bg-white)] text-[var(--rv-black)] overflow-hidden">
      <InnerPage title={"Blogs"} />
      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
          <Heading
            variant="light"
            title="Saptak  RESEARCH"
            heading="Latest Market Intelligence"
            description="Stay informed with deep dives and actionable perspectives from our research desk."
          />
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <h6 className="font-semibold">Select Blog Category</h6>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg  bg-[var(--rv-bg-white-light)] border  text-[var(--rv-primary)] outline-none border-[var(--rv-primary)] focus:border-[var(--rv-primary)] transition"
            >
              <option value="all">All Blogs</option>
              {categories.map((cat) => (
                <option key={cat?._id} value={cat?._id}>
                  {cat?.title}
                </option>
              ))}
            </select>
          </div>

          <motion.div
            variants={staggerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 w-full"
          >
            {loading && [...Array(6)].map((_, i) => <SkeletonCard key={i} />)}

            {!loading &&
              filteredBlogs?.map((article, i) => (
                <Link
                  href={`/blogs/${article?.slug}`}
                  key={article.slug + i}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group relative  overflow-hidden border border-[var(--rv-black)] rounded-xl"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={article?.image?.url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={article?.posttitle}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--rv-black)] to-transparent"></div>

                      <span className="absolute top-4 right-4 text-[var(--rv-white)] bg-[var(--rv-bg-white-light)]     px-3 py-1 rounded-full border border-[var(--rv-white-light)] backdrop-blur-lg">
                        {article?.category?.title}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-center text-[var(--rv-primary)]">
                        <BiCalendar className="mr-2" />
                        {new Date(article?.createdAt).toDateString()}
                      </div>

                      <h3 className="text-lg font-bold  line-clamp-1 leading-tight group-hover:text-[var(--rv-primary)] transition-colors">
                        {article?.metatitle}
                      </h3>

                      <p className="text-[var(--rv-gray)] text-sm line-clamp-2">
                        {article?.description}
                      </p>

                      <Link
                        href={`/blogs/${article?.slug}`}
                        className="mt-auto inline-flex items-center font-semibold text-[var(--rv-primary)]"
                      >
                        Read insights
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </Link>
              ))}
          </motion.div>
        </div>
      </div>
    </div >
  );
};

export default BlogsTheme3;
