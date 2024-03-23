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
    <div>
      <div className="flex justify-center">
        <CoinDashboardMainPanel response={response} />
      </div>
      <div>
        <CoinDashboardDescriptionPanel response={response} />
      </div>
    </div>
  );
};

export default CoinDashboard;
