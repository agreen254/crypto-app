import {
  MarketFetchField,
  MarketFetchOrder,
  MarketFetchOrderBy,
  MarketTableMode,
} from "@/utils/types";

export const MARKET_FIELD_KEY = "field";
export const MARKET_ORDER_KEY = "order";
export const MARKET_ORDER_BY_KEY = "order_by";
export const MARKET_TABLE_MODE_KEY = "table_mode";

export const DEFAULT_MARKET_FIELD: MarketFetchField = "market_cap";
export const DEFAULT_MARKET_ORDER: MarketFetchOrder = "called_index";
export const DEFAULT_MARKET_ORDER_BY: MarketFetchOrderBy = "asc";
export const DEFAULT_MARKET_TABLE_MODE: MarketTableMode = "paginated";

export const DEFAULT_DECIMATION_THRESHOLD = 150;

export const ANALYSIS_DROPDOWN_ID = "analysisCoin";
export const ANALYSIS_EXPORT_FORMATS = ["xlsx", "csv"] as const;
export const MAX_NUM_ANALYSIS_SERIES = 3;

export const SCREEN_SIZE_XL = 1500;
export const SCREEN_SIZE_LG = 1200;
export const SCREEN_SIZE_MD = 900;
export const SCREEN_SIZE_SM = 640;
export const SCREEN_SIZE_XS = 375;
