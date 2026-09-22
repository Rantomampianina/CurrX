// src/components/CurrencyModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { getCurrencyFlag } from '../utils/flag';
import { CurrencyRates } from '../types/currency';

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedCurrency: string;
  rates: CurrencyRates;
}

const REGIONS = ['Populaires', 'Europe', 'Amériques', 'Asie'];

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCurrency,
  rates,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Populaires');

  const currenciesArray = Object.entries(rates).map(([code, rate]) => ({
    code,
    rate,
  }));

  const filteredCurrencies = currenciesArray.filter((item) =>
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Poignée supérieure */}
          <View style={styles.handle} />

          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.title}>Sélectionner une devise</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par nom ou code (ex: USD)"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Chips de régions */}
          <View style={styles.regionsContainer}>
            {REGIONS.map((region) => {
              const isSelected = selectedRegion === region;
              return (
                <TouchableOpacity
                  key={region}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedRegion(region)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {region}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Liste des devises */}
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = item.code === selectedCurrency;
              return (
                <TouchableOpacity
                  style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                  onPress={() => {
                    onSelect(item.code);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemLeft}>
                    <View style={styles.flagCircle}>
                      <Text style={styles.flagText}>{getCurrencyFlag(item.code)}</Text>
                    </View>
                    <View>
                      <Text style={styles.itemCode}>{item.code}</Text>
                      <Text style={styles.itemName}>Taux officiel</Text>
                    </View>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.itemRate}>{item.rate.toFixed(4)}</Text>
                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '80%',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 48,
    marginVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  regionsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  chip: {
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#dce6f9',
  },
  chipText: {
    fontSize: 13,
    color: '#555',
  },
  chipTextSelected: {
    color: '#0042a5',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fc',
    borderRadius: 18,
    padding: 14,
    marginVertical: 5,
  },
  itemCardSelected: {
    backgroundColor: '#e8edf5',
    borderWidth: 1,
    borderColor: '#0042a5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flagText: {
    fontSize: 22,
  },
  itemCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  itemName: {
    fontSize: 12,
    color: '#777',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0042a5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});