"use client";
import React, { useState, useEffect } from "react";
import { BiCalendar } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import Link from "next/link";
import Heading from "@/app/components/Heading/Heading";
import Button from "@/app/components/Button/Button";

const BlogTheme5 = ({ blog }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const container = {
        hidden: {},
        show: {
            transition: { staggerChildren: 0.2 },
        },
    };


    return (
        <div className="bg-[var(--rv-bg-white)] px-4">
            <div className="max-w-7xl mx-auto main-section flex flex-col items-center gap-5 md:gap-8">
                <div className="flex items-center flex-wrap justify-between gap-5 w-full">
                    <Heading
                        align="start"
                        title={"Saptak  RESEARCH"}
                        heading={"Latest Market Updates"}
                        highlight={"Market"}
                        description={
                            "Read fresh research, news highlights, and expert commentary from our analysts"
                        }
                    />

                    {!loading && (
                        <Button
                            link={"/blogs"}
                            text="View All Blogs  "
                            className={
                                "hover:bg-[var(--rv-bg-secondary)] bg-[var(--rv-bg-primary)] text-[var(--rv-white)]"
                            }
                        />
                    )}
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid lg:grid-cols-3 gap-5 md:grid-cols-2 grid-cols-1 w-full"
                >
                    {loading
                        ?
                        Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-[var(--rv-bg-secondary-light)] rounded-xl overflow-hidden animate-pulse flex flex-col"
                            >
                                <div className="h-56 bg-[var(--rv-bg-gray)] w-full"></div>
                                <div className="p-6 flex flex-col gap-3">
                                    <div className="w-24 h-4 bg-[var(--rv-bg-gray)] rounded"></div>
                                    <div className="w-3/4 h-6 bg-[var(--rv-bg-gray)] rounded"></div>
                                    <div className="w-full h-4 bg-[var(--rv-bg-gray)] rounded"></div>
                                    <div className="w-1/2 h-4 bg-[var(--rv-bg-gray)] rounded"></div>
                                    <div className="w-24 h-4 bg-[var(--rv-bg-gray)] rounded mt-2"></div>
                                </div>
                            </div>
                        ))
                        :
                        blog?.slice(0, 3)?.map((article, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-[var(--rv-bg-white)] border rounded-xl overflow-hidden duration-300 hover:-translate-y-1 flex flex-col"
                            >
                                <div className="h-56 overflow-hidden">
                                    <motion.img
                                        src={article?.image?.url}
                                        alt={article?.posttitle}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        whileHover={{ scale: 1.05 }}
                                    />
                                </div>

                                <div className="p-6 flex flex-col flex-grow gap-3">
                                    <div className="flex items-center  text-[var(--rv-black)]">
                                        <BiCalendar className="w-4 h-4 mr-2" />
                                        {new Date(article?.createdAt).toDateString()}
                                    </div>

                                    <h6 className="font-bold leading-snug line-clamp-2">
                                        {article?.metatitle}
                                    </h6>

                                    <Link
                                        href={`/blogs/${article?.slug}`}
                                        className="inline-flex items-center text-[var(--rv-black)] font-semibold transition-colors group"
                                    >
                                        Read insights
                                        <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                </motion.div>


            </div>
        </div>
    );
};

export default BlogTheme5;
