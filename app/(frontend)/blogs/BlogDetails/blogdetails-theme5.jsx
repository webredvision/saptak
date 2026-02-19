"use client";
import { motion } from "framer-motion";
import { BiCalendar } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export default function BlogDetailsPage5({ blog, blogs }) {

  if (!blog) {
    return (
      <div className="min-h-96 flex items-center justify-center text-center font-medium text-[var(--rv-secondary)]">
        Blog not found.
      </div>
    );
  }

  const relatedBlogs = blogs.filter(
    (item) =>
      item?.category?._id === blog?.category?._id &&
      item?._id !== blog?._id
  );

  return (
    <div className="bg-[var(--rv-bg-white)]">
      <InnerPage title="Blog Details" />

      <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col md:flex-row items-start gap-5 w-full">
          <div className="md:w-2/3 w-full flex flex-col gap-5 md:gap-6">
            <Link
              href="/blogs"
              className="inline-flex items-center text-[var(--rv-black)] hover:text-[var(--rv-secondary)] transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Blogs
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <div className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl">
                <img
                  src={blog?.image?.url}
                  alt="Mutual Fund Consultation Madurai"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center text-[var(--rv-black)]">
                  <BiCalendar className="w-4 h-4 mr-2" />
                  {new Date(blog?.createdAt).toDateString()}
                </div>
                <p>{blog?.category?.title}</p>
              </div>

              <h4 className="font-bold leading-tight text-[var(--rv-primary)]">
                {blog?.metatitle}
              </h4>

              <div>
                {blog.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  />
                ) : (
                  <p>Detailed content coming soon. Stay tuned for in-depth insights.</p>
                )}
              </div>

              <div className="prose max-w-none text-[var(--rv-black)] leading-relaxed">
                {blog.content ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                ) : (
                  <p>Detailed content coming soon. Stay tuned for in-depth insights.</p>
                )}
              </div>
            </motion.div>

            <div className="flex items-end justify-end">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-[var(--rv-primary)]"
              >
                ↑ Scroll to Top
              </button>
            </div>
          </div>

          <div className="md:w-1/3 w-full flex flex-col gap-5 sticky top-20">
            <h6>Recent Blogs</h6>
            <div className="w-full flex flex-col gap-5">

              {relatedBlogs.length === 0 ? (
                <p className="">No recent blogs in this category.</p>
              ) : (
                relatedBlogs.map((article, index) => (
                  <div
                    key={index}
                    className="group bg-[var(--rv-bg-white)] border md:h-32 grid grid-cols-1 md:grid-cols-3 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={article?.image?.url}
                        alt={article?.posttitle}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--rv-black)] to-transparent"></div>
                      <div className="absolute bottom-3 left-4 flex items-center text-[var(--rv-white)]">
                        <BiCalendar className="w-4 h-4 mr-2" />
                        {new Date(article?.createdAt).toDateString()}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between gap-3 col-span-2">
                      <p className="line-clamp-2 font-bold leading-snug group-hover:text-[var(--rv-primary)] transition-colors">
                        {article?.metatitle}
                      </p>

                      <p className="text-[var(--rv-black)] flex-grow line-clamp-2 md:hidden">
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
                ))
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
