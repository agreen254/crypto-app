"use client";

import type { MarketQueryResult } from "@/utils/types";

import { flatMarketRes } from "@/utils/flatMarketRes";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import CarouselCard from "./CarouselCard";
import CarouselSkeleton from "./CarouselSkeleton";
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";

type Props = {
  queryResult: MarketQueryResult;
};

/**
 * Built using Embla:
 * https://www.embla-carousel.com/get-started/react/
 */
const CarouselHorizontal = ({
  queryResult: { data, isError, isPending },
}: Props) => {
  const carouselData = flatMarketRes(data?.pages);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    loop: false,
    slidesToScroll: 6,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleScroll = useCallback(() => {
    if (emblaApi) {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      // make sure callback will be updated whenever scrolling occurs
      emblaApi.on("slidesInView", handleScroll);
    }
  }, [emblaApi, handleScroll]);

  const handleCarouselRender = () => {
    if (isPending) {
      return <CarouselSkeleton pulse />;
    } else if (!data && isError) {
      return <CarouselSkeleton pulse={false} />;
    } else {
      return carouselData?.map((coinData) => (
        <CarouselCard key={coinData.id + "carousel"} coinData={coinData} />
      ));
    }
  };

  return (
    <div className="flex justify-center relative w-table-xl">
      <div className="absolute -left-9 top-[10px] z-10">
        <label htmlFor="scrollPrev" className="sr-only">
          Scroll carousel backward
        </label>
        <button
          id="scrollPrev"
          className="w-12 h-12 p-2 rounded-full border dark:border-teal-300 border-teal-600 dark:bg-teal-600 bg-teal-500 dark:hover:bg-teal-500 hover:bg-teal-400 transition-colors disabled:cursor-not-allowed"
          disabled={!data || !canScrollPrev}
          onClick={scrollPrev}
        >
          <ChevronLeftIcon
            className="w-5 h-5 ml-1 text-white"
            strokeWidth="2px"
          />
        </button>
      </div>
      <div className="flex justify-center">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex w-table-xl space-x-2">
            {handleCarouselRender()}
          </div>
        </div>
      </div>
      <div className="absolute -right-9 top-[10px]">
        <label htmlFor="scrollNext" className="sr-only">
          Scroll carousel forward
        </label>
        <button
          id="scrollNext"
          className="w-12 h-12 p-2 rounded-full border dark:border-teal-300 border-teal-600 dark:bg-teal-600 bg-teal-500 dark:hover:bg-teal-500 hover:bg-teal-400 transition-colors disabled:cursor-not-allowed"
          disabled={!data || !canScrollNext}
          onClick={scrollNext}
        >
          <ChevronRightIcon
            className="w-5 h-5 ml-1 text-white"
            strokeWidth="2px"
          />
        </button>
      </div>
    </div>
  );
};

export default CarouselHorizontal;
