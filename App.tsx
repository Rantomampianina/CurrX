// App.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getLatestRates } from './src/services/currencyService';
import { CurrencyRates } from './src/types/currency';
import { CurrencyCard } from './src/components/CurrencyCard';
import { QuickAmounts } from './src/components/QuickAmounts';

export default function App() {
  const [rates, setRates] = useState<CurrencyRates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLatestRates();
        setRates(data.rates);
        setIsOffline(data.isOffline);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const calculateResult = (): string => {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || !rates[fromCurrency] || !rates[toCurrency]) {
      return '0,00';
    }
    const result = numericAmount * (rates[toCurrency] / rates[fromCurrency]);
    return result.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0042a5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8f9fc" />

          {/* Header avec espacement approprié pour la status bar */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>⇄</Text>
              </View>
              <Text style={styles.title}>CurrX</Text>
              <View style={styles.statusDot} />
            </View>
            <TouchableOpacity onPress={() => getLatestRates()}>
              <Text style={styles.refreshIcon}>↻</Text>
            </TouchableOpacity>
          </View>

          {/* Badge hors-ligne */}
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineText}>📡 Mode hors-ligne</Text>
            </View>
          )}

          {/* Contenu principal centré dans l'espace disponible */}
          <View style={styles.mainContent}>
            {/* Carte 'De' */}
            <CurrencyCard
              amount={amount}
              onChangeAmount={setAmount}
              currencyCode={fromCurrency}
              currencyName={fromCurrency === 'EUR' ? 'Euro' : 'Devise'}
            />

            {/* Bouton Swap central */}
            <TouchableOpacity style={styles.swapButton} onPress={handleSwap} activeOpacity={0.8}>
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>

            {/* Carte 'Vers' */}
            <CurrencyCard
              amount={calculateResult()}
              currencyCode={toCurrency}
              currencyName={toCurrency === 'USD' ? 'US Dollar' : 'Devise'}
              isReadOnly={true}
              valueColor="#0042a5"
            />

            {/* Boutons Montants Rapides */}
            <QuickAmounts selectedAmount={amount} onSelect={setAmount} />

            <Text style={styles.updateText}>Taux de change mis à jour il y a : 2 j</Text>

            {/* Bouton principal Convertir */}
            <TouchableOpacity style={styles.convertButton} activeOpacity={0.8}>
              <Text style={styles.convertButtonText}>Convertir</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dce6f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoIcon: {
    color: '#0042a5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginLeft: 6,
  },
  refreshIcon: {
    fontSize: 22,
    color: '#444',
  },
  offlineBadge: {
    alignSelf: 'center',
    backgroundColor: '#dce6f9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  offlineText: {
    fontSize: 12,
    color: '#0042a5',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#0042a5',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -14,
    zIndex: 10,
    elevation: 4,
  },
  swapIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  updateText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    marginVertical: 15,
  },
  convertButton: {
    backgroundColor: '#0042a5',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});