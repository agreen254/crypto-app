"use client";

import { motion } from "framer-motion";

import { AnimatePresence } from "framer-motion";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
  categories: string[];
};

const CoinCategoriesCarousel = ({ categories }: Props) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      playOnInit: true,
      speed: 0.8,
      startDelay: 0,
      stopOnFocusIn: false,
      stopOnInteraction: false,
    }),
  ]);

  // The carousel needs to be a minimum of twice the width of its parent div or it will stop scrolling.
  // As a safeguard, expand the categories array until it's big enough that we don't have to worry about the total width.
  const minSafeLength = 30;
  const expandCategories = () => {
    const result = categories;
    while (result.length < minSafeLength) {
      result.push(...categories);
    }
    return result;
  };

  if (categories.length === 0) return <div className="h-8"></div>;
  return (
    <AnimatePresence>
      <motion.div
        key="categoriesCarousel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 100 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeIn", duration: 1.0 }}
        className="max-w-full"
      >
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {expandCategories().map((cat, idx) => (
              <div
                key={cat + idx}
                className="flex-[0_0_auto] max-w-full pl-12 min-w-0 h-8 text-muted-foreground font-light"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CoinCategoriesCarousel;
