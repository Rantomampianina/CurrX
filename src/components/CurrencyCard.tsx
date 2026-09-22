import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { getCurrencyFlag } from '../utils/flag';
import { getCurrencyName } from '../utils/currencies';

interface CurrencyCardProps {
  amount: string;
  onChangeAmount?: (text: string) => void;
  currencyCode: string;
  isReadOnly?: boolean;
  valueColor?: string;
  onSelectCurrency?: () => void;
}

/** Formate un nombre en chaîne avec des espaces insécables comme séparateurs de milliers. */
const formatWithSpaces = (value: string): string => {
  const num = parseFloat(value.replace(',', '.').replace(/\s/g, ''));
  if (isNaN(num)) return value;
  return num.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
};

/** Calcule la taille de police selon la longueur du texte affiché. */
const getDynamicFontSize = (text: string): number => {
  const len = text.length;
  if (len <= 6)  return 32;
  if (len <= 9)  return 26;
  if (len <= 12) return 20;
  if (len <= 15) return 16;
  return 13;
};

export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  amount,
  onChangeAmount,
  currencyCode,
  isReadOnly = false,
  valueColor = '#1a1a1a',
  onSelectCurrency,
}) => {
  const displayValue = isReadOnly ? amount : formatWithSpaces(amount);
  const fontSize = getDynamicFontSize(displayValue);

  return (
    <View className="flex-row items-center justify-between bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
      {isReadOnly ? (
        <Text
          className="font-bold flex-1 mr-2.5 min-w-0"
          style={{ color: valueColor, fontSize }}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          minimumFontScale={0.5}
        >
          {amount}
        </Text>
      ) : (
        <TextInput
          className="font-bold flex-1 mr-2.5 min-w-0 text-slate-900 placeholder:text-gray-400"
          style={{ fontSize }}
          value={amount}
          onChangeText={onChangeAmount}
          keyboardType="numeric"
          placeholder="0,00"
          placeholderTextColor="#9ca3af"
        />
      )}

      <TouchableOpacity
        className="bg-slate-100 px-3 py-2 rounded-2xl flex-row items-center gap-2 flex-shrink-0 max-w-[60%]"
        onPress={onSelectCurrency}
        activeOpacity={0.7}
      >
        <Text className="text-xl">{getCurrencyFlag(currencyCode)}</Text>
        <View className="mr-1 max-w-[105px]">
          <Text className="text-sm font-bold text-slate-900">{currencyCode}</Text>
          <Text className="text-[10px] text-gray-500" numberOfLines={1}>
            {getCurrencyName(currencyCode)}
          </Text>
        </View>
        <ChevronDown size={16} color="#475569" />
      </TouchableOpacity>
    </View>
  );
};