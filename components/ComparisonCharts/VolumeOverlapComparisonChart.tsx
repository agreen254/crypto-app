"use client";

import type { ChartData } from "chart.js";
import type { ComparisonChartResponse } from "@/utils/types";

import { prepareComparisonData } from "@/utils/comparisonChartHelpers/prepareComparisonData";
import {
  getOptionsOverlapped,
  getOverlapBackgroundColor,
  getOverlapHoverColor,
  overlapData,
} from "@/utils/comparisonChartHelpers/compareVolumeHelpers";
import { useCarouselSelectedElements } from "@/hooks/useCarousel";
import { useComparisonChartTime } from "@/hooks/useComparisonChartTime";
import { useUserCurrencySetting } from "@/hooks/useUserSettings";

import { Bar } from "react-chartjs-2";

type Props = {
  chartData: ComparisonChartResponse[];
  coinNames: string[];
};

const VolumeOverlapComparisonChart = ({ chartData, coinNames }: Props) => {
  const time = parseInt(useComparisonChartTime());
  const currency = useUserCurrencySetting();
  const coinLabels = useCarouselSelectedElements();
  const { label: x, values } = prepareComparisonData(
    chartData,
    "total_volumes"
  );
  const overlapValues = overlapData(values, coinLabels);

  const volumeChartData: ChartData<"bar"> = {
    labels: x,
    datasets: chartData.map((_, idx) => {
      return {
        backgroundColor: function (context) {
          return getOverlapBackgroundColor(
            idx,
            context,
            overlapValues,
            coinLabels
          );
        },
        hoverBackgroundColor: function (context) {
          return getOverlapHoverColor(idx, context, overlapValues, coinLabels);
        },

        data: overlapValues.map((value) => value[idx].volume),
        label: idx.toString(),
      };
    }),
  };

  return (
    <Bar
      data={volumeChartData}
      options={getOptionsOverlapped(
        currency,
        overlapValues,
        time,
        coinNames,
        coinLabels
      )}
    />
  );
};

export default VolumeOverlapComparisonChart;
