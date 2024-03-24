import { useCoinQuery } from "@/hooks/useCoin";

import CoinCategoriesCarousel from "./CoinCategoriesCarousel";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";

type Props = {
  response: ReturnType<typeof useCoinQuery>;
};

const CoinDashboardMainPanel = ({ response }: Props) => {
  const { data, isLoading } = response;

  if (isLoading) return <></>;
  if (!data) return <></>;

  const {
    name,
    symbol,
    categories,
    image: { large: logoURL },
  } = data;

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 m-auto w-[564px] rounded-xl">
      <div className="flex flex-col items-center mt-14 mb-3">
        <Image
          src={logoURL}
          width={80}
          height={80}
          alt={"logo for " + name}
          priority
        />
        <h2 className="mt-1">
          <span className="text-xl">{name} </span>
          <span className="uppercase font-semibold text-zinc-400">
            {symbol}
          </span>
        </h2>
      </div>
      <div className="mb-8">
        <ErrorBoundary fallback={<div className="h-8"></div>}>
          <CoinCategoriesCarousel categories={categories ?? []} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CoinDashboardMainPanel;
