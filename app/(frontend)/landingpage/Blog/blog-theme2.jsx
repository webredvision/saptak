import React from "react";
import { BiCalendar } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa6";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";
import Link from "next/link";

const BlogTheme2 = ({ blog }) => {
  
  return (
    <div className="px-4 bg-[var(--rv-bg-black)]">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
        <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
          <Heading align="start" title="Market Insights" heading="Expert Views to Guide Your Investment Journey" variant="light" />
          <Button
            link={"/blogs"}
            text="All Blogs"
           
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          {blog?.slice(0, 4)?.map((article, index) => (
            <div
              key={index}
              className="group bg-[var(--rv-bg-secondary)] md:h-64 grid grid-cols-1 md:grid-cols-3 rounded-xl overflow-hidden transition-all duration-300">
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
              <div className="p-6 flex flex-col justify-between gap-3 col-span-2">
                <div className="flex flex-col gap-1">
                  <h6 className="line-clamp-2 font-bold leading-snug group-hover:text-[var(--rv-primary-dark)] transition-colors">
                    {article?.metatitle}
                  </h6>

                  <p className="line-clamp-2">
                    {article?.posttitle}
                  </p>
                  <p className="line-clamp-2">
                    {article?.description}
                  </p>
                </div>

                <Link
                  href={`/blogs/${article?.slug}`}
                  className="inline-flex items-center font-semibold transition-colors group"
                >
                  Read insights
                  <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default BlogTheme2;
