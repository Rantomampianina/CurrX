// src/database/db.ts
import * as SQLite from 'expo-sqlite';
import { CurrencyRates } from '../types/currency';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) return dbInstance;

  console.log('[SQLite] Ouverture de la base de données...');
  dbInstance = await SQLite.openDatabaseAsync('currx.db');

  console.log('[SQLite] Initialisation de la table rates...');
  await dbInstance.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS rates (
      code TEXT PRIMARY KEY NOT NULL,
      rate REAL NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  console.log('[SQLite] Base de données prête.');
  return dbInstance;
};

export const saveRatesToDB = async (rates: CurrencyRates): Promise<void> => {
  try {
    const db = await openDatabase();
    const now = new Date().toISOString();

    console.log('[SQLite] Sauvegarde des taux dans la BDD...');
    await db.withTransactionAsync(async () => {
      for (const [code, rate] of Object.entries(rates)) {
        await db.runAsync(
          'INSERT OR REPLACE INTO rates (code, rate, updatedAt) VALUES (?, ?, ?);',
          [code, rate, now]
        );
      }
    });
    console.log('[SQLite] Sauvegarde terminée.');
  } catch (error) {
    console.error('[SQLite] Erreur lors de la sauvegarde:', error);
  }
};

export const getRatesFromDB = async (): Promise<CurrencyRates> => {
  try {
    const db = await openDatabase();
    console.log('[SQLite] Lecture du cache local...');
    const rows = await db.getAllAsync<{ code: string; rate: number }>('SELECT code, rate FROM rates;');
    
    const ratesMap: CurrencyRates = {};
    rows.forEach((row) => {
      ratesMap[row.code] = row.rate;
    });

    console.log(`[SQLite] ${Object.keys(ratesMap).length} taux récupérés depuis le cache.`);
    return ratesMap;
  } catch (error) {
    console.error('[SQLite] Erreur lors de la lecture locale:', error);
    return {};
  }
};