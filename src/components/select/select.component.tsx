import { ChevronDown } from '@/assets/svg';
import { Colors } from '@/src/constants/Colors';
import { dimensions } from '@/src/helpers/get-dimensions';
import { useInsets } from '@/src/hooks/utils/useInsets';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Input } from '../input/input.component';
import { Text } from '../text/text.component';
import {
  Select as GSelect,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../ui/select';
import styles from './select.style';
import { SelectProps } from './select.type';

export const Select = (props: SelectProps) => {
  const { data, loading, placeholder = 'Selecciona una opción', search, onChange, loadMore, setSearch } = props;

  const insets = useInsets();
  const [selected, setSelected] = useState<string>('');

  const handleValueChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <GSelect onValueChange={handleValueChange} selectedValue={selected} style={[{ width: dimensions.width - 50 }]} >
      <SelectTrigger style={styles.trigger}>
        <SelectInput placeholder={placeholder} style={styles.input} />
        {loading ? <ActivityIndicator size={16} style={styles.loadingIcon} /> : <SelectIcon as={ChevronDown} />}
      </SelectTrigger>

      <SelectPortal>
        <SelectBackdrop />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <SelectContent style={[styles.content, { marginBottom: insets.bottom + 12 }]}>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>

            <Input placeholder="Buscar..." value={search} onChangeText={setSearch} style={styles.searchInput} />

            <FlatList
              data={data}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => {
                const isSelected = selected === item.id;
                return (
                  <SelectItem
                    label={item.name}
                    value={item}
                    textStyle={{
                      style: {
                        color: isSelected ? Colors.BLACK : Colors.TEXT,
                        fontSize: 16,
                        padding: 8,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    }}
                    style={styles.item}
                  />
                );
              }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              className="w-full gap-4"
              contentContainerStyle={styles.listContainer}
              ListFooterComponent={
                loading ? (
                  <View style={styles.footer}>
                    <ActivityIndicator size="small" />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text size={14} color={Colors.BLACK} weight={500}>
                    No se encontraron resultados
                  </Text>
                </View>
              }
            />
          </SelectContent>
        </KeyboardAvoidingView>
      </SelectPortal>
    </GSelect>
  );
};
