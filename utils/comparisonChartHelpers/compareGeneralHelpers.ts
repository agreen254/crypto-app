import type { ChartColorSet } from "../types";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

import { formatPriceValue } from "../formatHelpers";

/**
 * Comparison charts will have a maximum number of points per dataset equivalent to this value.
 *
 * If the raw dataset has more points, data will be decimated (compressed) to meet the threshold
 * before being drawn.
 */
export const decimationThreshold = 150;

export const gridColor = "#27272A";
export const legendFontColor = "#A1A1AA";
export const tooltipBackgroundColor = "#121212";
export const tooltipBorderColor = "#71717A";

export function handleGradientColorStops(
  alphaValues: { alphaTop: number; alphaBottom: number },
  gradient: CanvasGradient | undefined,
  chartIdx: number,
) {
  const { r: rTop, g: gTop, b: bTop } = chartColorSets[chartIdx].startColor.rgb;
  const {
    r: rBottom,
    g: gBottom,
    b: bBottom,
  } = chartColorSets[chartIdx].endColor.rgb;

  gradient?.addColorStop(
    1,
    `rgba(${rTop}, ${gTop}, ${bTop}, ${alphaValues.alphaTop})`
  );
  gradient?.addColorStop(
    0,
    `rgba(${rBottom}, ${gBottom}, ${bBottom}, ${alphaValues.alphaBottom})`
  );
}

export function handleTicksXAxis(label: string, index: number) {
  if (index % 3 !== 0) return "";

  const date = new Date(label);
  const formattedDate = date.toLocaleString("en-US", { dateStyle: "short" });
  return formattedDate;
}

export function handleTicksYAxis(value: number, index: number) {
  if (value === 0) return 0; // don't want '0.00e0'
  return formatPriceValue(value);
}

/**
 * Line and gradient colorsets for the comparison data.
 *
 * These will be mapped over when the comparison chart has multiple datasets
 * and colors will be automatically handled.
 */
export const chartColorSets: ChartColorSet[] = [
  {
    // teal
    highlightColor: {
      hex: "#34D3D5",
      rgb: {
        r: 52,
        g: 211,
        b: 213,
      },
    },
    startColor: {
      hex: "#14B8A6",
      rgb: {
        r: 52,
        g: 211,
        b: 153,
      },
    },
    endColor: {
      hex: "#134E4A",
      rgb: {
        r: 19,
        g: 78,
        b: 74,
      },
    },
  },
  {
    // purple
    highlightColor: {
      hex: "#F57ED5",
      rgb: {
        r: 245,
        g: 126,
        b: 213,
      },
    },
    startColor: {
      hex: "#CA54D5",
      rgb: {
        r: 202,
        g: 84,
        b: 213,
      },
    },
    endColor: {
      hex: "#692570",
      rgb: {
        r: 105,
        g: 37,
        b: 112,
      },
    },
  },
  {
    // yellow
    highlightColor: {
      hex: "#EAF47B",
      rgb: {
        r: 234,
        g: 244,
        b: 123,
      },
    },
    startColor: {
      hex: "#C37D1B",
      rgb: {
        r: 195,
        g: 125,
        b: 27,
      },
    },
    endColor: {
      hex: "#D58A54",
      rgb: {
        r: 213,
        g: 138,
        b: 84,
      },
    },
  },
];
