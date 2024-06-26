import { MarketFetchField, type Currency } from "./types";

export const comparisonChartsTimeSelectorsMap = new Map<string, string>([
  ["1D", "1"],
  ["7D", "7"],
  ["14D", "14"],
  ["1M", "31"],
  ["6M", "180"],
  ["1Y", "365"],
]);

export const currencyMap = new Map<Currency, string>([
  ["usd", "$"],
  ["eur", "€"],
  ["gbp", "£"],
  ["btc", "฿"],
  ["eth", "Ξ"],
]);
export const currencyEntries = Array.from(currencyMap.entries());

export const marketFetchParamMap = new Map<MarketFetchField, string>([
  ["market_cap", "market cap"],
  ["volume", "volume"],
]);
