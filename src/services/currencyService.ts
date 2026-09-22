import { fetchOnlineRates } from './api';
import { saveRatesToDB, getRatesFromDB } from '../database/db';
import { FetchRatesResponse } from '../types/currency';

export const getLatestRates = async (): Promise<FetchRatesResponse> => {
  // 1. Tenter la récupération en ligne
  const onlineRates = await fetchOnlineRates();

  if (onlineRates) {
    // 2. Mettre à jour le cache SQLite en arrière-plan
    await saveRatesToDB(onlineRates);
    return { rates: onlineRates, isOffline: false };
  }

  // 3. Si hors-ligne, lire depuis le cache local
  const cachedRates = await getRatesFromDB();
  return { rates: cachedRates, isOffline: true };
};