"use client";

import { useCoinQuery } from "@/hooks/useCoin";

import CoinDashboardDescriptionPanel from "./CoinDashboardDescriptionPanel";
import CoinDashboardMainPanel from "./CoinDashboardMainPanel";

type Props = {
  id: string;
};

const CoinDashboard = ({ id }: Props) => {
  const response = useCoinQuery(id);

  return (
    <div className="flex justify-center items-start w-full gap-x-8 min-h-[150vh]">
      <div className="flex justify-center">
        <CoinDashboardMainPanel response={response} />
      </div>
      <div className="flex justify-center w-[700px]">
        <CoinDashboardDescriptionPanel response={response} />
      </div>
    </div>
  );
};

export default CoinDashboard;
