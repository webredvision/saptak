import React from "react";
import { BiCalendar } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa6";
import Heading from "../../../components/Heading/Heading";
import Link from "next/link";
import Button from "../../../components/Button/Button";

const BlogTheme3 = ({ blog }) => {

  return (
    <div className="bg-[var(--rv-bg-white)] px-4 relative">
      <div className="max-w-7xl w-full mx-auto main-section flex flex-col items-center gap-5 md:gap-8">
        <div className="flex items-center justify-between gap-5 w-full flex-wrap">
          <Heading
            variant="light"
            align="start"
            title={"Saptak  RESEARCH"}
            heading={"Latest Market Intelligence"}
            description={
              "Stay informed with deep dives and actionable perspectives from our research desk."
            }
          />

          <div className="">
            <Button link={"/blogs"} text={"View All Blogs"} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blog?.slice(0, 3)?.map((article, index) => (
            <Link
              href={`/blogs/${article?.slug}`} key={index}> 
              <div className="group relative">
                <div className="relative h-full backdrop-blur-md rounded-2xl overflow-hidden border border-[var(--rv-gray-dark)] hover:border-[var(--rv-primary)]/50 transition-all duration-500 flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article?.image?.url}
                      alt={article?.posttitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--rv-gray-dark)] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center text-[var(--rv-primary)] font-semibold mb-4">
                      <BiCalendar className="w-4 h-4 mr-2" />
                      {new Date(article?.createdAt).toDateString()}
                    </div>

                    <h3 className="text-xl font-bold text-[var(--rv-black)] mb-3 leading-snug group-hover:text-[var(--rv-primary)] transition-colors duration-300 line-clamp-1">
                      {article?.metatitle}
                    </h3>

                    <p className="line-clamp-2 flex-grow mb-6 leading-relaxed">
                      {article?.description}
                    </p>

                    <Link
                      href={`/blogs/${article?.slug}`}
                      className="inline-flex items-center text-[var(--rv-primary)] font-semibold transition-colors group"
                    >
                      Read insights
                      <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogTheme3;
