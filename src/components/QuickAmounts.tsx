// src/components/QuickAmounts.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuickAmountsProps {
  selectedAmount: string;
  onSelect: (amount: string) => void;
}

const AMOUNTS = ['100', '250', '500', '1000'];

export const QuickAmounts: React.FC<QuickAmountsProps> = ({ selectedAmount, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rapide :</Text>
      <View style={styles.buttonsContainer}>
        {AMOUNTS.map((amt) => {
          const isSelected = selectedAmount === amt;
          return (
            <TouchableOpacity
              key={amt}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => onSelect(amt)}
            >
              <Text style={[styles.text, isSelected && styles.textSelected]}>
                {amt} €
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  buttonSelected: {
    backgroundColor: '#0042a5',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  textSelected: {
    color: '#ffffff',
  },
});