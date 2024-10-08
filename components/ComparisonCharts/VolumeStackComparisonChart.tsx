"use client";

import type { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

import type {
  ChartResponsiveValues,
  ComparisonChartResponse,
} from "@/utils/types";
import { chartColorSets } from "@/utils/comparisonChartHelpers/compareGeneralHelpers";
import {
  getOptionsStacked,
  volumeComparisonGradient,
} from "@/utils/comparisonChartHelpers/compareVolumeHelpers";
import { prepareComparisonData } from "@/utils/comparisonChartHelpers/prepareComparisonData";
import { useCarouselSelectedElements } from "@/hooks/useCarousel";
import { useComparisonChartTime } from "@/hooks/useComparisonChartTime";
import { useUserCurrencySetting } from "@/hooks/useUserSettings";
import { useThemeTyped } from "@/hooks/useThemeTyped";
import { useNumVolumeBars } from "@/hooks/useNumVolumeBars";

type Props = {
  chartData: ComparisonChartResponse[];
  coinNames: string[];
  responsiveValues: ChartResponsiveValues;
};

const VolumeStackComparisonChart = ({
  chartData,
  coinNames,
  responsiveValues,
}: Props) => {
  const currency = useUserCurrencySetting();
  const time = useComparisonChartTime();
  const coinLabels = useCarouselSelectedElements();
  const numBars = useNumVolumeBars();

  const { label, values } = prepareComparisonData(
    chartData,
    "total_volumes",
    numBars
  );
  const theme = useThemeTyped();

  const volumeChartData: ChartData<"bar"> = {
    labels: label,

    datasets: chartData.map((_, idx) => {
      return {
        backgroundColor: function (context) {
          return volumeComparisonGradient(context, idx);
        },
        categoryPercentage: 0.9,
        barPercentage: 1,
        hoverBackgroundColor: chartColorSets[idx].highlightColor.hex,
        data: values[idx],
        label: coinLabels[idx],
      };
    }),
  };

  return (
    <Bar
      data={volumeChartData}
      options={getOptionsStacked(
        currency,
        parseInt(time),
        coinNames,
        theme,
        responsiveValues
      )}
    />
  );
};

export default VolumeStackComparisonChart;
