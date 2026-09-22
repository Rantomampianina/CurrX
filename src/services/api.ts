import { CurrencyRates } from '../types/currency';

const API_URL = 'https://open.er-api.com/v6/latest/USD';

export const fetchOnlineRates = async (): Promise<CurrencyRates | null> => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.result === 'success') {
      return data.rates as CurrencyRates;
    }
    return null;
  } catch (error) {
    return null;
  }
};