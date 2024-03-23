"use client";

import { useCoinQuery } from "@/hooks/useCoin";
import Image from "next/image";
import CoinCategoriesCarousel from "./CoinCategoriesCarousel";

type Props = {
  id: string;
};

const CoinDashboard = ({ id }: Props) => {
  const { data, isLoading } = useCoinQuery(id);

  if (isLoading || !data) return <div></div>;
  const {
    name,
    symbol,
    categories,
    image: { large: img },
  } = data;

  return (
    <div>
      <div>
        <div className="flex justify-center basis-1/2">
          <div className="bg-zinc-900/70 border border-zinc-800 m-auto w-[300px] rounded-xl">
            <div className="flex flex-col items-center mt-10 mb-2">
              <Image
                src={img}
                width={75}
                height={75}
                alt={"logo for " + data.name}
                priority
              />
              <h2>
                <span className="text-xl">{name} </span>
                <span className="uppercase font-semibold text-zinc-400">
                  {symbol}
                </span>
              </h2>
            </div>
            <div className="mb-4">
              <CoinCategoriesCarousel categories={categories ?? []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDashboard;
