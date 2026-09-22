import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getCurrencyFlag } from '../utils/flag';

interface CurrencyCardProps {
  amount: string;
  onChangeAmount?: (text: string) => void;
  currencyCode: string;
  currencyName: string;
  isReadOnly?: boolean;
  valueColor?: string;
  onSelectCurrency?: () => void;
}

export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  amount,
  onChangeAmount,
  currencyCode,
  currencyName,
  isReadOnly = false,
  valueColor = '#1a1a1a',
  onSelectCurrency,
}) => {
  return (
    <View style={styles.card}>
      {isReadOnly ? (
        <Text style={[styles.amountText, { color: valueColor }]}>{amount}</Text>
      ) : (
        <TextInput
          style={[styles.input, { color: valueColor }]}
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
          <Text style={styles.currencyName}>{currencyName}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8edf5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  currencyInfo: {
    marginRight: 6,
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