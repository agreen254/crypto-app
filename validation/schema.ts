import { z } from "zod";

export const validCurrenciesSchema = z.union([
  z.literal("usd"),
  z.literal("eur"),
  z.literal("gbp"),
  z.literal("btc"),
  z.literal("eth"),
]);

export const coinRequestSchema = z.object({
  id: z.string(),
});

export const coinResponseSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  categories: z.string().array(),
  description: z.object({
    en: z.string(),
  }),
  links: z.object({
    homepage: z.string().array(),
    blockchain_site: z.string().array(),
    twitter_screen_name: z.string(),
    subreddit_url: z.string(),
    repos_url: z.object({
      github: z.string().array(),
    }),
  }),
  image: z.object({
    thumb: z.string(),
    small: z.string(),
    large: z.string(),
  }),
  genesis_date: z.string(),
  market_cap_rank: z.number(),
  market_data: z.object({
    current_price: z.object({
      usd: z.number(),
      eur: z.number(),
      gbp: z.number(),
      btc: z.number(),
      eth: z.number(),
    }),
    ath: z.object({
      usd: z.number(),
      eur: z.number(),
      gbp: z.number(),
      btc: z.number(),
      eth: z.number(),
    }),
    ath_date: z.object({
      usd: z.string(),
      eur: z.string(),
      gbp: z.string(),
      btc: z.string(),
      eth: z.string(),
    }),
    atl: z.object({
      usd: z.number(),
      eur: z.number(),
      gbp: z.number(),
      btc: z.number(),
      eth: z.number(),
    }),
    atl_date: z.object({
      usd: z.string(),
      eur: z.string(),
      gbp: z.string(),
      btc: z.string(),
      eth: z.string(),
    }),
    market_cap: z.object({
      usd: z.number(),
      eur: z.number(),
      gbp: z.number(),
      btc: z.number(),
      eth: z.number(),
    }),
    fully_diluted_valuation: z.object({
      usd: z.number(),
      eur: z.number(),
      gbp: z.number(),
      btc: z.number(),
      eth: z.number(),
    }),
    total_volume: z.object({
      usd: z.number(),
      eur: z.number(),
      gbp: z.number(),
      btc: z.number(),
      eth: z.number(),
    }),
    price_change_percentage_24h: z.number().nullable(),
    price_change_percentage_7d: z.number().nullable(),
    price_change_percentage_14d: z.number().nullable(),
    price_change_percentage_30d: z.number().nullable(),
    price_change_percentage_60d: z.number().nullable(),
    price_change_percentage_200d: z.number().nullable(),
    price_change_percentage_1y: z.number().nullable(),
    market_cap_change_percentage_24h: z.number(),
    max_supply: z.number(),
    circulating_supply: z.number(),
  }),
});

// each id represents a selected carousel element
export const comparisonChartQueriesSchema = z.object({
  ids: z.string().array(),
  currency: validCurrenciesSchema,
  days: z.string(),
});

// queries are dispatched to the backend individually
export const comparisonChartRequestSchema = comparisonChartQueriesSchema
  .omit({ ids: true })
  .extend({
    id: z.string(),
  });

/**
 * The coingecko API docs specify the following return intervals:
 * 1 day from current time: 5 minute interval
 * 2-90 days from current time: Hourly interval
 * >90 days from current time: Daily interval (00:00 UTC)
 *
 * Each element follows the same format:
 * time (UNIX)
 * value (currency)
 */
export const comparisonChartResponseSchema = z.object({
  prices: z.array(z.array(z.number().nullable()).length(2)),
  market_caps: z.array(z.array(z.number().nullable()).length(2)),
  total_volumes: z.array(z.array(z.number().nullable()).length(2)),
});

export const globalResponseSchema = z.object({
  active_cryptocurrencies: z.number(),
  markets: z.number(),
  total_market_cap: z.object({
    btc: z.number(),
    eth: z.number(),
    eur: z.number(),
    gbp: z.number(),
    usd: z.number(),
  }),
  total_volume: z.object({
    btc: z.number(),
    eth: z.number(),
    eur: z.number(),
    gbp: z.number(),
    usd: z.number(),
  }),
  market_cap_percentage: z.object({
    btc: z.number(),
    eth: z.number(),
  }),
  market_cap_change_percentage_24h_usd: z.number(),
});

export const marketFetchParamSchema = z.union([
  z.literal("market_cap"),
  z.literal("volume"),
]);

export const marketRequest = z.object({
  page: z.number(),
  currency: validCurrenciesSchema,
  fetchParam: marketFetchParamSchema,
  fetchOrder: z.union([z.literal("asc"), z.literal("desc")]),
});

export const marketElementNoIdxSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),

  current_price: z.number(),
  market_cap: z.number(),
  market_cap_rank: z.number().nullable(),
  fully_diluted_valuation: z.number().nullable(),
  total_volume: z.number(),
  high_24h: z.number(),
  low_24h: z.number(),
  price_change_24h: z.number(),
  price_change_percentage_24h: z.number(),
  market_cap_change_24h: z.number(),
  market_cap_change_percentage_24h: z.number(),
  circulating_supply: z.number(),
  total_supply: z.number().nullable(),
  max_supply: z.number().nullable(),

  ath: z.number(),
  ath_change_percentage: z.number(),
  ath_date: z.string(),
  atl: z.number(),
  atl_change_percentage: z.number(),
  atl_date: z.string(),
  roi: z
    .object({
      times: z.number(),
      currency: z.string(),
      percentage: z.number(),
    })
    .nullable(),
  last_updated: z.string(),

  sparkline_in_7d: z.object({
    price: z.number().array(),
  }),
  price_change_percentage_1h_in_currency: z.number().nullable(),
  price_change_percentage_24h_in_currency: z.number().nullable(),
  price_change_percentage_7d_in_currency: z.number().nullable(),
});

export const marketElementWithIdxSchema = marketElementNoIdxSchema.extend({
  called_index: z.number(),
});

export const marketSchema = z.array(marketElementNoIdxSchema);
export const marketResponseSchema = z.object({
  market: marketSchema,
  nextPage: z.number(),
});
