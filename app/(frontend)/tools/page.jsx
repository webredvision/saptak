"use client";
import React from "react";
import InnerPage from "@/app/components/InnerBanner/InnerPage";
import Button from "@/app/components/Button/Button";

const ToolsPage = () => {

    const items = [
        {
            title: "Financial Calculator",
            description: "Our Financial Solutions offer tailored strategies to meet your unique goals, focusing on growth and risk management.",
            color: "bg-[var(--rv-bg-primary)]"
        },
        {
            title: "Financial Health",
            description: "Our Financial Solutions offer tailored strategies to meet your unique goals, focusing on growth and risk management.",
            color: "bg-[var(--rv-bg-secondary)]"
        },
        {
            title: "Risk Profile",
            description: "Our Financial Solutions offer tailored strategies to meet your unique goals, focusing on growth and risk management.",
            color: "bg-[var(--rv-bg-primary)]"
        },
        {
            title: "Pay Premium Online",
            description: "Our Financial Solutions offer tailored strategies to meet your unique goals, focusing on growth and risk management.",
            color: "bg-[var(--rv-bg-secondary)]"
        },
        {
            title: "Useful Links",
            description: "Our Financial Solutions offer tailored strategies to meet your unique goals, focusing on growth and risk management.",
            color: "bg-[var(--rv-bg-primary)]"
        },
        {
            title: "Fund Performance",
            description: "Our Financial Solutions offer tailored strategies to meet your unique goals, focusing on growth and risk management.",
            color: "bg-[var(--rv-bg-secondary)]"
        },
    ];

    return (
        <div>
            <InnerPage title={"Tools"} />

            <section className="px-4 bg-[var(--rv-bg-white)]">
                <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-[var(--rv-primary-dark)] text-3xl font-bold">
                                Our Feature
                            </h1>
                            <p className="text-[var(--rv-primary)] text-lg">
                                Key features of our finance and consulting
                            </p>
                        </div>
                        <Button
                            text="Contact Now"
                            link="/contact-us"
                            className="bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-secondary)] text-[var(--rv-white)]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-[var(--rv-primary)] rounded-lg overflow-hidden">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className={`${item.color} p-6 md:p-10 text-left border border-[var(--rv-primary)]`}
                            >
                                <h6 className="font-semibold text-[var(--rv-white)]">
                                    {item.title}
                                </h6>
                                <p className="mt-2 text-[var(--rv-white)] opacity-90 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ToolsPage;
