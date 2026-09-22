import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { Search, X, Check } from 'lucide-react-native';
import { getCurrencyFlag } from '../utils/flag';
import { getCurrencyName } from '../utils/currencies';
import { getCurrencyRegions } from '../utils/regions';
import { CurrencyRates } from '../types/currency';

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedCurrency: string;
  rates: CurrencyRates;
}

const REGIONS = [
  'Tous',
  'Populaires',
  'Europe',
  'Amériques',
  'Asie',
  'Moyen-Orient',
  'Afrique',
  'Océanie',
];

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCurrency,
  rates,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tous');

  const currenciesArray = Object.entries(rates).map(([code, rate]) => ({
    code,
    rate,
  }));

  const filteredCurrencies = currenciesArray
    .filter(
      (item) =>
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCurrencyName(item.code).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (item) =>
        selectedRegion === 'Tous' ||
        getCurrencyRegions(item.code).includes(selectedRegion)
    );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl h-[80%] px-5 pt-2.5">
          {/* Poignée supérieure */}
          <View className="w-9 h-1 bg-slate-200 rounded-full self-center my-2" />

          {/* En-tête */}
          <View className="flex-row justify-between items-center my-2.5">
            <Text className="text-xl font-bold text-slate-900">Sélectionner une devise</Text>
            <TouchableOpacity
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={14} color="#64748b" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Barre de recherche */}
          <View className="flex-row items-center bg-slate-100 rounded-2xl px-3.5 h-12 my-2.5">
            <Search size={18} color="#94a3b8" className="mr-2" />
            <TextInput
              className="flex-1 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Rechercher par nom ou code (ex: USD)"
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Chips de régions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-grow-0 my-2.5">
            <View className="flex-row">
              {REGIONS.map((region) => {
                const isSelected = selectedRegion === region;
                return (
                  <TouchableOpacity
                    key={region}
                    className={`px-3.5 py-2 rounded-full mr-2 ${
                      isSelected ? 'bg-blue-100' : 'bg-slate-100'
                    }`}
                    onPress={() => setSelectedRegion(region)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-[13px] ${
                        isSelected ? 'text-blue-600 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {region}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Liste des devises */}
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.code === selectedCurrency;
              return (
                <TouchableOpacity
                  className={`flex-row justify-between items-center bg-slate-50 rounded-2xl p-3.5 my-1.5 ${
                    isSelected ? 'bg-blue-50 border border-blue-600' : ''
                  }`}
                  onPress={() => {
                    onSelect(item.code);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3">
                      <Text className="text-[22px]">{getCurrencyFlag(item.code)}</Text>
                    </View>
                    <View>
                      <Text className="text-base font-bold text-slate-900">{item.code}</Text>
                      <Text className="text-xs text-gray-500" numberOfLines={1}>
                        {getCurrencyName(item.code)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-[15px] font-semibold text-slate-900 mr-2">
                      {item.rate.toFixed(4)}
                    </Text>
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
                        <Check size={14} color="#ffffff" strokeWidth={3} />
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