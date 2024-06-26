/**
 * Generates a new date object given the string following the API format DD-MM-YYYY
 */
export function extractDate(date: string) {
  const [day, month, year] = date.split("-");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * The input date is using UTC at midnight, but the date shown to the user should be in the user's locale.
 * If we just convert to a locale string without accounting for this, the date will go down a day if the time zone shifts back from UTC.
 */
export function convertHistoricalDate(date: Date) {
  return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000)
    .toLocaleDateString("en-GB")
    .replaceAll("/", "-");
}

/**
 * The date input is stored internally as YYYY-MM-DD, but the coingecko API needs the form DD-MM-YYYY
 */
export function swapDateApiToInput(apiDate: string) {
  const [day, month, year] = apiDate.split("-");
  return [year, month, day].join("-");
}

/**
 *
 */
export function lastYear() {
  const date = new Date();
  return new Date(date.valueOf() - 1000 * 60 * 60 * 24 * 365);
}
