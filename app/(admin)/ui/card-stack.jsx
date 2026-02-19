"use client";;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval;

export const CardStack = ({
  items,
  offset,
  scaleFactor
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()); // move the last element to the front
        return newArray;
      });
    }, 1000);
  };

  return (
    (<div className="relative h-60 w-60 md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          (<motion.div
            key={card.id}
            className="absolute dark:bg-[var(--rv-bg-black)] bg-[var(--rv-bg-white)] h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-[var(--rv-gray-light)] dark:border-[var(--rv-white)]/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}>
            <div className="font-normal text-[var(--rv-gray-dark)] dark:text-[var(--rv-gray-light)]">
              {card.content}
            </div>
            <div>
              <p className="text-[var(--rv-gray)] font-medium dark:text-[var(--rv-white)]">
                {card.name}
              </p>
              <p className="text-[var(--rv-gray)] font-normal dark:text-[var(--rv-gray-light)]">
                {card.designation}
              </p>
            </div>
          </motion.div>)
        );
      })}
    </div>)
  );
};
