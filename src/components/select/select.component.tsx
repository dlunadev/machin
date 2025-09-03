import { Colors } from "@/src/constants/Colors";
import { dimensions } from "@/src/helpers/get-dimensions";
import { useInsets } from "@/src/hooks/utils/useInsets";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Input } from "../input/input.component";
import { Text } from "../text/text.component";
import { ChevronDownIcon } from "../ui/icon";
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
} from "../ui/select";
import styles from "./select.style";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  allData: Option[]; // 🔑 Pasamos toda la data o fuente de datos
  pageSize?: number;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export const Select = (props: SelectProps) => {
  const {
    allData,
    pageSize = 10,
    placeholder = "Selecciona una opción",
    onChange,
  } = props;

  const insets = useInsets();
  const [selected, setSelected] = useState<string>("");
  const [displayed, setDisplayed] = useState<Option[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleValueChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  const loadData = useCallback(
    (reset = false) => {
      setLoading(true);
      setTimeout(() => {
        const filtered = allData.filter((item) =>
          item.label.toLowerCase().includes(search.toLowerCase())
        );

        const nextPage = reset ? 1 : page;
        const start = 0;
        const end = nextPage * pageSize;

        setDisplayed(filtered.slice(start, end));
        setPage(nextPage);
        setLoading(false);
      }, 400); // simulamos delay
    },
    [allData, page, pageSize, search]
  );

  const loadMore = () => {
    const filtered = allData.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
    if (displayed.length < filtered.length) {
      setLoading(true);
      setTimeout(() => {
        const nextPage = page + 1;
        const start = 0;
        const end = nextPage * pageSize;
        setDisplayed(filtered.slice(start, end));
        setPage(nextPage);
        setLoading(false);
      }, 400);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [search]);

  return (
    <GSelect
      onValueChange={handleValueChange}
      selectedValue={selected}
      style={[{ width: dimensions.width - 50 }]}
    >
      <SelectTrigger style={styles.trigger}>
        <SelectInput placeholder={placeholder} style={styles.input} />
        {loading ? (
          <ActivityIndicator size={16} style={styles.loadingIcon} />
        ) : (
          <SelectIcon as={ChevronDownIcon} />
        )}
      </SelectTrigger>

      <SelectPortal>
        <SelectBackdrop />
        <SelectContent
          style={[styles.content, { paddingBottom: insets.bottom + 12 }]}
        >
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>

          <Input
            placeholder="Buscar..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <FlatList
            data={displayed}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = selected === item.value;
              return (
                <SelectItem
                  label={item.label}
                  value={item.value}
                  textStyle={{
                    style: {
                      color: isSelected ? Colors.BLACK : Colors.GRAY,
                      fontSize: 16,
                      padding: 8,
                      fontWeight: isSelected ? "600" : "400",
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
      </SelectPortal>
    </GSelect>
  );
};
