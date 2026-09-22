export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  EUR: 'EU',
  USD: 'US',
  GBP: 'GB',
  JPY: 'JP',
  CAD: 'CA',
  CHF: 'CH',
  AUD: 'AU',
  CNY: 'CN',
  MGA: 'MG',
};

export const getCurrencyFlag = (currencyCode: string): string => {
  const countryCode = CURRENCY_TO_COUNTRY[currencyCode] || currencyCode.substring(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};