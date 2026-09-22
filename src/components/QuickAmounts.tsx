import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface QuickAmountsProps {
  selectedAmount: string;
  onSelect: (amount: string) => void;
  currencyCode: string;
}

const AMOUNTS = ['100', '250', '500', '1000'];

/** Retourne le symbole court d'une devise (€, $, £…) ou le code ISO si trop ambigu. */
const getCurrencySymbol = (code: string): string => {
  try {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
    const symbol = formatted.replace(/[\d\s\u00A0\u202F,]/g, '').trim();
    return symbol.length > 2 ? code : symbol;
  } catch {
    return code;
  }
};

export const QuickAmounts: React.FC<QuickAmountsProps> = ({
  selectedAmount,
  onSelect,
  currencyCode,
}) => {
  const symbol = getCurrencySymbol(currencyCode);

  return (
    <View className="flex-row items-center mt-3">
      <Text className="text-[13px] text-gray-500 mr-2.5">Rapide :</Text>
      <View className="flex-row flex-1 justify-between">
        {AMOUNTS.map((amt) => {
          const isSelected = selectedAmount === amt;
          return (
            <TouchableOpacity
              key={amt}
              className={`px-3 py-2 rounded-2xl ${
                isSelected ? 'bg-blue-600' : 'bg-slate-100'
              }`}
              onPress={() => onSelect(amt)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-[13px] font-semibold ${
                  isSelected ? 'text-white' : 'text-slate-700'
                }`}
              >
                {amt} {symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};