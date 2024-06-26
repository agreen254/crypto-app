export function localeFormat(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Shortens very long coin names that will cause styling issues in the market table.
 */
export function formatLongName(
  name: string,
  maxLen: number = 18,
  symbol?: string
) {
  const symbolLen = symbol?.length ?? 0;
  if (name.length + symbolLen >= maxLen) {
    return name.slice(0, 14).trim() + "...";
  } else {
    return name;
  }
}

/**
 * Formats the price change percentage, ensure it will only have two digits after the decimal.
 */
export function formatPriceChangePercentage(price: number) {
  return padTwoDecimals(roundDigits(price, 2).toString());
}

/**
 * Succinctly formats prices.
 * If the price is less than 1/100, it is shown in exponential notation.
 * If the price is greater than 1/100, it can be prefixed.
 *
 * 0.0001 -> 1e-4
 * 100_000 -> 100k
 * 2_000_000 -> 2M
 */
export function formatPriceValue(
  price: number,
  numTrailing: number = 2,
  notation: Intl.NumberFormatOptions["notation"] = "compact"
) {
  return Math.abs(price) < 0.01
    ? formatSmallNum(price)
    : Intl.NumberFormat("en-US", {
        notation: notation,
        maximumFractionDigits: numTrailing,
      }).format(price);
}

/**
 * Saves table space by using scientific notation for very small numbers.
 * e.g. 0.000001 -> 1e-6
 */
export function formatSmallNum(n: number): string {
  return n < 0.01 ? n.toExponential(2) : n.toString();
}

/**
 * Used so percentage changes or currency will have two numbers after the decimal.
 * e.g. 10.2% -> 10.20%
 */
export function padTwoDecimals(input: string) {
  const [beforeDecimal, afterDecimal] = input.split(".");

  if (!afterDecimal) return `${beforeDecimal}.00`;
  else return `${beforeDecimal}.${afterDecimal.padEnd(2, "0")}`;
}

/**
 * Rounds the input to the specified number of digits.
 */
export function roundDigits(n: number, numDigits: number): number {
  const tenPow = 10 ** numDigits;
  return Math.abs(Math.round(n * tenPow) / tenPow);
}
