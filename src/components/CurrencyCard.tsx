import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
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
    <View style={styles.card}>
      {isReadOnly ? (
        <Text
          style={[styles.amountText, { color: valueColor, fontSize }]}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          minimumFontScale={0.5}
        >
          {amount}
        </Text>
      ) : (
        <TextInput
          style={[styles.input, { color: valueColor, fontSize }]}
          value={amount}
          onChangeText={onChangeAmount}
          keyboardType="numeric"
          placeholder="0,00"
          placeholderTextColor="#aaa"
        />
      )}

      <TouchableOpacity style={styles.pickerButton} onPress={onSelectCurrency} activeOpacity={0.7}>
        <Text style={styles.flag}>{getCurrencyFlag(currencyCode)}</Text>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyCode}>{currencyCode}</Text>
          <Text style={styles.currencyName} numberOfLines={1}>{getCurrencyName(currencyCode)}</Text>
        </View>
        <Text style={styles.arrow}>⌵</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    minWidth: 0,
  },
  amountText: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    minWidth: 0,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8edf5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    flexShrink: 0,
    maxWidth: 160,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  currencyInfo: {
    marginRight: 6,
    maxWidth: 90,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  currencyName: {
    fontSize: 10,
    color: '#666',
  },
  arrow: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
});