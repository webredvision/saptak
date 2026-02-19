"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";

const data = [
  {
    id: 1,
    title: "Retirement Planning",
    description:
      "Secure your post-retirement lifestyle with a strong financial strategy.",
    image: "/images/icons/retirement.avif",
  },
  {
    id: 2,
    title: "Education Planning",
    description:
      "Build the right corpus for your children's education journey.",
    image: "/images/icons/education.avif",
  },
  {
    id: 3,
    title: "Marriage Planning",
    description:
      "Plan for wedding expenses and future responsibilities.",
    image: "/images/icons/marriage.avif",
  },
  {
    id: 4,
    title: "Car Planning",
    description:
      "Make smart decisions for your next car purchase.",
    image: "/images/icons/car.jpg",
  },
  {
    id: 5,
    title: "House Planning",
    description:
      "Save and invest wisely to buy your dream home.",
    image: "/images/icons/house.avif",
  },
  {
    id: 6,
    title: "Vacation Planning",
    description: "Plan dream vacations without breaking the bank.",
    image: "/images/icons/vacation.jpg",
  },
  {
    id: 7,
    title: "Life Planning",
    description: "Protect your family with the right life insurance plan.",
    image: "/images/icons/insurance.jpg",
  },
];

const GoalPlanningTheme5 = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="bg-[var(--rv-bg-secondary)] px-4"
      style={{ backgroundImage: "url('/images/vector.webp')" }}>
      <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
        <Heading
          variant="light"
          title={"Our Goals"}
          heading="What are you investing for?"
          description="Plan your goals with clarity and purpose. Choose from various life events and start preparing today."
        />

        <div className="hidden lg:flex gap-4 h-[540px]">
          {data.map((item, index) => {
            const isActive = item.id === activeId;

            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => setActiveId(item.id)}
                className={`cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500
                  ${isActive
                    ? "flex-[4] bg-gradient-to-tr from-[var(--rv-bg-primary)] to-[var(--rv-bg-primary-light)] "
                    : "flex-[1] bg-[var(--rv-bg-white)]"
                  }`}
              >
                {isActive ? (
                  <div className="p-5 flex flex-col h-full justify-between">
                    <div className="flex flex-col gap-3 overflow-hidden">
                      <span className="inline-flex items-center bg-[var(--rv-bg-white)] text-[var(--rv-black)] font-semibold justify-center w-10 h-10 rounded-full border mb-4">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h5 className="font-bold">
                        {item.title}
                      </h5>

                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-60 object-cover"
                        />
                      </div>

                      <p className="opacity-90">
                        {item.description}
                      </p>
                    <Button text={'Know More'} link="/login" Icon={FiArrowRight} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-between py-6">
                    <span className="w-10 h-10 rounded-full border bg-[var(--rv-bg-primary)] text-[var(--rv-white)] flex items-center justify-center">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h6 className="rotate-90 whitespace-nowrap font-semibold">
                      {item.title}
                    </h6>

                    <span />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--rv-bg-primary)] rounded-xl p-5"
            >
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm mb-3">{item.description}</p>
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={300}
                className="rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalPlanningTheme5;
