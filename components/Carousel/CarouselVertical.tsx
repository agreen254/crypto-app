"use client";

import type { MarketQueryResult } from "@/utils/types";

import { flatMarketRes } from "@/utils/flatMarketRes";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import CarouselCard from "./CarouselCard";
import CarouselSkeleton from "./CarouselSkeleton";
import {
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
} from "lucide-react";

type Props = {
  queryResult: MarketQueryResult;
};

/**
 * Built using Embla:
 * https://www.embla-carousel.com/get-started/react/
 */
const CarouselVertical = ({
  queryResult: { data, isPending, isError },
}: Props) => {
  const carouselData = flatMarketRes(data?.pages);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
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
    <div className="flex flex-col items-center w-[240px]">
      <div className="mb-2">
        <button
          className="w-10 h-10 p-2 rounded-full border-2 border-teal-900 hover:bg-teal-900 transition-colors disabled:cursor-not-allowed"
          disabled={!data || !canScrollPrev}
          onClick={scrollPrev}
        >
          <ChevronUpIcon
            className="w-5 h-5 text-zinc-300"
            strokeWidth="2.5px"
          />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex flex-col h-[488px]">
            {handleCarouselRender()}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <button
          className="w-10 h-10 p-2 rounded-full border-2 border-teal-900 hover:bg-teal-900 transition-colors disabled:cursor-not-allowed"
          disabled={!data || !canScrollNext}
          onClick={scrollNext}
        >
          <ChevronDownIcon
            className="w-5 h-5 text-zinc-300"
            strokeWidth="2.5px"
          />
        </button>
      </div>
    </div>
  );
};

export default CarouselVertical;
