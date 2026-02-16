import { ActionSheet, Button, Input, CheckIcon, Text } from '@/src/shared/components';
import { FlatList, ActivityIndicator, View, Pressable } from 'react-native';
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '@/src/shared/components/ui/checkbox';
import { useInsets } from '@/src/shared/hooks/utils/useInsets';
import styles from '@/src/shared/components/select/select.style';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Client } from '../../../model';

interface ClientSelectorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  clientVM: {
    clients: Client[];
    isLoading: boolean;
    loadMore: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    toggleClient: (client: Client) => void;
    isClientSelected: (clientId: string) => boolean;
  };
  onFinish: () => void;
  loading: boolean;
}

export const ClientSelectorSheet = ({
  isOpen,
  onClose,
  clientVM,
  onFinish,
  loading,
}: ClientSelectorSheetProps) => {
  const insets = useInsets();
  
  return (
    <ActionSheet isOpen={isOpen} onClose={onClose}>
      <Input
        placeholder="Buscar..."
        value={clientVM.searchQuery}
        onChangeText={clientVM.setSearchQuery}
        style={styles.searchInput}
      />

      <FlatList
        data={clientVM.clients}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <Pressable className="p-2 flex-row items-center justify-between">
            <Checkbox
              value={item.id.toString()}
              isChecked={clientVM.isClientSelected(item.id)}
              onChange={() => clientVM.toggleClient(item)}
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <Text>{item.name}</Text>
            </Checkbox>
          </Pressable>
        )}
        onEndReached={clientVM.loadMore}
        onEndReachedThreshold={0.5}
        className="w-full gap-4"
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          clientVM.isLoading ? (
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
        showsVerticalScrollIndicator={false}
      />
      
      <Button
        onPress={onFinish}
        style={{ marginBottom: insets.bottom + 16 }}
        disabled={loading}
        loading={loading}
      >
        Finalizar Turno
      </Button>
    </ActionSheet>
  );
};
