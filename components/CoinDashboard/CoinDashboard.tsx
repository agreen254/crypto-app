"use client";

import { useCoinQuery } from "@/hooks/useCoin";

type Props = {
  id: string;
};

const CoinDashboard = ({ id }: Props) => {
  const { data } = useCoinQuery(id);

  return (
    <div>
      {data && (
        <>
          <p>{data.id}</p>
          <p>{data.symbol}</p>
          <p>{data.name}</p>
        </>
      )}
    </div>
  );
};

export default CoinDashboard;
