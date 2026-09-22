export interface CurrencyRates {
  [code: string]: number;
}

export interface FetchRatesResponse {
  rates: CurrencyRates;
  isOffline: boolean;
}