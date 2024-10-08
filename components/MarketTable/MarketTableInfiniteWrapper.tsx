"use client";

import type { MarketQueryResult } from "@/utils/types";

import { addMarketIndices } from "@/utils/addMarketIndices";
import { marketTableSort } from "@/utils/marketTableSort";
import { flatMarketRes } from "@/utils/flatMarketRes";
import { useMarketParams } from "@/hooks/useMarketParams";

import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/components/Loader";
import MarketTable from "./MarketTable";
import MarketTableCaption from "./MarketTableCaption";
import { getNumMarketRecords } from "@/utils/getNumMarketRecords";

type Props = {
  queryResult: MarketQueryResult;
};

const MarketTableInfiniteWrapper = ({
  queryResult: { data, error, isPending, isFetching, fetchNextPage },
}: Props) => {
  const { order, orderBy } = useMarketParams();

  const tableData = flatMarketRes(data?.pages) || [];
  const indexedData = addMarketIndices(tableData);
  const sortedData = marketTableSort(indexedData, order, orderBy);

  const showLoader = !error && (isPending || isFetching);

  /**
   * Using the loader prop of the InfiniteScroll component
   * creates a second scrollbar nested within the table;
   * to avoid this handle loading below the component.
   */
  return (
    <div>
      <div className="flex flex-col mb-[100vh] screen-lg:mb-[20vh]">
        <MarketTableCaption numRecords={getNumMarketRecords(data)} />
        <InfiniteScroll
          dataLength={tableData?.length || 0}
          next={fetchNextPage}
          hasMore={!data?.pages?.length || data.pages.length < 10}
          loader={<></>}
          endMessage={<p>End of list.</p>}
        >
          <div className="flex flex-col">
            <MarketTable data={sortedData} />
          </div>
        </InfiniteScroll>
        {showLoader && <Loader />}
      </div>
    </div>
  );
};

export default MarketTableInfiniteWrapper;
