import type {
  Market,
  MarketResponse,
  SearchTargets,
  SearchResultWrapper,
} from "./types";

import fuzzysort from "fuzzysort";

export function getSearchTargets(data: MarketResponse[]) {
  return data?.reduce((res: SearchTargets, current) => {
    return [...res, ...parseOnePage(current.market)];
  }, []);
}

export function parseOnePage(data: Market) {
  return data.reduce((res: SearchTargets, mkt) => {
    return [...res, { name: mkt.name, symbol: mkt.symbol.toUpperCase() }];
  }, []);
}

/**
 * You can't just use the library's multi-key sorting functionality because there's no way to tell which key got the highest score.
 * This method renders both the coin name and symbol, and it will only highlight the best match, i.e. the name for a name match and symbol for symbol match.
 *
 * The method uses flatMap so any null trash left over from invalid matches can be removed right away.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#for_adding_and_removing_items_during_a_map
 */
export function getSearchResults(
  targets: SearchTargets,
  searchText: string
): SearchResultWrapper[] {
  return targets.flatMap((target, idx) => {
    // specify a fallback score if no match is found that is impossibly low;
    // this way we know it needs to be excluded.
    const nameRes = fuzzysort.single(searchText, target.name) ?? {
      score: -100000,
      target: target.name,
    };
    const symbolRes = fuzzysort.single(searchText, target.symbol) ?? {
      score: -100000,
      target: target.symbol,
    };

    if (nameRes.score === -100000 && symbolRes.score === -100000) return [];
    return nameRes.score > symbolRes.score
      ? [{ result: nameRes, kind: "name", otherText: target.symbol }]
      : [{ result: symbolRes, kind: "symbol", otherText: target.name }];
  });
}
