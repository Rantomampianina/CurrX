import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftRight, ArrowUpDown, RefreshCw, WifiOff } from 'lucide-react-native';
import { getLatestRates } from './src/services/currencyService';
import { CurrencyRates } from './src/types/currency';
import { CurrencyCard } from './src/components/CurrencyCard';
import { CurrencyModal } from './src/components/CurrencyModal';
import { QuickAmounts } from './src/components/QuickAmounts';

export default function App() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectingTarget, setSelectingTarget] = useState<'from' | 'to'>('from');
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

  const openModalFor = (target: 'from' | 'to') => {
    setSelectingTarget(target);
    setModalVisible(true);
  };

  const handleSelectCurrency = (code: string) => {
    if (selectingTarget === 'from') {
      setFromCurrency(code);
    } else {
      setToCurrency(code);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'left', 'right', 'bottom']}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

          {/* Header épuré sous la status bar */}
          <View className="flex-row justify-between items-center px-5 py-3">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-2">
                <ArrowLeftRight size={16} color="#2563eb" strokeWidth={2.5} />
              </View>
              <Text className="text-xl font-bold text-slate-900">CurrX</Text>
              <View className="w-2 h-2 rounded-full bg-green-500 ml-1.5" />
            </View>
            <TouchableOpacity onPress={() => getLatestRates()} activeOpacity={0.6}>
              <RefreshCw size={22} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Chip hors-ligne */}
          {isOffline && (
            <View className="flex-row items-center self-center bg-blue-100 px-3.5 py-1.5 rounded-full mb-2.5">
              <WifiOff size={14} color="#2563eb" className="mr-1.5" />
              <Text className="text-xs font-semibold text-blue-600">Mode hors-ligne</Text>
            </View>
          )}

          {/* Contenu principal centré */}
          <View className="flex-1 justify-center px-5 pb-5">
            {/* Carte 'De' */}
            <CurrencyCard
              amount={amount}
              onChangeAmount={setAmount}
              currencyCode={fromCurrency}
              onSelectCurrency={() => openModalFor('from')}
            />

            {/* Bouton Swap central superposé */}
            <TouchableOpacity
              className="-my-3 z-10 bg-blue-600 w-12 h-12 rounded-full items-center justify-center self-center shadow-md"
              onPress={handleSwap}
              activeOpacity={0.8}
            >
              <ArrowUpDown size={20} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Carte 'Vers' */}
            <CurrencyCard
              amount={calculateResult()}
              currencyCode={toCurrency}
              isReadOnly={true}
              valueColor="#2563eb"
              onSelectCurrency={() => openModalFor('to')}
            />

            {/* Boutons Montants Rapides */}
            <QuickAmounts selectedAmount={amount} onSelect={setAmount} currencyCode={fromCurrency} />

            <Text className="text-center text-gray-500 text-xs my-4">
              Taux de change mis à jour il y a : 2 j
            </Text>

            {/* Bouton principal Convertir */}
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-full items-center shadow-md"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-bold">Convertir</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      {/* Modale hors du TouchableWithoutFeedback pour ne pas bloquer les taps */}
      <CurrencyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectCurrency}
        selectedCurrency={selectingTarget === 'from' ? fromCurrency : toCurrency}
        rates={rates}
      />
    </SafeAreaProvider>
  );
}